import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'
import { authOptions } from '@/lib/auth/config'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { PagouAdapter } from '@/lib/payments/pagou'

const createChargeSchema = z.object({
  amount: z.number().min(0.01).max(50000),
  pixKey: z.string().min(1),
  productId: z.string().uuid().optional(),
  expiresInHours: z.number().min(1).max(24).default(24),
})

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

let pagouAdapter: PagouAdapter | null = null

function getPagouAdapter(): PagouAdapter {
  if (!pagouAdapter) {
    const publicKey = process.env.AKKADPAG_PUBLIC_KEY
    const secretKey = process.env.AKKADPAG_API_KEY
    const baseUrl = process.env.AKKADPAG_BASE_URL || 'https://api.akkadpag.com/v1'

    if (!publicKey || !secretKey) {
      throw new Error('AKKADPAG_PUBLIC_KEY and AKKADPAG_API_KEY are not configured')
    }

    pagouAdapter = new PagouAdapter(publicKey, secretKey, baseUrl)
  }

  return pagouAdapter
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { page, limit } = querySchema.parse(Object.fromEntries(request.nextUrl.searchParams))
    const skip = (page - 1) * limit

    const [charges, total] = await Promise.all([
      prisma.charge.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: { product: { select: { name: true } } },
      }),
      prisma.charge.count({ where: { userId: session.user.id } }),
    ])

    return NextResponse.json({
      data: charges,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = createChargeSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { amount, pixKey, productId, expiresInHours } = parsed.data

    const charge = await prisma.charge.create({
      data: {
        userId: session.user.id,
        productId,
        amount,
        pixKey,
        status: 'PENDING',
        expiresAt: new Date(Date.now() + expiresInHours * 60 * 60 * 1000),
      },
    })

    try {
      const akadpag = getPagouAdapter()
      const payment = await akadpag.createPayment(amount, pixKey, {
        external_ref: charge.id,
        buyer_email: session.user.email || undefined,
        buyer_name: session.user.name || undefined,
      })

      await prisma.charge.update({
        where: { id: charge.id },
        data: {
          providerTransactionId: payment.transactionId,
          qrCodeUrl: payment.qrCodeUrl,
          expiresAt: payment.expiresAt,
        },
      })

      return NextResponse.json({ data: charge }, { status: 201 })
    } catch (akkadpagError) {
      console.error('AKKADPAG API error:', akkadpagError)

      await prisma.charge.update({
        where: { id: charge.id },
        data: { status: 'FAILED' },
      })

      return NextResponse.json(
        { error: 'Failed to create Pix payment with AKKADPAG' },
        { status: 500 }
      )
    }
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    )
  }
}


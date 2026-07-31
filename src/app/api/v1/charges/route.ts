import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'
import { authOptions } from '@/lib/auth/config'
import { getServerSession } from 'auth.js'
import { z } from 'zod'

const createChargeSchema = z.object({
  amount: z.number().min(0.01).max(50000),
  pixKey: z.string().min(1),
  productId: z.string().uuid().optional(),
  expiresInHours: z.number().min(1).max(24).default(24),
})

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const charges = await prisma.charge.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 20,
    include: { product: { select: { name: true } } },
  })

  return NextResponse.json({ data: charges })
}

export async function POST(request: Request) {
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

  return NextResponse.json({ data: charge }, { status: 201 })
}
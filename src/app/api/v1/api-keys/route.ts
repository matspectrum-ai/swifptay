import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'
import { authOptions } from '@/lib/auth/config'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { createHmac, randomBytes } from 'crypto'

const createApiKeySchema = z.object({
  name: z.string().min(1).max(100),
  permissions: z.array(z.string()).default(['read', 'write']),
})

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { page, limit } = querySchema.parse(Object.fromEntries(request.nextUrl.searchParams))
    const skip = (page - 1) * limit

    const [apiKeys, total] = await Promise.all([
      prisma.apiKey.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: { id: true, name: true, permissions: true, lastUsedAt: true, isActive: true, createdAt: true },
      }),
      prisma.apiKey.count({ where: { userId: session.user.id } }),
    ])

    return NextResponse.json({
      data: apiKeys,
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
    const parsed = createApiKeySchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const rawKey = `spk_${randomBytes(32).toString('hex')}`
    const keyHash = createHmac('sha256', process.env.NEXTAUTH_SECRET!)
      .update(rawKey)
      .digest('hex')

    const apiKey = await prisma.apiKey.create({
      data: {
        userId: session.user.id,
        keyHash,
        name: parsed.data.name,
        permissions: parsed.data.permissions,
      },
    })

    const { keyHash: _, ...safeKey } = apiKey
    return NextResponse.json({ data: { ...safeKey, key: rawKey } }, { status: 201 })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

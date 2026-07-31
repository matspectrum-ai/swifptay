import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'
import { authOptions } from '@/lib/auth/config'
import { getServerSession } from 'auth.js'
import { z } from 'zod'
import { createHmac, randomBytes } from 'crypto'

const createApiKeySchema = z.object({
  name: z.string().min(1).max(100),
  permissions: z.array(z.string()).default(['read', 'write']),
})

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const apiKeys = await prisma.apiKey.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, permissions: true, lastUsedAt: true, isActive: true, createdAt: true },
  })

  return NextResponse.json({ data: apiKeys })
}

export async function POST(request: Request) {
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
  const keyHash = createHmac('sha256', process.env.NEXTAUTH_SECRET || 'fallback')
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

  return NextResponse.json({ data: { ...apiKey, key: rawKey } }, { status: 201 })
}
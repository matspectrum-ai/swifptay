import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'
import { authOptions } from '@/lib/auth/config'
import { getServerSession } from 'next-auth'
import { z } from 'zod'

const createWebhookSchema = z.object({
  url: z.string().url(),
  secret: z.string().min(1),
  events: z.array(z.enum(['charge.completed', 'charge.failed'])).default(['charge.completed', 'charge.failed']),
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

    const [webhooks, total] = await Promise.all([
      prisma.webhook.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: { id: true, url: true, events: true, isActive: true, createdAt: true },
      }),
      prisma.webhook.count({ where: { userId: session.user.id } }),
    ])

    return NextResponse.json({
      data: webhooks,
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
    const parsed = createWebhookSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const webhook = await prisma.webhook.create({
      data: {
        userId: session.user.id,
        url: parsed.data.url,
        secret: parsed.data.secret,
        events: parsed.data.events,
      },
    })

    return NextResponse.json({ data: webhook }, { status: 201 })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

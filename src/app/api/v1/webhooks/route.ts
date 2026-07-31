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

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const webhooks = await prisma.webhook.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    select: { id: true, url: true, events: true, isActive: true, createdAt: true },
  })

  return NextResponse.json({ data: webhooks })
}

export async function POST(request: Request) {
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
}
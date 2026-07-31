import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'
import { createHmac } from 'crypto'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('x-openpix-signature') || ''
  const webhookSecret = process.env.OPENPIX_WEBHOOK_SECRET || ''

  const expectedSignature = createHmac('sha256', webhookSecret)
    .update(body)
    .digest('hex')

  if (signature !== expectedSignature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const event = JSON.parse(body)

  if (event.type === 'charge.completed') {
    await prisma.charge.updateMany({
      where: { openpixTransactionId: event.data.transactionId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    })

    await prisma.transaction.create({
      data: {
        userId: event.data.userId,
        chargeId: event.data.chargeId,
        type: 'INCOME',
        method: 'PIX',
        amount: Number(event.data.amount),
        status: 'COMPLETED',
        provider: 'openpix',
        metadata: event.data,
      },
    })
  }

  if (event.type === 'charge.failed') {
    await prisma.charge.updateMany({
      where: { openpixTransactionId: event.data.transactionId },
      data: {
        status: 'FAILED',
        completedAt: new Date(),
      },
    })
  }

  return NextResponse.json({ received: true })
}
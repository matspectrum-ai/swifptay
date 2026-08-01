import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'

export async function POST(request: NextRequest) {
  const payload = await request.json()

  const eventType =
    String((payload as { event?: unknown }).event || '') ||
    String((payload as { event_type?: unknown }).event_type || '')
  const data = (payload as { data?: Record<string, unknown> }).data || (payload as Record<string, unknown>)

  const transactionId =
    String((data as { transaction_id?: unknown }).transaction_id || '') ||
    String((data as { id?: unknown }).id || '')

  const status =
    String((data as { status?: unknown }).status || '') ||
    String((data as { event_type?: unknown }).event_type || '') ||
    eventType

  if (transactionId && status) {
    const charge = await prisma.charge.findFirst({
      where: { providerTransactionId: transactionId },
    })

    if (charge) {
      await prisma.charge.update({
        where: { id: charge.id },
        data: {
          status: status.toUpperCase() as any,
          completedAt: status.toUpperCase() === 'PAID' ? new Date() : null,
        },
      })

      if (charge.id) {
        await prisma.transaction.updateMany({
          where: { chargeId: charge.id },
          data: {
            status: status.toUpperCase() as any,
            metadata: { ...((data as Record<string, unknown>) || {}), webhookEvent: eventType },
          },
        })
      }
    }
  }

  return NextResponse.json({ received: true })
}
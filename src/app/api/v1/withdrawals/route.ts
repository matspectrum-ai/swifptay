import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'
import { authOptions } from '@/lib/auth/config'
import { getServerSession } from 'next-auth'
import { z } from 'zod'

const createWithdrawalSchema = z.object({
  amount: z.number().min(10).max(5000),
  pixKey: z.string().min(1),
})

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const withdrawals = await prisma.withdrawal.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })

  return NextResponse.json({ data: withdrawals })
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = createWithdrawalSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { amount, pixKey } = parsed.data

  const balanceResult = await prisma.transaction.aggregate({
    where: { userId: session.user.id, type: 'INCOME', status: 'COMPLETED' },
    _sum: { amount: true },
  })

  const totalIncome = Number(balanceResult._sum.amount ?? 0)
  const totalWithdrawnResult = await prisma.withdrawal.aggregate({
    where: { userId: session.user.id, status: 'COMPLETED' },
    _sum: { amount: true },
  })
  const withdrawnAmount = Number(totalWithdrawnResult._sum.amount ?? 0)
  const availableBalance = totalIncome - withdrawnAmount

  if (amount > availableBalance) {
    return NextResponse.json(
      { error: 'Insufficient balance', availableBalance },
      { status: 400 }
    )
  }

  const withdrawal = await prisma.withdrawal.create({
    data: {
      userId: session.user.id,
      amount,
      pixKey,
      status: 'PROCESSING',
    },
  })

  return NextResponse.json({ data: withdrawal }, { status: 201 })
}
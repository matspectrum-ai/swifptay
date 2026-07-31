import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'
import { authOptions } from '@/lib/auth/config'
import { getServerSession } from 'next-auth'
import { z } from 'zod'

const createWithdrawalSchema = z.object({
  amount: z.number().min(10).max(5000),
  pixKey: z.string().min(1),
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

    const [withdrawals, total] = await Promise.all([
      prisma.withdrawal.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.withdrawal.count({ where: { userId: session.user.id } }),
    ])

    return NextResponse.json({
      data: withdrawals,
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
    const parsed = createWithdrawalSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { amount, pixKey } = parsed.data

    const [incomeResult, withdrawnResult] = await Promise.all([
      prisma.transaction.aggregate({
        where: { userId: session.user.id, type: 'INCOME', status: 'COMPLETED' },
        _sum: { amount: true },
      }),
      prisma.withdrawal.aggregate({
        where: { userId: session.user.id, status: 'COMPLETED' },
        _sum: { amount: true },
      }),
    ])

    const totalIncome = Number(incomeResult._sum.amount ?? 0)
    const withdrawnAmount = Number(withdrawnResult._sum.amount ?? 0)
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
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

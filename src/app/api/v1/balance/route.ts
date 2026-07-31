import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'
import { authOptions } from '@/lib/auth/config'
import { getServerSession } from 'auth.js'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [income, expenses] = await Promise.all([
    prisma.transaction.aggregate({
      where: { userId: session.user.id, type: 'INCOME', status: 'COMPLETED' },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: { userId: session.user.id, type: 'EXPENSE', status: 'COMPLETED' },
      _sum: { amount: true },
    }),
  ])

  const balance = (income._sum.amount ?? 0) - (expenses._sum.amount ?? 0)

  return NextResponse.json({
    data: {
      balance,
      totalIncome: income._sum.amount ?? 0,
      totalExpenses: expenses._sum.amount ?? 0,
    },
  })
}
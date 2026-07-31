import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'
import { authOptions } from '@/lib/auth/config'
import { getServerSession } from 'auth.js'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const status = searchParams.get('status') || undefined
  const type = searchParams.get('type') || undefined
  const dateFrom = searchParams.get('dateFrom') || undefined
  const dateTo = searchParams.get('dateTo') || undefined

  const where: Record<string, unknown> = { userId: session.user.id }

  if (status) where['status'] = status
  if (type) where['type'] = type
  if (dateFrom || dateTo) {
    where['createdAt'] = {}
    if (dateFrom) ;(where['createdAt'] as Record<string, unknown>)['gte'] = new Date(dateFrom)
    if (dateTo) ;(where['createdAt'] as Record<string, unknown>)['lte'] = new Date(dateTo)
  }

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.transaction.count({ where }),
  ])

  return NextResponse.json({
    data: transactions,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  })
}
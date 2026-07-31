import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'
import { authOptions } from '@/lib/auth/config'
import { getServerSession } from 'auth.js'
import { z } from 'zod'

const kycSchema = z.object({
  kycStatus: z.enum(['PENDING', 'VERIFIED', 'REJECTED']).optional(),
})

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { kycStatus: true },
  })

  const documents = await prisma.kycDocument.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({
    data: {
      kycStatus: user?.kycStatus || 'PENDING',
      documents,
    },
  })
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = kycSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { kycStatus: parsed.data.kycStatus },
  })

  return NextResponse.json({ data: { updated: true } })
}
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'
import { authOptions } from '@/lib/auth/config'
import { getServerSession } from 'next-auth'
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

  const updateData: Record<string, unknown> = {}
  if (parsed.data.kycStatus) {
    updateData.kycStatus = parsed.data.kycStatus
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json(
      { error: 'No valid fields to update' },
      { status: 400 }
    )
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: updateData,
  })

  return NextResponse.json({ data: { updated: true } })
}
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'
import { authOptions } from '@/lib/auth/config'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { randomBytes } from 'crypto'

const uploadDocumentSchema = z.object({
  type: z.string().min(1),
})

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = uploadDocumentSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const document = await prisma.kycDocument.create({
    data: {
      userId: session.user.id,
      type: parsed.data.type,
      status: 'PENDING',
      documentUrl: `https://swiftpay.com.br/documents/${randomBytes(16).toString('hex')}`,
    },
  })

  return NextResponse.json({ data: document }, { status: 201 })
}
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'
import { authOptions } from '@/lib/auth/config'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { randomBytes } from 'crypto'

const uploadDocumentSchema = z.object({
  type: z.string().min(1),
})

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const contentType = request.headers.get('content-type') || ''
  let type = ''
  let filename = ''

  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData()
    type = formData.get('type') as string
    const file = formData.get('file') as File | null
    filename = file?.name || `doc-${Date.now()}`
  } else {
    const body = await request.json()
    const parsed = uploadDocumentSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }
    type = parsed.data.type
    filename = `doc-${Date.now()}`
  }

  if (!type) {
    return NextResponse.json({ error: 'Document type is required' }, { status: 400 })
  }

  const document = await prisma.kycDocument.create({
    data: {
      userId: session.user.id,
      type,
      status: 'PENDING',
      documentUrl: `https://swiftpay.com.br/documents/${randomBytes(16).toString('hex')}/${filename}`,
    },
  })

  return NextResponse.json({ data: document }, { status: 201 })
}

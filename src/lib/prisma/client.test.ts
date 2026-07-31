import { describe, it, expect, beforeEach, afterEach, skipIf } from 'vitest'
import { prisma } from '@/lib/prisma/client'

const hasDb = !!process.env.DATABASE_URL

describe('prisma client', () => {
  beforeEach(async () => {
    if (hasDb) await prisma.$connect()
  })

  afterEach(async () => {
    if (hasDb) await prisma.$disconnect()
  })

  it.skipIf(!hasDb)('should connect to the database', async () => {
    const result = await prisma.$queryRaw`SELECT 1`
    expect(result).toBeDefined()
  })
})
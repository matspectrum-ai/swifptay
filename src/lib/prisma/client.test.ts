import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { prisma } from '@/lib/prisma/client'

describe('prisma client', () => {
  beforeEach(async () => {
    await prisma.$connect()
  })

  afterEach(async () => {
    await prisma.$disconnect()
  })

  it('should connect to the database', async () => {
    const result = await prisma.$queryRaw`SELECT 1`
    expect(result).toBeDefined()
  })
})
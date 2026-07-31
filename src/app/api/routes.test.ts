import { describe, it, expect } from 'vitest'

describe('API route structure', () => {
  it('charges route should exist', async () => {
    const module = await import('@/app/api/v1/charges/route')
    expect(module.GET).toBeDefined()
    expect(module.POST).toBeDefined()
  })

  it('products route should exist', async () => {
    const module = await import('@/app/api/v1/products/route')
    expect(module.GET).toBeDefined()
    expect(module.POST).toBeDefined()
  })

  it('transactions route should exist', async () => {
    const module = await import('@/app/api/v1/transactions/route')
    expect(module.GET).toBeDefined()
  })

  it('balance route should exist', async () => {
    const module = await import('@/app/api/v1/balance/route')
    expect(module.GET).toBeDefined()
  })

  it('withdrawals route should exist', async () => {
    const module = await import('@/app/api/v1/withdrawals/route')
    expect(module.GET).toBeDefined()
    expect(module.POST).toBeDefined()
  })

  it('health route should exist', async () => {
    const module = await import('@/app/api/health/route')
    expect(module.GET).toBeDefined()
  })
})
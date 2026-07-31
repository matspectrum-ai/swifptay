import { describe, it, expect } from 'vitest'
import { MultiPay } from '@/lib/payments/multipay'

describe('MultiPay', () => {
  it('should be instantiable', () => {
    const multipay = new MultiPay()
    expect(multipay).toBeInstanceOf(MultiPay)
  })

  it('should have createPayment method', () => {
    const multipay = new MultiPay()
    expect(typeof multipay.createPayment).toBe('function')
  })

  it('should have processWebhook method', () => {
    const multipay = new MultiPay()
    expect(typeof multipay.processWebhook).toBe('function')
  })

  it('should have getStatus method', () => {
    const multipay = new MultiPay()
    expect(typeof multipay.getStatus).toBe('function')
  })
})
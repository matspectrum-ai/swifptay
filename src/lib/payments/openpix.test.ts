import { describe, it, expect } from 'vitest'
import { OpenPixAdapter } from '@/lib/payments/openpix'

describe('OpenPixAdapter', () => {
  const adapter = new OpenPixAdapter('test-key', 'https://api.openpix.com.br')

  describe('healthCheck', () => {
    it('should return false for invalid API key', async () => {
      const result = await adapter.healthCheck()
      expect(result).toBe(false)
    })
  })

  describe('createPayment', () => {
    it('should throw error when API key is invalid', async () => {
      await expect(
        adapter.createPayment(100, '00000000000')
      ).rejects.toThrow()
    })
  })

  describe('getStatus', () => {
    it('should throw error when API key is invalid', async () => {
      await expect(
        adapter.getStatus('invalid-transaction-id')
      ).rejects.toThrow()
    })
  })
})
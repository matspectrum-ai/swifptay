import { describe, it, expect, vi, afterEach } from 'vitest'
import { OpenPixAdapter } from '@/lib/payments/openpix'

const mockFetch = vi.fn()

afterEach(() => {
  mockFetch.mockReset()
  vi.restoreAllMocks()
})

describe('OpenPixAdapter', () => {
  const adapter = new OpenPixAdapter('test-key', 'https://api.openpix.com.br')

  describe('healthCheck', () => {
    it('should return false for invalid API key', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 401 })
      vi.stubGlobal('fetch', mockFetch)

      const result = await adapter.healthCheck()
      expect(result).toBe(false)
    })
  })

  describe('createPayment', () => {
    it('should throw error when API key is invalid', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 401 })
      vi.stubGlobal('fetch', mockFetch)

      await expect(
        adapter.createPayment(100, '00000000000')
      ).rejects.toThrow()
    })
  })

  describe('getStatus', () => {
    it('should throw error when API key is invalid', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 401 })
      vi.stubGlobal('fetch', mockFetch)

      await expect(
        adapter.getStatus('invalid-transaction-id')
      ).rejects.toThrow()
    })
  })
})
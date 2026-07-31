import { describe, it, expect } from 'vitest'
import { cn, formatCurrency, formatDate, generateId, truncateAddress } from '@/lib/utils'

describe('utils', () => {
  describe('cn', () => {
    it('should merge class names', () => {
      expect(cn('px-4', 'py-2')).toBe('px-4 py-2')
    })

    it('should handle conditional classes', () => {
      expect(cn('px-4', false && 'py-2')).toBe('px-4')
    })
  })

  describe('formatCurrency', () => {
    it('should format BRL currency', () => {
      expect(formatCurrency(1500.5)).toBe('R$ 1.500,50')
    })

    it('should format zero', () => {
      expect(formatCurrency(0)).toBe('R$ 0,00')
    })
  })

  describe('formatDate', () => {
    it('should format date in pt-BR', () => {
      const date = new Date('2026-07-31T10:30:00Z')
      const result = formatDate(date)
      expect(result).toContain('31/07/2026')
    })
  })

  describe('generateId', () => {
    it('should generate a UUID', () => {
      const id = generateId()
      expect(typeof id).toBe('string')
      expect(id.length).toBe(36)
      expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
    })

    it('should generate unique IDs', () => {
      const ids = new Set([generateId(), generateId(), generateId()])
      expect(ids.size).toBe(3)
    })
  })

  describe('truncateAddress', () => {
    it('should truncate long addresses with defaults', () => {
      expect(truncateAddress('0x1234567890abcdef1234567890abcdef12345678')).toBe('0x1234...5678')
    })

    it('should truncate with custom start/end', () => {
      expect(truncateAddress('0x1234567890abcdef1234567890abcdef12345678', 8, 4)).toBe('0x123456...5678')
    })

    it('should return short addresses as-is', () => {
      expect(truncateAddress('0x1234')).toBe('0x1234')
    })
  })
})
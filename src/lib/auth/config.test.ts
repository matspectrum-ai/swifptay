import { describe, it, expect } from 'vitest'
import { authOptions } from '@/lib/auth/config'

describe('auth config', () => {
  it('should have Google provider configured', () => {
    const googleProvider = authOptions.providers.find(
      (p) => p.id === 'google'
    )
    expect(googleProvider).toBeDefined()
  })

  it('should use JWT session strategy', () => {
    expect(authOptions.session?.strategy).toBe('jwt')
  })

  it('should have signIn callback', () => {
    expect(typeof authOptions.callbacks?.signIn).toBe('function')
  })

  it('should have jwt callback', () => {
    expect(typeof authOptions.callbacks?.jwt).toBe('function')
  })

  it('should have session callback', () => {
    expect(typeof authOptions.callbacks?.session).toBe('function')
  })

  it('should redirect to /login on error', () => {
    expect(authOptions.pages?.error).toBe('/login')
  })
})
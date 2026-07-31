import { test, expect } from '@playwright/test'

test.describe('SwiftPay Pages', () => {
  test('login page loads', async ({ page }) => {
    await page.goto('/login')
    await expect(page).toHaveTitle(/SwiftPay/)
    await expect(page.locator('h1')).toHaveText('SwiftPay')
  })

  test('register page loads', async ({ page }) => {
    await page.goto('/register')
    await expect(page).toHaveTitle(/SwiftPay/)
  })

  test('dashboard redirects to login when unauthenticated', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForURL(/\/login/)
  })
})

test.describe('SwiftPay API', () => {
  test('health endpoint returns ok', async ({ request }) => {
    const response = await request.get('/api/health')
    await expect(response.status()).toBe(200)

    const body = await response.json()
    expect(body.status).toBe('ok')
  })

  test('charges endpoint requires auth', async ({ request }) => {
    const response = await request.get('/api/v1/charges')
    await expect(response.status()).toBe(401)
  })

  test('products endpoint requires auth', async ({ request }) => {
    const response = await request.get('/api/v1/products')
    await expect(response.status()).toBe(401)
  })

  test('transactions endpoint requires auth', async ({ request }) => {
    const response = await request.get('/api/v1/transactions')
    await expect(response.status()).toBe(401)
  })

  test('balance endpoint requires auth', async ({ request }) => {
    const response = await request.get('/api/v1/balance')
    await expect(response.status()).toBe(401)
  })

  test('withdrawals endpoint requires auth', async ({ request }) => {
    const response = await request.get('/api/v1/withdrawals')
    await expect(response.status()).toBe(401)
  })
})
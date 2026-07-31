import { test, expect } from '@playwright/test'

test.describe('SwiftPay Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('login form is visible', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('SwiftPay')
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('Google login button is visible', async ({ page }) => {
    await expect(page.locator('button:has-text("Entrar com Google")')).toBeVisible()
  })
})
import { test, expect, chromium } from '@playwright/test'

test('capture screenshots of all pages', async () => {
  const browser = await chromium.launch()
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } })
  const page = await context.newPage()

  await page.goto('http://localhost:3001/login')
  await page.waitForTimeout(1000)
  await page.screenshot({ path: 'e2e/screenshots/login.png', fullPage: true })

  await page.goto('http://localhost:3001/register')
  await page.waitForTimeout(1000)
  await page.screenshot({ path: 'e2e/screenshots/register.png', fullPage: true })

  await page.goto('http://localhost:3001/dashboard')
  await page.waitForTimeout(1000)
  await page.screenshot({ path: 'e2e/screenshots/dashboard.png', fullPage: true })

  await page.goto('http://localhost:3001/products')
  await page.waitForTimeout(1000)
  await page.screenshot({ path: 'e2e/screenshots/products.png', fullPage: true })

  await page.goto('http://localhost:3001/transactions')
  await page.waitForTimeout(1000)
  await page.screenshot({ path: 'e2e/screenshots/transactions.png', fullPage: true })

  await page.goto('http://localhost:3001/balance')
  await page.waitForTimeout(1000)
  await page.screenshot({ path: 'e2e/screenshots/balance.png', fullPage: true })

  await page.goto('http://localhost:3001/withdraw')
  await page.waitForTimeout(1000)
  await page.screenshot({ path: 'e2e/screenshots/withdraw.png', fullPage: true })

  await page.goto('http://localhost:3001/checkout')
  await page.waitForTimeout(1000)
  await page.screenshot({ path: 'e2e/screenshots/checkout.png', fullPage: true })

  await page.goto('http://localhost:3001/kyc')
  await page.waitForTimeout(1000)
  await page.screenshot({ path: 'e2e/screenshots/kyc.png', fullPage: true })

  await page.goto('http://localhost:3001/notifications')
  await page.waitForTimeout(1000)
  await page.screenshot({ path: 'e2e/screenshots/notifications.png', fullPage: true })

  await browser.close()
}, 60000)

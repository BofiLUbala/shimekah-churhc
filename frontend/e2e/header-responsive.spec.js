import { test, expect } from '@playwright/test'

const VIEWPORTS = [
  { width: 320, height: 568, name: 'iPhone SE' },
  { width: 375, height: 667, name: 'iPhone 8' },
  { width: 390, height: 844, name: 'iPhone 14' },
  { width: 768, height: 1024, name: 'iPad' },
  { width: 1024, height: 768, name: 'iPad landscape' },
  { width: 1440, height: 900, name: 'Desktop' },
]

for (const vp of VIEWPORTS) {
  test.describe(`Header at ${vp.name} (${vp.width}x${vp.height})`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } })

    test('header is visible', async ({ page }) => {
      await page.goto('/')
      const header = page.locator('.header')
      await expect(header).toBeVisible()
    })

    test('church name is visible', async ({ page }) => {
      await page.goto('/')
      await expect(page.locator('.header__name')).toBeVisible()
    })

    if (vp.width < 1024) {
      test('hamburger button is visible', async ({ page }) => {
        await page.goto('/')
        const toggle = page.locator('.nav-toggle')
        await expect(toggle).toBeVisible()
      })

      test('hamburger opens and closes menu', async ({ page }) => {
        await page.goto('/')
        const toggle = page.locator('.nav-toggle')
        const nav = page.locator('.nav')

        // Menu starts closed
        await expect(nav).not.toHaveClass(/nav--open/)
        await expect(toggle).toHaveAttribute('aria-expanded', 'false')

        // Click to open
        await toggle.click()
        await expect(nav).toHaveClass(/nav--open/)
        await expect(toggle).toHaveAttribute('aria-expanded', 'true')
        await expect(toggle).toHaveAttribute('aria-label', 'Fermer le menu')

        // Click to close
        await toggle.click()
        await expect(nav).not.toHaveClass(/nav--open/)
        await expect(toggle).toHaveAttribute('aria-expanded', 'false')
      })

      test('Escape closes the menu', async ({ page }) => {
        await page.goto('/')
        const toggle = page.locator('.nav-toggle')

        await toggle.click()
        await expect(page.locator('.nav')).toHaveClass(/nav--open/)

        await page.keyboard.press('Escape')
        await expect(page.locator('.nav')).not.toHaveClass(/nav--open/)
        await expect(toggle).toHaveAttribute('aria-expanded', 'false')
      })

      test('no horizontal overflow', async ({ page }) => {
        await page.goto('/')
        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
        expect(scrollWidth).toBeLessThanOrEqual(vp.width)
      })

      test('all nav links are accessible in open menu', async ({ page }) => {
        await page.goto('/')
        const toggle = page.locator('.nav-toggle')
        await toggle.click()

        const links = page.locator('.nav__link')
        const count = await links.count()
        expect(count).toBeGreaterThanOrEqual(8)

        for (let i = 0; i < count; i++) {
          await expect(links.nth(i)).toBeVisible()
        }
      })
    } else {
      test('desktop nav is visible without hamburger', async ({ page }) => {
        await page.goto('/')
        await expect(page.locator('.nav__list')).toBeVisible()
        await expect(page.locator('.nav-toggle')).not.toBeVisible()
      })
    }
  })
}

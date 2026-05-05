import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('renders the portfolio and navigates to key sections', async ({ page, isMobile }) => {
  await page.goto('/')

  await expect(page).toHaveTitle(/Jordi Sanchez \| Software Engineer/)
  await expect(page.getByRole('heading', { name: /backend engineer/i })).toBeVisible()

  const navigateTo = async (name) => {
    if (isMobile) {
      await page.locator('button[aria-controls="mobile-navigation"]').click()
    }

    await page.getByRole('link', { name, exact: true }).click()
  }

  await navigateTo('Projects')
  await expect(page.locator('#projects')).toBeInViewport()

  await navigateTo('Skills')
  await expect(page.locator('#skills')).toBeInViewport()

  await navigateTo('Contact')
  await expect(page.locator('#contact')).toBeInViewport()
  await expect(page.getByLabel(/full name/i)).toBeVisible()
  await expect(page.getByLabel(/^email$/i)).toBeVisible()
  await expect(page.getByRole('button', { name: /send message/i })).toBeVisible()
})

test('opens and closes the mobile navigation', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Mobile navigation is only visible in the mobile project')

  await page.goto('/')

  const menuButton = page.locator('button[aria-controls="mobile-navigation"]')
  await expect(menuButton).toHaveAccessibleName(/open navigation menu/i)
  await menuButton.click()
  await expect(menuButton).toHaveAccessibleName(/close navigation menu/i)
  await expect(page.getByRole('link', { name: 'About' })).toBeFocused()

  await page.keyboard.press('Escape')
  await expect(menuButton).toHaveAccessibleName(/open navigation menu/i)
  await expect(menuButton).toBeFocused()
})

test('has no serious automated accessibility violations', async ({ page }) => {
  await page.goto('/')

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze()

  expect(results.violations).toEqual([])
})

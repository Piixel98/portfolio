import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

async function navigateTo(page, isMobile, name) {
  if (isMobile) {
    await page.locator('button[aria-controls="mobile-navigation"]').click()
  }

  await page.getByRole('link', { name, exact: true }).click()
}

test('renders the portfolio and navigates to key sections', async ({ page, isMobile }) => {
  await page.goto('/')

  await expect(page).toHaveTitle(/Jordi Sanchez \| Software Engineer/)
  await expect(page.getByRole('heading', { name: /backend engineer/i })).toBeVisible()

  await navigateTo(page, isMobile, 'Projects')
  await expect(page.locator('#projects')).toBeInViewport()

  await navigateTo(page, isMobile, 'Skills')
  await expect(page.locator('#skills')).toBeInViewport()

  await navigateTo(page, isMobile, 'Contact')
  await expect(page.locator('#contact')).toBeInViewport()
  await expect(page.getByLabel(/full name/i)).toBeVisible()
  await expect(page.getByLabel(/^email$/i)).toBeVisible()
  await expect(page.getByRole('button', { name: /send message/i })).toBeVisible()
})

test('hero contact button lands at the start of contact on first load', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('link', { name: 'Contact Me' }).click()
  await expect(page.locator('#contact')).toBeInViewport()
  await expect(page.getByLabel(/full name/i)).toBeVisible()

  await expect
    .poll(() =>
      page.locator('#contact').evaluate((element) => Math.round(element.getBoundingClientRect().top)),
    )
    .toBeLessThanOrEqual(80)
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

test('opens and closes project details modal', async ({ page }) => {
  await page.goto('/')

  await page
    .getByRole('button', { name: /open project details/i })
    .first()
    .click()

  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog).toHaveAttribute('aria-modal', 'true')

  await page.keyboard.press('Escape')

  await expect(dialog).toBeHidden()
})

test('shows failed feedback when contact submission fails', async ({ page, isMobile }) => {
  await page.route('**/api/contact', (route) =>
    route.fulfill({
      contentType: 'application/json',
      status: 502,
      body: JSON.stringify({ message: 'Email provider rejected the request.' }),
    }),
  )

  await page.goto('/')
  await navigateTo(page, isMobile, 'Contact')
  await page.getByLabel(/full name/i).fill('Jordi Test')
  await page.getByLabel(/^email$/i).fill('jordi@example.com')
  await page.getByLabel(/message/i).fill('This should fail in the browser test.')
  await page.getByRole('button', { name: /send message/i }).click()

  await expect(page.getByText(/could not be sent/i)).toBeVisible()
})

test('captures a basic home page layout screenshot', async ({ page }) => {
  await page.goto('/')

  const screenshot = await page.screenshot({ fullPage: true })

  expect(screenshot.length).toBeGreaterThan(10_000)
})

test('has no serious automated accessibility violations', async ({ page }) => {
  await page.goto('/')

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze()

  expect(results.violations).toEqual([])
})

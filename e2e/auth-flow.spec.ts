import { test, expect } from './fixtures/auth'

test.describe('Auth flow', () => {
  test('happy path: new athlete login → verify → /onboarding', async ({ page }) => {
    await page.goto('/login')

    // Fill in a valid email and submit
    await page.getByRole('textbox').fill('athlete@test.com')
    await page.getByRole('button', { name: /login using strava/i }).click()

    // Should land on verify page showing the email
    await expect(page).toHaveURL(/\/verify/)
    await expect(page.getByText('athlete@test.com')).toBeVisible()

    // Type a valid 6-digit code — InputOTP uses a hidden input
    await page.locator('input[autocomplete]').pressSequentially('123456')

    // New athlete (onboardingCompletedAt is null) redirects to /onboarding
    await expect(page).toHaveURL(/\/onboarding/)
  })

  test('login error: fail@test.com shows error message', async ({ page }) => {
    await page.goto('/login')

    await page.getByRole('textbox').fill('fail@test.com')
    await page.getByRole('button', { name: /login using strava/i }).click()

    await expect(page.getByText('User not found')).toBeVisible()
    await expect(page).toHaveURL(/\/login/)
  })

  test('OTP error: code 000000 shows error message', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('textbox').fill('athlete@test.com')
    await page.getByRole('button', { name: /login using strava/i }).click()

    await expect(page).toHaveURL(/\/verify/)
    await page.locator('input[autocomplete]').pressSequentially('000000')

    await expect(page.getByText('Invalid code')).toBeVisible()
    await expect(page).toHaveURL(/\/verify/)
  })

  test('route guard: unauthenticated access to /chat redirects to /login', async ({ page }) => {
    await page.goto('/chat/conv_01')
    await expect(page).toHaveURL(/\/login/)
  })

  test('logout: clears session and protects routes', async ({ page, loginAs }) => {
    await loginAs()
    await page.goto('/plan')
    await expect(page).toHaveURL(/\/plan/)

    // On mobile the sidebar is inside a drawer — open it first.
    // Use a short-timeout click + catch so desktop (no toggle) passes silently.
    await page
      .getByRole('button', { name: /open menu/i })
      .click({ timeout: 5000 })
      .catch(() => {
        // desktop — no drawer toggle present, continue
      })

    // Open profile dropdown and click logout
    await page.getByRole('button', { name: /profile menu/i }).click()
    await page.getByRole('menuitem', { name: /logout/i }).click()

    await expect(page).toHaveURL(/\/login/)

    // Navigating to a protected route should redirect back to /login
    await page.goto('/plan')
    await expect(page).toHaveURL(/\/login/)
  })
})

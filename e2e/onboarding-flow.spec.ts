import { test, expect } from './fixtures/auth'

test.describe('Onboarding flow', () => {
  test('new athlete is redirected to /onboarding after login', async ({ page, loginAs }) => {
    await loginAs({ onboardingCompletedAt: null })
    await page.goto('/')
    await expect(page).toHaveURL(/\/onboarding/)
  })

  test('returning athlete skips onboarding and lands in chat', async ({ page, loginAs }) => {
    await loginAs()
    await page.goto('/')
    await expect(page).toHaveURL(/\/chat\//)
  })

  test("welcome screen shows Strava metrics and Let's Go CTA", async ({ page, loginAs }) => {
    await loginAs({ onboardingCompletedAt: null })
    await page.goto('/onboarding')

    await expect(page.getByText('Total Runs')).toBeVisible()
    await expect(page.getByText('Avg Weekly')).toBeVisible()
    await expect(page.getByText('Longest Run')).toBeVisible()
    await expect(page.getByRole('button', { name: /let's go/i })).toBeVisible()
  })

  test('critical path: new athlete completes all 8 steps and lands in chat', async ({
    page,
    loginAs,
  }) => {
    await loginAs({ onboardingCompletedAt: null })
    await page.goto('/onboarding')

    // Welcome screen — click Let's Go
    await page.getByRole('button', { name: /let's go/i }).click()

    // Step 1 — runner type confirmation
    await expect(page.getByText(/Step 1\/8/)).toBeVisible()
    await page.getByRole('button', { name: /yes, that sounds right/i }).click()

    // Step 2 — primary goal
    await expect(page.getByText(/Step 2\/8/)).toBeVisible()
    await page.getByRole('button', { name: /sub-4hr marathon/i }).click()

    // Step 3 — target race (skippable)
    await expect(page.getByText(/Step 3\/8/)).toBeVisible()
    await page.getByText(/skip this step/i).click()

    // Step 4 — weekly availability
    await expect(page.getByText(/Step 4\/8/)).toBeVisible()
    await page.getByRole('button', { name: /4 days/i }).click()

    // Step 5 — injuries
    await expect(page.getByText(/Step 5\/8/)).toBeVisible()
    await page.getByRole('button', { name: /^none$/i }).click()

    // Step 6 — coaching style
    await expect(page.getByText(/Step 6\/8/)).toBeVisible()
    await page.getByRole('button', { name: /data-driven/i }).click()

    // Step 7 — catch-all (skippable)
    await expect(page.getByText(/Step 7\/8/)).toBeVisible()
    await page.getByText(/skip this step/i).click()

    // Step 8 — summary review
    await expect(page.getByText(/Step 8\/8/)).toBeVisible()
    await expect(page.getByText(/looks right/i)).toBeVisible()
    await page.getByRole('button', { name: /looks good/i }).click()

    // Should land in chat with a coach opening message
    await expect(page).toHaveURL(/\/chat\//)
    await expect(page.getByText(/onboarding/i)).toBeVisible()
  })
})

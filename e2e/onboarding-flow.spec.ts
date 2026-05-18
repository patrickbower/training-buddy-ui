import { test, expect } from './fixtures/auth'

test.describe('Onboarding flow', () => {
  test('new athlete lands in chat where onboarding takes place', async ({ page, loginAs }) => {
    await loginAs({ onboardingCompletedAt: null })
    await page.goto('/')
    await expect(page).toHaveURL(/\/onboarding\/chat/)
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
    await expect(page.getByText('Longest')).toBeVisible()
    await expect(page.getByRole('button', { name: /let's go/i })).toBeVisible()
  })

  test('critical path: new athlete completes all 7 onboarding steps in chat', async ({
    page,
    loginAs,
  }) => {
    await loginAs({ onboardingCompletedAt: null })
    await page.goto('/onboarding')

    // Welcome screen — click Let's Go to enter chat
    await page.getByRole('button', { name: /let's go/i }).click()
    await expect(page).toHaveURL(/\/onboarding\/chat/)

    // Step 1 — runner type (seeded in conversation)
    await expect(page.getByText(/Profile · Step 1 of 7/)).toBeVisible()
    await page.getByRole('button', { name: /yes, that sounds right/i }).click()

    // Step 2 — primary goal
    await expect(page.getByText(/Profile · Step 2 of 7/)).toBeVisible()
    await page.getByRole('button', { name: /sub-4hr marathon/i }).click()

    // Step 3 — target race
    await expect(page.getByText(/Profile · Step 3 of 7/)).toBeVisible()
    await page.getByRole('button', { name: /london marathon/i }).click()

    // Step 4 — weekly availability
    await expect(page.getByText(/Profile · Step 4 of 7/)).toBeVisible()
    await page.getByRole('button', { name: /4 days/i }).click()

    // Step 5 — injuries
    await expect(page.getByText(/Profile · Step 5 of 7/)).toBeVisible()
    await page.getByRole('button', { name: /^none$/i }).click()

    // Step 6 — coaching style
    await expect(page.getByText(/Profile · Step 6 of 7/)).toBeVisible()
    await page.getByRole('button', { name: /data-driven/i }).click()

    // Step 7 — catch-all
    await expect(page.getByText(/Profile · Step 7 of 7/)).toBeVisible()
    await page.getByRole('button', { name: /nothing else/i }).click()

    // Synthesis — profile complete
    await expect(page.getByText(/Profile complete/i)).toBeVisible()
  })
})

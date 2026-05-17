import { test as base, type Page } from '@playwright/test'

interface AuthOptions {
  email?: string
  onboardingCompletedAt?: string | null
}

/**
 * Writes auth state to localStorage before page navigation.
 * Matches the shape Zustand `persist` middleware writes under the key 'auth'.
 *
 * Defaults to a returning athlete (onboardingCompletedAt set).
 * Pass `onboardingCompletedAt: null` to simulate a new athlete who must onboard.
 */
async function setAuthState(
  page: Page,
  { email = 'athlete@test.com', onboardingCompletedAt = '2026-01-16T10:00:00Z' }: AuthOptions = {},
) {
  await page.addInitScript(
    ({ storedEmail, storedOnboardingCompletedAt }) => {
      if (!localStorage.getItem('__auth_seeded__')) {
        localStorage.setItem(
          'auth',
          JSON.stringify({
            state: {
              isAuthenticated: true,
              email: storedEmail,
              onboardingCompletedAt: storedOnboardingCompletedAt,
            },
            version: 0,
          }),
        )
        localStorage.setItem('__auth_seeded__', '1')
      }
    },
    { storedEmail: email, storedOnboardingCompletedAt: onboardingCompletedAt },
  )
}

export const test = base.extend<{ loginAs: (options?: AuthOptions) => Promise<void> }>({
  loginAs: async ({ page }, use) => {
    await use((options?: AuthOptions) => setAuthState(page, options))
  },
})

export { expect } from '@playwright/test'

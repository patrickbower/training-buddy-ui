import { test as base, type Page } from '@playwright/test'

/**
 * Writes a logged-in auth state to localStorage before page navigation.
 * Matches the shape Zustand `persist` middleware writes under the key 'auth'.
 */
async function setAuthState(page: Page, email = 'athlete@test.com') {
  await page.addInitScript((storedEmail) => {
    localStorage.setItem(
      'auth',
      JSON.stringify({
        state: { isAuthenticated: true, email: storedEmail },
        version: 0,
      }),
    )
  }, email)
}

export const test = base.extend<{ loginAs: (email?: string) => Promise<void> }>({
  loginAs: async ({ page }, use) => {
    await use((email?: string) => setAuthState(page, email))
  },
})

export { expect } from '@playwright/test'

import { test as base, type Page } from '@playwright/test'

/**
 * Writes a logged-in auth state to localStorage before page navigation.
 * Matches the shape Zustand `persist` middleware writes under the key 'auth'.
 */
async function setAuthState(page: Page, email = 'athlete@test.com') {
  // addInitScript runs on every navigation in the page context. Use a one-time
  // flag so subsequent navigations (e.g. after logout) don't re-seed auth state.
  await page.addInitScript((storedEmail) => {
    if (!localStorage.getItem('__auth_seeded__')) {
      localStorage.setItem(
        'auth',
        JSON.stringify({
          state: { isAuthenticated: true, email: storedEmail },
          version: 0,
        }),
      )
      localStorage.setItem('__auth_seeded__', '1')
    }
  }, email)
}

export const test = base.extend<{ loginAs: (email?: string) => Promise<void> }>({
  loginAs: async ({ page }, use) => {
    await use((email?: string) => setAuthState(page, email))
  },
})

export { expect } from '@playwright/test'

import { test, expect } from '@playwright/test'

// TODO: unskip once the chat UI is implemented
test.describe.skip('Coach chat', () => {
  test('athlete can send a message and receive a coach response', async ({ page }) => {
    await page.goto('/')

    // The chat input should be visible on load (chat-first interface)
    const input = page.getByRole('textbox', { name: /message/i })
    await expect(input).toBeVisible()

    // Send a message
    await input.fill('What should I focus on this week?')
    await page.getByRole('button', { name: /send/i }).click()

    // Athlete message appears in the conversation
    await expect(page.getByRole('log')).toContainText('What should I focus on this week?')

    // Coach response appears (may take a moment)
    await expect(page.getByRole('log')).toContainText(/coach/i, { timeout: 5000 })
  })

  test('input is cleared after sending', async ({ page }) => {
    await page.goto('/')

    const input = page.getByRole('textbox', { name: /message/i })
    await input.fill('Hello coach')
    await page.getByRole('button', { name: /send/i }).click()

    await expect(input).toHaveValue('')
  })
})

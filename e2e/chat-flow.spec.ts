import { test, expect } from './fixtures/auth'

// conv_01 is the seed conversation ID from src/mocks/data/conversation.ts
const SEED_CONVERSATION_ID = 'conv_01'

test.describe('Coach chat', () => {
  test.beforeEach(async ({ page, loginAs }) => {
    await loginAs()
    await page.goto(`/chat/${SEED_CONVERSATION_ID}`)
  })

  test('seed conversation messages are visible on load', async ({ page }) => {
    const log = page.getByRole('log', { name: /conversation/i })
    await expect(log).toBeVisible()
    // First message is from the coach — check it contains expected seed text
    await expect(log).toContainText("Hi Alex! I've reviewed your goals")
  })

  test('athlete can send a message and it appears in the conversation', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /message/i })
    await input.fill('What should I focus on this week?')
    await page.getByRole('button', { name: /send/i }).click()

    await expect(page.getByRole('log')).toContainText('What should I focus on this week?')
  })

  test('input is cleared after sending', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /message/i })
    await input.fill('Hello coach')
    await page.getByRole('button', { name: /send/i }).click()

    await expect(input).toHaveValue('')
  })
})

# Testing Conventions

Test-driven development is the default. Write the test first, then the implementation.

## Stack

- **Vitest** — unit and component tests (config: `vitest.config.ts`)
- **React Testing Library** — component behaviour testing
- **Playwright** — E2E critical path tests (config: `playwright.config.ts`)
- **MSW** — API mocking in both unit and E2E contexts

## Rules

- No snapshot tests. They are brittle and generate noise.
- Test behaviour, not implementation. Query by role, label, and text — not by class or test ID.
- Use `data-testid` only as a last resort when no semantic selector is available.
- Every new component ships with at least one test covering its primary behaviour.
- Every new API hook ships with a test covering loading, success, and error states.

## Test file location

Co-locate unit and component tests with the source file:

```
src/components/chat/
  ChatInput.tsx
  ChatInput.test.tsx
```

E2E tests live in `e2e/`:

```
e2e/
  chat-flow.spec.ts
  training-plan.spec.ts
```

## Component test pattern

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChatInput } from './ChatInput'

describe('ChatInput', () => {
  it('calls onSend with the message text when the user submits', async () => {
    const user = userEvent.setup()
    const onSend = vi.fn()

    render(<ChatInput onSend={onSend} />)

    await user.type(
      screen.getByRole('textbox', { name: /message/i }),
      'How far should I run today?',
    )
    await user.click(screen.getByRole('button', { name: /send/i }))

    expect(onSend).toHaveBeenCalledWith('How far should I run today?')
  })
})
```

## Wrapping with providers

Use the test wrapper in `src/test/utils.tsx` to render components that need QueryClient or Zustand:

```tsx
import { renderWithProviders } from '@/test/utils'
```

## E2E pattern (Playwright)

```ts
import { test, expect } from '@playwright/test'

test('athlete can send a message and receive a coach response', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('textbox', { name: /message/i }).fill('What should I do today?')
  await page.getByRole('button', { name: /send/i }).click()
  await expect(page.getByRole('log')).toContainText("Here's your plan")
})
```

See [MOCKING.md](MOCKING.md) for how MSW handlers are loaded in tests.

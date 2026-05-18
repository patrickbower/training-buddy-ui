import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/utils'
import { ChatCard } from './ChatCard'
import type { MessageCard } from '@/types/domain'

const synthesisCard: MessageCard = {
  title: "You're all set!",
  body: 'Your coaching profile is saved.',
  cta: { label: "Let's build your plan →", to: '/' },
}

describe('ChatCard — onCtaPress', () => {
  it('calls onCtaPress when provided and CTA is pressed', async () => {
    const user = userEvent.setup()
    const onCtaPress = vi.fn()

    renderWithProviders(<ChatCard card={synthesisCard} onCtaPress={onCtaPress} />)

    await user.click(screen.getByRole('button', { name: "Let's build your plan →" }))

    expect(onCtaPress).toHaveBeenCalledOnce()
  })

  it('does not call onCtaPress when it is not provided', () => {
    const onCtaPress = vi.fn()

    // Render without onCtaPress — button still exists, onCtaPress never called
    renderWithProviders(<ChatCard card={synthesisCard} />)

    // The button renders fine
    expect(screen.getByRole('button', { name: "Let's build your plan →" })).toBeInTheDocument()
    expect(onCtaPress).not.toHaveBeenCalled()
  })
})

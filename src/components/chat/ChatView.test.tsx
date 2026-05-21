import { describe, it, expect, beforeAll, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/utils'
import { ChatView } from './ChatView'
import type { CoachMessage } from '@/types/domain'

beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = vi.fn()
})

const baseMessage = (overrides: Partial<CoachMessage> = {}): CoachMessage => ({
  id: 'msg_01',
  conversationId: 'conv_01',
  role: 'coach',
  content: 'Does that feel right?',
  quickReplies: ['Yes', 'No'],
  onboardingStep: null,
  card: null,
  createdAt: '2026-03-25T10:00:00Z',
  ...overrides,
})

const defaultProps = {
  messages: [baseMessage()],
  sendMessage: vi.fn(),
  isPending: false,
}

describe('ChatView — quickReplies', () => {
  it('shows chips on the last message', () => {
    renderWithProviders(<ChatView {...defaultProps} />)
    expect(screen.getByRole('button', { name: 'Yes' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'No' })).toBeInTheDocument()
  })

  it('does not show chips from earlier messages', () => {
    const messages = [
      baseMessage({ id: 'msg_01', content: 'Earlier', quickReplies: ['Old chip'] }),
      baseMessage({ id: 'msg_02', content: 'Latest', quickReplies: ['New chip'] }),
    ]
    renderWithProviders(<ChatView {...defaultProps} messages={messages} />)
    expect(screen.queryByRole('button', { name: 'Old chip' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'New chip' })).toBeInTheDocument()
  })

  it('clicking a chip calls sendMessage with the chip text', async () => {
    const user = userEvent.setup()
    const sendMessage = vi.fn()
    renderWithProviders(<ChatView {...defaultProps} sendMessage={sendMessage} />)
    await user.click(screen.getByRole('button', { name: 'Yes' }))
    expect(sendMessage).toHaveBeenCalledWith('Yes')
  })
})

describe('ChatView — pending state', () => {
  it('shows "Thinking…" while isPending is true', () => {
    renderWithProviders(<ChatView {...defaultProps} isPending={true} />)
    expect(screen.getByText('Thinking…')).toBeInTheDocument()
  })

  it('does not show "Thinking…" when isPending is false', () => {
    renderWithProviders(<ChatView {...defaultProps} isPending={false} />)
    expect(screen.queryByText('Thinking…')).not.toBeInTheDocument()
  })
})

describe('ChatView — input visibility', () => {
  it('shows the input by default', () => {
    renderWithProviders(<ChatView {...defaultProps} />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('hides the input when hasSynthesis is true', () => {
    renderWithProviders(<ChatView {...defaultProps} hasSynthesis={true} />)
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })
})

describe('ChatView — onboarding mode', () => {
  it('shows the logo intro heading when showLogo is true', () => {
    renderWithProviders(<ChatView {...defaultProps} showLogo />)
    expect(screen.getByText(/as your coach, let me start/i)).toBeInTheDocument()
  })

  it('does not show the logo intro heading by default', () => {
    renderWithProviders(<ChatView {...defaultProps} />)
    expect(screen.queryByText(/as your coach, let me start/i)).not.toBeInTheDocument()
  })

  it('calls onSynthesisCtaPress when the synthesis card CTA is pressed', async () => {
    const user = userEvent.setup()
    const onSynthesisCtaPress = vi.fn()
    const synthesisMessage = baseMessage({
      onboardingStep: { index: 7, total: 7, complete: true },
      card: {
        title: "You're all set!",
        body: 'Profile saved.',
        cta: { label: "Let's go →", to: '/' },
      },
      quickReplies: null,
    })
    renderWithProviders(
      <ChatView
        {...defaultProps}
        messages={[synthesisMessage]}
        hasSynthesis={true}
        onSynthesisCtaPress={onSynthesisCtaPress}
      />,
    )
    await user.click(screen.getByRole('button', { name: /let's go/i }))
    expect(onSynthesisCtaPress).toHaveBeenCalled()
  })
})

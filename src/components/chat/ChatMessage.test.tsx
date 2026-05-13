import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/utils'
import { ChatMessage } from './ChatMessage'
import type { CoachMessage } from '@/types/domain'

const coachMessage: CoachMessage = {
  id: 'msg_01',
  conversationId: 'conv_01',
  role: 'coach',
  content: 'Hi there! Ready to start your training plan?',
  quickReplies: null,
  onboardingStep: null,
  card: null,
  createdAt: '2026-03-25T10:00:00Z',
}

const athleteMessage: CoachMessage = {
  id: 'msg_02',
  conversationId: 'conv_01',
  role: 'athlete',
  content: "Yes, let's do it!",
  quickReplies: null,
  onboardingStep: null,
  card: null,
  createdAt: '2026-03-25T10:01:00Z',
}

describe('ChatMessage', () => {
  it('renders coach message content', () => {
    renderWithProviders(<ChatMessage message={coachMessage} />)
    expect(screen.getByText('Hi there! Ready to start your training plan?')).toBeInTheDocument()
  })

  it('renders athlete message content', () => {
    renderWithProviders(<ChatMessage message={athleteMessage} />)
    expect(screen.getByText(/yes, let.s do it/i)).toBeInTheDocument()
  })

  it('renders a "Training Buddy" label above coach messages', () => {
    renderWithProviders(<ChatMessage message={coachMessage} />)
    expect(screen.getByText('Training Buddy')).toBeInTheDocument()
  })

  it('does not render a "Training Buddy" label for athlete messages', () => {
    renderWithProviders(<ChatMessage message={athleteMessage} />)
    expect(screen.queryByText('Training Buddy')).not.toBeInTheDocument()
  })

  it('renders markdown bold as strong text', () => {
    const msg: CoachMessage = {
      ...coachMessage,
      content: 'You are targeting a **sub-4hr marathon** by October',
    }
    renderWithProviders(<ChatMessage message={msg} />)
    expect(screen.getByText('sub-4hr marathon')).toBeInTheDocument()
    expect(screen.getByText('sub-4hr marathon').tagName).toBe('STRONG')
  })
})

describe('ChatMessage — quickReplies', () => {
  const messageWithChips: CoachMessage = {
    id: 'msg_10',
    conversationId: 'conv_01',
    role: 'coach',
    content: 'Does that feel right?',
    quickReplies: ['Yes', 'No', 'Not sure'],
    onboardingStep: null,
    card: null,
    createdAt: '2026-03-25T10:00:00Z',
  }

  it('renders chips when quickReplies and onQuickReply are provided', () => {
    renderWithProviders(<ChatMessage message={messageWithChips} onQuickReply={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Yes' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'No' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Not sure' })).toBeInTheDocument()
  })

  it('does not render chips when onQuickReply is not provided', () => {
    renderWithProviders(<ChatMessage message={messageWithChips} />)
    expect(screen.queryByRole('button', { name: 'Yes' })).not.toBeInTheDocument()
  })

  it('calls onQuickReply with chip text when a chip is clicked', async () => {
    const user = userEvent.setup()
    const onQuickReply = vi.fn()
    renderWithProviders(<ChatMessage message={messageWithChips} onQuickReply={onQuickReply} />)

    await user.click(screen.getByRole('button', { name: 'Yes' }))

    expect(onQuickReply).toHaveBeenCalledWith('Yes')
  })
})

describe('ChatMessage — onboardingStep', () => {
  it('shows step indicator when onboardingStep is set', () => {
    const msg: CoachMessage = {
      ...coachMessage,
      onboardingStep: { index: 3, total: 7 },
    }
    renderWithProviders(<ChatMessage message={msg} />)
    expect(screen.getByText('Step 3 of 7')).toBeInTheDocument()
  })

  it('does not show step indicator when onboardingStep is null', () => {
    renderWithProviders(<ChatMessage message={coachMessage} />)
    expect(screen.queryByText(/step \d+ of \d+/i)).not.toBeInTheDocument()
  })
})

describe('ChatMessage — card', () => {
  it('renders a card when card is set', () => {
    const msg: CoachMessage = {
      ...coachMessage,
      card: {
        title: "You're all set!",
        body: 'Your coaching profile is saved.',
      },
    }
    renderWithProviders(<ChatMessage message={msg} />)
    expect(screen.getByText("You're all set!")).toBeInTheDocument()
    expect(screen.getByText('Your coaching profile is saved.')).toBeInTheDocument()
  })

  it('does not render a card when card is null', () => {
    renderWithProviders(<ChatMessage message={coachMessage} />)
    expect(screen.queryByText("You're all set!")).not.toBeInTheDocument()
  })

  it('renders the card CTA button when cta is provided', () => {
    const msg: CoachMessage = {
      ...coachMessage,
      card: {
        title: "You're all set!",
        body: 'Your coaching profile is saved.',
        cta: { label: "Let's build your plan →", to: '/' },
      },
    }
    renderWithProviders(<ChatMessage message={msg} />)
    expect(screen.getByRole('button', { name: "Let's build your plan →" })).toBeInTheDocument()
  })
})

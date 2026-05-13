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
  createdAt: '2026-03-25T10:00:00Z',
}

const athleteMessage: CoachMessage = {
  id: 'msg_02',
  conversationId: 'conv_01',
  role: 'athlete',
  content: "Yes, let's do it!",
  quickReplies: null,
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

  it('renders a "Thought" label above coach messages', () => {
    renderWithProviders(<ChatMessage message={coachMessage} />)
    expect(screen.getByText('Thought')).toBeInTheDocument()
  })

  it('does not render a "Thought" label for athlete messages', () => {
    renderWithProviders(<ChatMessage message={athleteMessage} />)
    expect(screen.queryByText('Thought')).not.toBeInTheDocument()
  })

  it('does not render an avatar for coach messages', () => {
    renderWithProviders(<ChatMessage message={coachMessage} />)
    expect(screen.queryByRole('img', { name: /training buddy/i })).not.toBeInTheDocument()
  })

  it('does not render an avatar for athlete messages', () => {
    renderWithProviders(<ChatMessage message={athleteMessage} />)
    expect(screen.queryByRole('img', { name: /athlete/i })).not.toBeInTheDocument()
  })
})

describe('ChatMessage — quickReplies', () => {
  const messageWithChips: CoachMessage = {
    id: 'msg_10',
    conversationId: 'conv_01',
    role: 'coach',
    content: 'Does that feel right?',
    quickReplies: ['Yes', 'No', 'Not sure'],
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

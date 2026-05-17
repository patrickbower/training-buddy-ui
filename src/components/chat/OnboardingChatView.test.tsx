import { describe, it, expect, beforeAll, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '@/mocks/server'
import { renderWithProviders } from '@/test/utils'
import { useAuthStore } from '@/stores/authStore'
import { OnboardingChatView } from './OnboardingChatView'
import type { Conversation } from '@/types/domain'

beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = vi.fn()
})

const conversationWithSynthesis: Conversation = {
  id: 'conv_01',
  athleteId: 'ath_01',
  createdAt: '2026-03-25T10:00:00Z',
  updatedAt: '2026-03-25T10:10:00Z',
  messages: [
    {
      id: 'msg_01',
      conversationId: 'conv_01',
      role: 'coach',
      content: "Here's what I know about you.",
      quickReplies: null,
      onboardingStep: { index: 7, total: 7, complete: true },
      card: {
        title: "You're all set!",
        body: 'Your coaching profile is saved.',
        cta: { label: "Let's build your plan →", to: '/' },
      },
      createdAt: '2026-03-25T10:10:00Z',
    },
  ],
}

describe('OnboardingChatView — completeOnboarding', () => {
  it('calls completeOnboarding when the synthesis message is visible', async () => {
    useAuthStore.setState({ onboardingCompletedAt: null })

    server.use(http.get('/api/conversation', () => HttpResponse.json(conversationWithSynthesis)))

    renderWithProviders(<OnboardingChatView />)

    await waitFor(() => {
      expect(screen.getByText("Here's what I know about you.")).toBeInTheDocument()
    })

    expect(useAuthStore.getState().onboardingCompletedAt).not.toBeNull()
  })

  it('does not overwrite onboardingCompletedAt when it is already set', async () => {
    useAuthStore.setState({ onboardingCompletedAt: '2026-01-01T00:00:00Z' })

    server.use(http.get('/api/conversation', () => HttpResponse.json(conversationWithSynthesis)))

    renderWithProviders(<OnboardingChatView />)

    await waitFor(() => {
      expect(screen.getByText("Here's what I know about you.")).toBeInTheDocument()
    })

    expect(useAuthStore.getState().onboardingCompletedAt).toBe('2026-01-01T00:00:00Z')
  })
})

import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http, HttpResponse } from 'msw'
import { server } from '@/mocks/server'
import { useAuthStore } from '@/stores/authStore'
import { seedConversation } from '@/mocks/data/conversation'
import type { CoachMessage } from '@/types/domain'
import { useOnboardingChat } from './useOnboardingChat'

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

const synthesisMessage: CoachMessage = {
  id: 'msg_synth',
  conversationId: seedConversation.id,
  role: 'coach',
  content: "Here's your summary",
  quickReplies: null,
  onboardingStep: { index: 7, total: 7, complete: true },
  card: null,
  createdAt: new Date().toISOString(),
}

describe('useOnboardingChat', () => {
  beforeEach(() => {
    useAuthStore.setState({
      isAuthenticated: true,
      email: 'test@test.com',
      onboardingCompletedAt: null,
    })
  })

  it('hasSynthesis is false when no message has onboardingStep.complete', async () => {
    const { result } = renderHook(() => useOnboardingChat(), { wrapper: createWrapper() })
    await waitFor(() => {
      expect(result.current.messages.length).toBeGreaterThan(0)
    })
    expect(result.current.hasSynthesis).toBe(false)
  })

  it('hasSynthesis is true when a message has onboardingStep.complete === true', async () => {
    server.use(
      http.get('/api/conversation', () =>
        HttpResponse.json({
          ...seedConversation,
          messages: [...seedConversation.messages, synthesisMessage],
        }),
      ),
    )
    const { result } = renderHook(() => useOnboardingChat(), { wrapper: createWrapper() })
    await waitFor(() => {
      expect(result.current.hasSynthesis).toBe(true)
    })
  })

  it('calls complete() and sets onboardingCompletedAt when synthesis is detected', async () => {
    server.use(
      http.get('/api/conversation', () =>
        HttpResponse.json({
          ...seedConversation,
          messages: [...seedConversation.messages, synthesisMessage],
        }),
      ),
    )
    const { result } = renderHook(() => useOnboardingChat(), { wrapper: createWrapper() })
    await waitFor(() => {
      expect(result.current.hasSynthesis).toBe(true)
    })
    expect(useAuthStore.getState().onboardingCompletedAt).not.toBeNull()
  })
})

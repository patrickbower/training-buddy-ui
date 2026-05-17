import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http, HttpResponse } from 'msw'
import { server } from '@/mocks/server'
import { useConversation } from './useConversation'
import { useAuthStore } from '@/stores/authStore'
import { seedAthlete } from '@/mocks/data/athlete'

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useConversation — onboarding completion', () => {
  beforeEach(() => {
    useAuthStore.setState({
      isAuthenticated: true,
      email: 'athlete@test.com',
      onboardingCompletedAt: null,
    })
  })

  it('calls completeOnboarding when athlete gains onboardingCompletedAt after stream close', async () => {
    server.use(
      http.get('/api/athlete', () =>
        HttpResponse.json({ ...seedAthlete, onboardingCompletedAt: '2026-05-13T10:00:00Z' }),
      ),
    )

    const { result } = renderHook(() => useConversation(), { wrapper: createWrapper() })

    await waitFor(() => {
      expect(result.current.messages.length).toBeGreaterThan(0)
    })

    result.current.sendMessage('Yes, that sounds right')

    await waitFor(() => {
      expect(result.current.isPending).toBe(false)
    })

    expect(useAuthStore.getState().onboardingCompletedAt).toBe('2026-05-13T10:00:00Z')
  })

  it('does not call completeOnboarding when onboardingCompletedAt was already set', async () => {
    useAuthStore.setState({
      isAuthenticated: true,
      email: 'athlete@test.com',
      onboardingCompletedAt: '2026-01-16T10:00:00Z',
    })

    const { result } = renderHook(() => useConversation(), { wrapper: createWrapper() })

    await waitFor(() => {
      expect(result.current.messages.length).toBeGreaterThan(0)
    })

    result.current.sendMessage('Another message')

    await waitFor(() => {
      expect(result.current.isPending).toBe(false)
    })

    expect(useAuthStore.getState().onboardingCompletedAt).toBe('2026-01-16T10:00:00Z')
  })
})

describe('useConversation', () => {
  it('returns an empty array while loading', () => {
    const { result } = renderHook(() => useConversation(), { wrapper: createWrapper() })

    // Synchronously — before any data resolves
    expect(result.current.messages).toEqual([])
  })

  it('returns an empty array when the API fails', async () => {
    server.use(
      http.get('/api/conversation', () =>
        HttpResponse.json({ error: 'Server error', code: 'INTERNAL_ERROR' }, { status: 500 }),
      ),
    )

    const { result } = renderHook(() => useConversation(), { wrapper: createWrapper() })

    await waitFor(() => {
      // After the failed fetch settles, messages stays empty
      expect(result.current.messages).toEqual([])
    })
  })

  it('returns messages from the server', async () => {
    const { result } = renderHook(() => useConversation(), { wrapper: createWrapper() })

    await waitFor(() => {
      expect(result.current.messages.length).toBeGreaterThan(0)
    })

    expect(result.current.messages[0].role).toBe('coach')
    expect(result.current.messages[0].content).toBeDefined()
  })

  it('rolls back the optimistic message when sendMessage fails', async () => {
    const { result } = renderHook(() => useConversation(), { wrapper: createWrapper() })

    await waitFor(() => {
      expect(result.current.messages.length).toBeGreaterThan(0)
    })

    const countBefore = result.current.messages.length

    // Override POST to fail
    server.use(
      http.post('/api/conversation/messages', () =>
        HttpResponse.json({ error: 'Server error', code: 'INTERNAL_ERROR' }, { status: 500 }),
      ),
    )

    result.current.sendMessage('This will fail')

    // After the mutation settles (error + rollback), isPending returns to false
    await waitFor(() => {
      expect(result.current.isPending).toBe(false)
    })

    // Message is not present — rollback restored the original snapshot
    expect(result.current.messages.length).toBe(countBefore)
    const failedMsg = result.current.messages.find((m) => m.content === 'This will fail')
    expect(failedMsg).toBeUndefined()
  })

  it('optimistically adds the athlete message before the server responds', async () => {
    const { result } = renderHook(() => useConversation(), { wrapper: createWrapper() })

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.messages.length).toBeGreaterThan(0)
    })

    const countBefore = result.current.messages.length

    // Fire sendMessage — optimistic update should be synchronous
    result.current.sendMessage('How far should I run today?')

    await waitFor(() => {
      expect(result.current.messages.length).toBeGreaterThan(countBefore)
    })

    const optimistic = result.current.messages.find(
      (m) => m.content === 'How far should I run today?' && m.role === 'athlete',
    )
    expect(optimistic).toBeDefined()
  })
})

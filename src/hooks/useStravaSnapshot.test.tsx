import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http, HttpResponse } from 'msw'
import { server } from '@/mocks/server'
import { useStravaSnapshot } from './useStravaSnapshot'

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useStravaSnapshot', () => {
  it('returns isLoading true while fetching', () => {
    const { result } = renderHook(() => useStravaSnapshot(), { wrapper: createWrapper() })
    expect(result.current.isLoading).toBe(true)
  })

  it('returns snapshot data on success', async () => {
    const { result } = renderHook(() => useStravaSnapshot(), { wrapper: createWrapper() })
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(typeof result.current.snapshot?.totalActivities).toBe('number')
    expect(typeof result.current.snapshot?.avgWeeklyKm).toBe('number')
    expect(typeof result.current.snapshot?.longestRunKm).toBe('number')
    expect(typeof result.current.snapshot?.avgPacePerKm).toBe('string')
    expect(typeof result.current.snapshot?.dataWindow).toBe('string')
  })

  it('returns isError true when the API fails', async () => {
    server.use(
      http.get('/api/strava/snapshot', () =>
        HttpResponse.json({ error: 'Server error', code: 'INTERNAL_ERROR' }, { status: 500 }),
      ),
    )
    const { result } = renderHook(() => useStravaSnapshot(), { wrapper: createWrapper() })
    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })
    expect(result.current.snapshot).toBeUndefined()
  })
})

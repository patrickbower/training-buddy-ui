import { describe, it, expect, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http, HttpResponse } from 'msw'
import { server } from '@/mocks/server'
import { useOnboarding } from './useOnboarding'

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useOnboarding', () => {
  it('starts at step 1', () => {
    const { result } = renderHook(() => useOnboarding(), { wrapper: createWrapper() })
    expect(result.current.step).toBe(1)
  })

  it('next() advances to the next step', () => {
    const { result } = renderHook(() => useOnboarding(), { wrapper: createWrapper() })
    act(() => {
      result.current.next('intermediate_marathoner')
    })
    expect(result.current.step).toBe(2)
  })

  it('back() returns to the previous step', () => {
    const { result } = renderHook(() => useOnboarding(), { wrapper: createWrapper() })
    act(() => {
      result.current.next('intermediate_marathoner')
    })
    act(() => {
      result.current.back()
    })
    expect(result.current.step).toBe(1)
  })

  it('back() does nothing on step 1', () => {
    const { result } = renderHook(() => useOnboarding(), { wrapper: createWrapper() })
    act(() => {
      result.current.back()
    })
    expect(result.current.step).toBe(1)
  })

  it('skip() advances past a skippable step (step 3)', () => {
    const { result } = renderHook(() => useOnboarding(), { wrapper: createWrapper() })
    act(() => {
      result.current.next('intermediate_marathoner')
    }) // step 1 → 2
    act(() => {
      result.current.next('Run a sub-4 marathon by Oct 2026')
    }) // step 2 → 3
    act(() => {
      result.current.skip()
    }) // step 3 → 4 (skippable)
    expect(result.current.step).toBe(4)
  })

  it('accumulates answers across steps', () => {
    const { result } = renderHook(() => useOnboarding(), { wrapper: createWrapper() })
    act(() => {
      result.current.next('intermediate_marathoner')
    })
    act(() => {
      result.current.next('Run a sub-4 marathon')
    })
    expect(result.current.answers[1]).toBe('intermediate_marathoner')
    expect(result.current.answers[2]).toBe('Run a sub-4 marathon')
  })

  it('calls PATCH /api/athlete/profile after each step answer', async () => {
    const patchSpy = vi.fn()
    server.use(
      http.patch('/api/athlete/profile', async ({ request }) => {
        patchSpy(await request.json())
        return HttpResponse.json({})
      }),
    )
    const { result } = renderHook(() => useOnboarding(), { wrapper: createWrapper() })
    act(() => {
      result.current.next('intermediate_marathoner')
    })
    await waitFor(() => {
      expect(patchSpy).toHaveBeenCalledTimes(1)
    })
  })

  it('calls POST /api/athlete/profile on step 8 confirm', async () => {
    const postSpy = vi.fn()
    server.use(
      http.post('/api/athlete/profile', async ({ request }) => {
        postSpy(await request.json())
        return HttpResponse.json({
          id: 'ath_01',
          onboardingCompletedAt: new Date().toISOString(),
          profile: {},
        })
      }),
    )
    const { result } = renderHook(() => useOnboarding(), { wrapper: createWrapper() })
    // Advance through all 8 steps
    act(() => {
      result.current.next('intermediate_marathoner')
    }) // step 1
    act(() => {
      result.current.next('Run a sub-4 marathon')
    }) // step 2
    act(() => {
      result.current.skip()
    }) // skip step 3
    act(() => {
      result.current.next('4')
    }) // step 4
    act(() => {
      result.current.next('None')
    }) // step 5
    act(() => {
      result.current.next('data_driven')
    }) // step 6
    act(() => {
      result.current.skip()
    }) // skip step 7
    await waitFor(() => {
      expect(result.current.step).toBe(8)
    })
    act(() => {
      result.current.confirm()
    })
    await waitFor(() => {
      expect(postSpy).toHaveBeenCalledTimes(1)
    })
  })
})

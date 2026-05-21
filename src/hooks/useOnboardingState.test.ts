import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAuthStore } from '@/stores/authStore'
import { isOnboardingRequired, useOnboardingState } from './useOnboardingState'

describe('isOnboardingRequired', () => {
  it('returns true when onboardingCompletedAt is null', () => {
    useAuthStore.setState({ onboardingCompletedAt: null })
    expect(isOnboardingRequired()).toBe(true)
  })

  it('returns false when onboardingCompletedAt is set', () => {
    useAuthStore.setState({ onboardingCompletedAt: '2026-05-21T10:00:00Z' })
    expect(isOnboardingRequired()).toBe(false)
  })
})

describe('useOnboardingState', () => {
  beforeEach(() => {
    useAuthStore.setState({ onboardingCompletedAt: null })
  })

  it('isRequired is true when onboarding is not complete', () => {
    const { result } = renderHook(() => useOnboardingState())
    expect(result.current.isRequired).toBe(true)
  })

  it('isRequired is false when onboarding is complete', () => {
    useAuthStore.setState({ onboardingCompletedAt: '2026-05-21T10:00:00Z' })
    const { result } = renderHook(() => useOnboardingState())
    expect(result.current.isRequired).toBe(false)
  })

  it('complete() sets onboardingCompletedAt to a non-null ISO string', () => {
    const { result } = renderHook(() => useOnboardingState())
    act(() => {
      result.current.complete()
    })
    expect(useAuthStore.getState().onboardingCompletedAt).not.toBeNull()
    expect(typeof useAuthStore.getState().onboardingCompletedAt).toBe('string')
  })

  it('complete() causes isRequired to become false', () => {
    const { result } = renderHook(() => useOnboardingState())
    expect(result.current.isRequired).toBe(true)
    act(() => {
      result.current.complete()
    })
    expect(result.current.isRequired).toBe(false)
  })

  it('complete() is idempotent — does not overwrite an existing timestamp', () => {
    const original = '2026-01-01T00:00:00Z'
    useAuthStore.setState({ onboardingCompletedAt: original })
    const { result } = renderHook(() => useOnboardingState())
    act(() => {
      result.current.complete()
    })
    expect(useAuthStore.getState().onboardingCompletedAt).toBe(original)
  })
})

import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from '@/stores/authStore'
import { guardOnboardingChat, guardCoachingChat } from './router.guards'

describe('guardOnboardingChat — redirect when already onboarded', () => {
  it('throws redirect to / when onboardingCompletedAt is set', () => {
    useAuthStore.setState({ onboardingCompletedAt: '2026-05-13T10:00:00Z' })

    expect(() => { guardOnboardingChat(); }).toThrow()
  })

  it('does not throw when onboardingCompletedAt is null', () => {
    useAuthStore.setState({ onboardingCompletedAt: null })

    expect(() => { guardOnboardingChat(); }).not.toThrow()
  })
})

describe('guardCoachingChat — redirect when onboarding incomplete', () => {
  beforeEach(() => {
    useAuthStore.setState({ onboardingCompletedAt: null })
  })

  it('throws redirect to /onboarding/chat when onboardingCompletedAt is null', () => {
    expect(() => { guardCoachingChat(); }).toThrow()
  })

  it('does not throw when onboardingCompletedAt is set', () => {
    useAuthStore.setState({ onboardingCompletedAt: '2026-05-13T10:00:00Z' })

    expect(() => { guardCoachingChat(); }).not.toThrow()
  })
})

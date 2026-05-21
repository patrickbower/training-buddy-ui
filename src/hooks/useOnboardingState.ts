import { useCallback } from 'react'
import { useAuthStore } from '@/stores/authStore'

export function isOnboardingRequired(): boolean {
  return useAuthStore.getState().onboardingCompletedAt === null
}

export function useOnboardingState() {
  const isRequired = useAuthStore((s) => s.onboardingCompletedAt === null)
  const completeOnboarding = useAuthStore((s) => s.completeOnboarding)

  const complete = useCallback(() => {
    if (useAuthStore.getState().onboardingCompletedAt === null) {
      completeOnboarding(new Date().toISOString())
    }
  }, [completeOnboarding])

  return { isRequired, complete }
}

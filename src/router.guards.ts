import { redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/authStore'

export function guardOnboardingChat(): void {
  if (useAuthStore.getState().onboardingCompletedAt !== null) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw redirect({ to: '/' })
  }
}

export function guardCoachingChat(): void {
  if (useAuthStore.getState().onboardingCompletedAt === null) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw redirect({ to: '/onboarding/chat' })
  }
}

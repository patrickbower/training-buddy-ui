import { redirect } from '@tanstack/react-router'
import { isOnboardingRequired } from '@/hooks/useOnboardingState'

export function guardOnboardingChat(): void {
  if (!isOnboardingRequired()) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw redirect({ to: '/' })
  }
}

export function guardCoachingChat(): void {
  if (isOnboardingRequired()) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw redirect({ to: '/onboarding/chat' })
  }
}

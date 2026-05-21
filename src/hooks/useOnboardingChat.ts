import { useEffect } from 'react'
import { useConversation } from './useConversation'
import { useOnboardingState } from './useOnboardingState'

export function useOnboardingChat() {
  const { messages, sendMessage, isPending } = useConversation()
  const { complete } = useOnboardingState()

  const hasSynthesis = messages.some((m) => m.onboardingStep?.complete === true)

  useEffect(() => {
    if (hasSynthesis) complete()
  }, [hasSynthesis, complete])

  return { messages, sendMessage, isPending, hasSynthesis }
}

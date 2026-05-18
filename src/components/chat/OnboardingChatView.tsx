import { useEffect, useRef, useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { Skeleton } from '@heroui/react'
import { api } from '@/lib/api'
import { queryKeys } from '@/lib/queryKeys'
import { useAuthStore } from '@/stores/authStore'
import { useConversation } from '@/hooks/useConversation'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'
import { TrainingBuddyLogo } from '@/components/shared/TrainingBuddyLogo'

export function OnboardingChatView() {
  const { messages, sendMessage, isPending } = useConversation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const completeOnboarding = useAuthStore((s) => s.completeOnboarding)
  const onboardingCompletedAt = useAuthStore((s) => s.onboardingCompletedAt)
  const bottomRef = useRef<HTMLDivElement>(null)

  const hasSynthesis = messages.some((m) => m.onboardingStep?.complete === true)
  useEffect(() => {
    if (hasSynthesis && !onboardingCompletedAt) {
      completeOnboarding(new Date().toISOString())
    }
  }, [hasSynthesis, onboardingCompletedAt, completeOnboarding])

  const handleSynthesisCtaPress = useCallback(async () => {
    const conv = await api.conversation.create()
    void queryClient.resetQueries({ queryKey: queryKeys.conversation() })
    await navigate({ to: '/chat/$conversationId', params: { conversationId: conv.id } })
  }, [navigate, queryClient])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const lastIdx = messages.length - 1

  return (
    <div className="relative flex flex-col h-screen overflow-y-auto">
      <div className="fixed top-5 left-5">
        <TrainingBuddyLogo width={140} />
      </div>
      <ol
        role="log"
        aria-label="Conversation"
        aria-live="polite"
        className="flex flex-col gap-10 px-3 pt-20 pb-5 max-w-160 w-full mx-auto flex-1"
      >
        {messages.length === 0 && !isPending ? (
          <>
            <Skeleton className="h-8 w-3/4 rounded-lg" />
            <Skeleton className="h-8 w-1/2 rounded-lg" />
            <Skeleton className="h-8 w-2/3 rounded-lg" />
          </>
        ) : (
          messages.map((message, idx) => (
            <li key={message.id}>
              <ChatMessage
                message={message}
                onQuickReply={idx === lastIdx ? sendMessage : undefined}
                onCardCtaPress={
                  message.onboardingStep?.complete
                    ? () => {
                        void handleSynthesisCtaPress()
                      }
                    : undefined
                }
              />
            </li>
          ))
        )}
        {isPending && (
          <li>
            <span className="text-xs text-zinc-400">Thinking…</span>
          </li>
        )}
        <div ref={bottomRef} />
      </ol>
      <div className="pb-5 max-w-2xl w-full mx-auto bg-white shrink-0">
        <ChatInput onSend={sendMessage} />
      </div>
    </div>
  )
}

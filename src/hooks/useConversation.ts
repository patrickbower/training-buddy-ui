import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { queryKeys } from '@/lib/queryKeys'
import { useAuthStore } from '@/stores/authStore'
import type { CoachMessage, Conversation } from '@/types/domain'

export interface UseConversationResult {
  messages: CoachMessage[]
  sendMessage: (content: string) => void
  isPending: boolean
}

export function useConversation(): UseConversationResult {
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: queryKeys.conversation(),
    queryFn: api.conversation.get,
    staleTime: 0,
  })

  const mutation = useMutation({
    mutationFn: (content: string) => api.conversation.sendMessage(content),
    onMutate: async (content: string) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.conversation() })

      const snapshot = queryClient.getQueryData<Conversation>(queryKeys.conversation())

      const optimisticMessage: CoachMessage = {
        id: `optimistic_${String(Date.now())}`,
        conversationId: snapshot?.id ?? '',
        role: 'athlete',
        content,
        quickReplies: null,
        onboardingStep: null,
        card: null,
        createdAt: new Date().toISOString(),
      }

      queryClient.setQueryData<Conversation>(queryKeys.conversation(), (prev) => {
        if (!prev) return prev
        return { ...prev, messages: [...prev.messages, optimisticMessage] }
      })

      return { snapshot }
    },
    onError: (_err, _content, context) => {
      if (context?.snapshot !== undefined) {
        queryClient.setQueryData(queryKeys.conversation(), context.snapshot)
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.conversation() })
      void queryClient
        .fetchQuery({ queryKey: queryKeys.athlete(), queryFn: api.athlete.get })
        .then((athlete) => {
          const { onboardingCompletedAt, completeOnboarding } = useAuthStore.getState()
          if (athlete.onboardingCompletedAt && !onboardingCompletedAt) {
            completeOnboarding(athlete.onboardingCompletedAt)
          }
        })
    },
  })

  return {
    messages: data?.messages ?? [],
    sendMessage: (content: string) => {
      mutation.mutate(content)
    },
    isPending: mutation.isPending,
  }
}

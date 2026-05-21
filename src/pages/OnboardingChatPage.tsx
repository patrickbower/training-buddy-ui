import { useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { queryKeys } from '@/lib/queryKeys'
import { useOnboardingChat } from '@/hooks/useOnboardingChat'
import { ChatView } from '@/components/chat/ChatView'

export function OnboardingChatPage() {
  const { messages, sendMessage, isPending, hasSynthesis } = useOnboardingChat()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const handleSynthesisCtaPress = useCallback(async () => {
    const conv = await api.conversation.create()
    void queryClient.resetQueries({ queryKey: queryKeys.conversation() })
    await navigate({ to: '/chat/$conversationId', params: { conversationId: conv.id } })
  }, [navigate, queryClient])

  return (
    <ChatView
      messages={messages}
      sendMessage={sendMessage}
      isPending={isPending}
      hasSynthesis={hasSynthesis}
      showLogo
      onSynthesisCtaPress={() => {
        void handleSynthesisCtaPress()
      }}
    />
  )
}

import { useConversation } from '@/hooks/useConversation'
import { ChatView } from '@/components/chat/ChatView'

export function ChatPage() {
  const { messages, sendMessage, isPending } = useConversation()
  return <ChatView messages={messages} sendMessage={sendMessage} isPending={isPending} />
}

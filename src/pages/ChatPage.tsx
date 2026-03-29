import { useParams } from '@tanstack/react-router'

export function ChatPage() {
  const { conversationId } = useParams({ from: '/chat/$conversationId' })
  return <div className="p-8 text-sm text-zinc-500">Chat view — conversation {conversationId}</div>
}

import { useEffect, useRef } from 'react'
import { Skeleton } from '@heroui/react'
import { useConversation } from '@/hooks/useConversation'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'

export function ChatView() {
  const { messages, sendMessage, isPending } = useConversation()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex flex-col h-full">
      <ol
        role="log"
        aria-label="Conversation"
        aria-live="polite"
        className="flex flex-col flex-1 gap-10 overflow-y-auto px-3 pt-10 pb-5 max-w-160 w-full mx-auto"
      >
        {messages.length === 0 && !isPending ? (
          <>
            <Skeleton className="h-8 w-3/4 rounded-lg" />
            <Skeleton className="h-8 w-1/2 rounded-lg" />
            <Skeleton className="h-8 w-2/3 rounded-lg" />
          </>
        ) : (
          messages.map((message) => (
            <li key={message.id}>
              <ChatMessage message={message} />
            </li>
          ))
        )}
        <div ref={bottomRef} />
      </ol>
      <div className="shrink-0 pb-5 max-w-160 w-full mx-auto">
        <ChatInput onSend={sendMessage} />
      </div>
    </div>
  )
}

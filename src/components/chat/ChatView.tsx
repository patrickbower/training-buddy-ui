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

  const lastIdx = messages.length - 1

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <ol
          role="log"
          aria-label="Conversation"
          aria-live="polite"
          className="flex flex-col gap-10 px-3 pt-10 pb-5 max-w-160 w-full mx-auto"
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
      </div>
      <div className="pb-5 max-w-2xl w-full mx-auto bg-white shrink-0">
        <ChatInput onSend={sendMessage} />
      </div>
    </div>
  )
}

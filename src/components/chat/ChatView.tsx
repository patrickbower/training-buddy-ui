import { useEffect, useRef } from 'react'
import { Skeleton } from '@heroui/react'
import { TrainingBuddyLogo } from '@/components/shared/TrainingBuddyLogo'
import type { CoachMessage } from '@/types/domain'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'

interface ChatViewProps {
  messages: CoachMessage[]
  sendMessage: (content: string) => void
  isPending: boolean
  hasSynthesis?: boolean
  showLogo?: boolean
  onSynthesisCtaPress?: () => void
}

export function ChatView({
  messages,
  sendMessage,
  isPending,
  hasSynthesis = false,
  showLogo = false,
  onSynthesisCtaPress,
}: ChatViewProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const lastIdx = messages.length - 1

  return (
    <div className={`flex flex-col ${showLogo ? 'h-screen relative' : 'h-full'}`}>
      {showLogo && (
        <div className="fixed top-5 left-5">
          <TrainingBuddyLogo width={140} />
        </div>
      )}
      <div className="flex-1 overflow-y-auto">
        <ol
          role="log"
          aria-label="Conversation"
          aria-live="polite"
          className={`flex flex-col gap-10 px-3 ${showLogo ? 'pt-20' : 'pt-10'} pb-5 max-w-160 w-full mx-auto`}
        >
          {showLogo && (
            <li>
              <h4 className="text-base font-semibold text-zinc-900">
                As your coach, let me start with a few questions
              </h4>
            </li>
          )}
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
                    message.onboardingStep?.complete ? onSynthesisCtaPress : undefined
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
      </div>
      {!hasSynthesis && (
        <div className="pb-5 max-w-2xl w-full mx-auto bg-white shrink-0">
          <ChatInput onSend={sendMessage} />
        </div>
      )}
    </div>
  )
}

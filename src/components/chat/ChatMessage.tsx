import Markdown from 'react-markdown'
import { Button } from '@heroui/react'
import { ChatCard } from './ChatCard'
import type { CoachMessage } from '@/types/domain'

interface ChatMessageProps {
  message: CoachMessage
  onQuickReply?: (reply: string) => void
}

export function ChatMessage({ message, onQuickReply }: ChatMessageProps) {
  if (message.role === 'coach') {
    return (
      <div className="flex flex-col gap-3 w-full">
        {message.onboardingStep && (
          <span className="text-xs text-zinc-400">
            {message.onboardingStep.complete
              ? 'Profile complete'
              : `Profile · Step ${String(message.onboardingStep.index)} of ${String(message.onboardingStep.total)}`}
          </span>
        )}
        <div className="prose prose-sm prose-zinc max-w-none">
          <Markdown>{message.content}</Markdown>
        </div>
        {message.quickReplies && onQuickReply && (
          <div className="flex flex-wrap gap-2">
            {message.quickReplies.map((reply) => (
              <Button
                key={reply}
                size="sm"
                variant="outline"
                onPress={() => {
                  onQuickReply(reply)
                }}
              >
                {reply}
              </Button>
            ))}
          </div>
        )}
        {message.card && <ChatCard card={message.card} />}
      </div>
    )
  }

  return (
    <div className="bg-zinc-100 rounded pl-3 py-3 w-full">
      <p className="text-zinc-900 leading-relaxed">{message.content}</p>
    </div>
  )
}

import { Button } from '@heroui/react'
import type { CoachMessage } from '@/types/domain'

interface ChatMessageProps {
  message: CoachMessage
  onQuickReply?: (reply: string) => void
}

export function ChatMessage({ message, onQuickReply }: ChatMessageProps) {
  if (message.role === 'coach') {
    return (
      <div className="flex flex-col gap-3 w-full">
        <span className="text-xs text-zinc-400">Thought</span>
        <p className="text-zinc-900 leading-relaxed">{message.content}</p>
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
      </div>
    )
  }

  return (
    <div className="bg-zinc-100 rounded pl-3 py-3 w-full">
      <p className="text-zinc-900 leading-relaxed">{message.content}</p>
    </div>
  )
}

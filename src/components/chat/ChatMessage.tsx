import type { CoachMessage } from '@/types/domain'

interface ChatMessageProps {
  message: CoachMessage
}

export function ChatMessage({ message }: ChatMessageProps) {
  if (message.role === 'coach') {
    return (
      <div className="flex flex-col gap-3 w-full">
        <span className="text-xs text-zinc-400">Thought</span>
        <p className="text-zinc-900 leading-relaxed">{message.content}</p>
      </div>
    )
  }

  return (
    <div className="bg-zinc-100 rounded pl-3 py-3 w-full">
      <p className="text-zinc-900 leading-relaxed">{message.content}</p>
    </div>
  )
}

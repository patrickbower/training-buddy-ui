import type { CoachMessage } from '@/types/domain'

interface ChatMessageProps {
  message: CoachMessage
}

export function ChatMessage({ message }: ChatMessageProps) {
  if (message.role === 'coach') {
    return (
      <div className="flex flex-col gap-3 w-full">
        <span className="text-[10px] text-[#9b9b9b]">Thought</span>
        <p className="text-zinc-900 leading-relaxed">{message.content}</p>
      </div>
    )
  }

  return (
    <div className="bg-[#f5f5f5] rounded pl-3 py-3 w-full">
      <p className="text-zinc-900 leading-relaxed">{message.content}</p>
    </div>
  )
}

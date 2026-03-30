import { Avatar } from '@heroui/react'
import { Person } from '@gravity-ui/icons'
import type { CoachMessage } from '@/types/domain'
import { TrainingBuddyIcon } from '@/components/shared/TrainingBuddyIcon'

interface ChatMessageProps {
  message: CoachMessage
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isCoach = message.role === 'coach'

  return (
    <div className="flex gap-3.5 items-start w-full">
      <Avatar size="sm" className="shrink-0">
        <Avatar.Fallback>
          {isCoach ? (
            <span role="img" aria-label="Training Buddy">
              <TrainingBuddyIcon />
            </span>
          ) : (
            <span role="img" aria-label="Athlete">
              <Person width={16} height={16} />
            </span>
          )}
        </Avatar.Fallback>
      </Avatar>
      <p className="text-sm text-zinc-900 leading-snug pt-1.5">{message.content}</p>
    </div>
  )
}

import { Button } from '@heroui/react'
import { useNavigate } from '@tanstack/react-router'
import type { MessageCard } from '@/types/domain'

interface ChatCardProps {
  card: MessageCard
  onCtaPress?: () => void
}

export function ChatCard({ card, onCtaPress }: ChatCardProps) {
  const navigate = useNavigate()

  return (
    <div className="rounded-xl border border-green-400 bg-green-50 p-4 mt-6 flex flex-col gap-3">
      <p className="text-sm font-semibold text-zinc-900">{card.title}</p>
      <p className="text-sm text-zinc-500">{card.body}</p>
      {card.cta && (
        <Button
          size="sm"
          className="self-start rounded-full bg-zinc-900 text-white text-xs font-medium"
          onPress={() => {
            if (onCtaPress) {
              onCtaPress()
            } else {
              const { to } = card.cta ?? {}
              if (to) void navigate({ to: to as '/' })
            }
          }}
        >
          {card.cta.label}
        </Button>
      )}
    </div>
  )
}

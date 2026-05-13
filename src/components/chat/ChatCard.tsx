import { Button } from '@heroui/react'
import { useNavigate } from '@tanstack/react-router'
import type { MessageCard } from '@/types/domain'

interface ChatCardProps {
  card: MessageCard
}

export function ChatCard({ card }: ChatCardProps) {
  const navigate = useNavigate()

  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 flex flex-col gap-3">
      <p className="text-sm font-semibold text-zinc-900">{card.title}</p>
      <p className="text-sm text-zinc-500">{card.body}</p>
      {card.cta && (
        <Button
          size="sm"
          className="self-start rounded-full bg-zinc-900 text-white text-xs font-medium"
          onPress={() => {
            const { to } = card.cta ?? {}
            if (to) void navigate({ to: to as '/' })
          }}
        >
          {card.cta.label}
        </Button>
      )}
    </div>
  )
}

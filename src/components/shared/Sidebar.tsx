import { Button, ListBox } from '@heroui/react'
import { Bars, Plus } from '@gravity-ui/icons'
import { useNavigate, useLocation } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { TrainingBuddyLogo } from './TrainingBuddyLogo'
import { ProfileFooter } from '@/components/athlete/ProfileFooter'
import { useAthlete } from '@/hooks/useAthlete'
import { api } from '@/lib/api'
import { queryKeys } from '@/lib/queryKeys'
import { useAuthStore } from '@/stores/authStore'

interface SidebarProps {
  onMenuToggle?: () => void
}

const navItemClassName =
  'flex gap-3 items-center min-h-9 px-3 py-1.5 rounded-sm w-full cursor-pointer data-[selected=true]:bg-zinc-200 '

export function Sidebar({ onMenuToggle }: SidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const onboardingCompletedAt = useAuthStore((s) => s.onboardingCompletedAt)
  const { athlete } = useAthlete()

  const { data: conversation } = useQuery({
    queryKey: queryKeys.conversation(),
    queryFn: api.conversation.get,
    enabled: !!onboardingCompletedAt,
  })

  const activeConversationId = location.pathname.startsWith('/chat/')
    ? location.pathname.split('/').at(-1)
    : undefined

  return (
    <div className="flex flex-col h-full gap-5 p-5 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="pb-3">
          <TrainingBuddyLogo width={140} />
        </div>
        {onMenuToggle && (
          <Button
            isIconOnly
            variant="ghost"
            size="sm"
            onPress={onMenuToggle}
            aria-label="Close menu"
          >
            <Bars />
          </Button>
        )}
      </div>

      {/* Nav */}
      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex flex-col gap-2">
          <Button
            variant="ghost"
            size="md"
            fullWidth
            className="justify-start gap-3 px-3 rounded-full bg-zinc-200"
            onPress={() => {
              void navigate({ to: '/chat/$conversationId', params: { conversationId: 'new' } })
            }}
          >
            <Plus />
            <span className="flex-1 text-left">New chat</span>
          </Button>

          {conversation && (
            <ListBox
              aria-label="Conversations"
              selectionMode="single"
              selectedKeys={activeConversationId ? new Set([activeConversationId]) : new Set()}
              onAction={(key) => {
                void navigate({
                  to: '/chat/$conversationId',
                  params: { conversationId: String(key) },
                })
              }}
            >
              <ListBox.Item
                key={conversation.id}
                id={conversation.id}
                textValue={conversation.messages[0]?.content.slice(0, 29) + '…'}
                className={navItemClassName}
              >
                <span className="flex flex-col min-w-0">
                  <span className="text-sm font-medium text-zinc-900 leading-snug truncate">
                    {conversation.messages[0]?.content.slice(0, 29)}…
                  </span>
                  <span className="text-xs text-zinc-400 leading-snug">
                    {conversation.messages.length} message
                    {conversation.messages.length !== 1 ? 's' : ''}
                  </span>
                </span>
              </ListBox.Item>
            </ListBox>
          )}
        </div>
      </div>

      {/* Profile footer */}
      {athlete && <ProfileFooter athlete={athlete} />}
    </div>
  )
}

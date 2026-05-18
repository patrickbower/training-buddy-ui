import { Button, ListBox } from '@heroui/react'
import { Bars, Plus } from '@gravity-ui/icons'
import { useNavigate, useLocation } from '@tanstack/react-router'
import { TrainingBuddyLogo } from './TrainingBuddyLogo'
import { ProfileFooter } from '@/components/athlete/ProfileFooter'
import { seedAthlete } from '@/mocks/data/athlete'
import { seedConversation } from '@/mocks/data/conversation'

interface SidebarProps {
  onMenuToggle?: () => void
}

const navItemClassName =
  'flex gap-3 items-center min-h-9 px-3 py-1.5 rounded-full w-full cursor-pointer data-[selected=true]:bg-default'

export function Sidebar({ onMenuToggle }: SidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const activeConversationId = location.pathname.startsWith('/chat/')
    ? location.pathname.split('/').at(-1)
    : undefined

  // Onboarding conversation is excluded from the coaching sidebar
  const coachingConversations = seedConversation.id !== 'conv_01' ? [seedConversation] : []

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
        <div className="flex flex-col">
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
            className="p-0 gap-0"
          >
            {coachingConversations.map((conv) => {
              const preview = conv.messages[0]?.content.slice(0, 29) + '…'
              const count = conv.messages.length
              return (
                <ListBox.Item
                  key={conv.id}
                  id={conv.id}
                  textValue={preview}
                  className={navItemClassName}
                >
                  <span className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-zinc-900 leading-snug truncate">
                      {preview}
                    </span>
                    <span className="text-xs text-zinc-400 leading-snug">
                      {count} message{count !== 1 ? 's' : ''}
                    </span>
                  </span>
                </ListBox.Item>
              )
            })}
          </ListBox>
        </div>
      </div>

      {/* Profile footer */}
      <ProfileFooter athlete={seedAthlete} />
    </div>
  )
}

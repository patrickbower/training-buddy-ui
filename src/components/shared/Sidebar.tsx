import { Button, Kbd, ListBox } from '@heroui/react'
import { Bars, CirclePlusFill } from '@gravity-ui/icons'
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

  // const conversationMessageCount = seedConversation.messages.length
  const conversationPreview = seedConversation.messages[0]?.content.slice(0, 29) + '…'

  return (
    <div className="flex flex-col h-full gap-5 p-2 w-full">
      {/* Header */}
      <div className="flex items-center justify-between px-3 h-10.75">
        <div className="flex items-center pt-6">
          <TrainingBuddyLogo />
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
            className="group justify-start gap-4 px-3"
            onPress={() => {
              void navigate({ to: '/chat/$conversationId', params: { conversationId: 'new' } })
            }}
          >
            <CirclePlusFill width={24} height={24} />
            <span className="flex-1 text-left">Chat</span>
            <Kbd variant="light" className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Kbd.Abbr keyValue="shift" />
              <Kbd.Abbr keyValue="command" />
              <Kbd.Content>O</Kbd.Content>
            </Kbd>
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
            <ListBox.Item
              id={seedConversation.id}
              textValue={conversationPreview}
              className={navItemClassName}
            >
              <span className="flex flex-col min-w-0">
                <span className="text-sm text-zinc-900 leading-snug truncate">
                  {conversationPreview}
                </span>
              </span>
            </ListBox.Item>
          </ListBox>
        </div>
      </div>

      {/* Profile footer */}
      <ProfileFooter athlete={seedAthlete} />
    </div>
  )
}

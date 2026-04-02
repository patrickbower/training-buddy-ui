import { Button, Avatar, Kbd, ListBox } from '@heroui/react'
import { Bars, Plus, Comment, FileLetterP } from '@gravity-ui/icons'
import { useNavigate, useLocation } from '@tanstack/react-router'
import { TrainingBuddyLogo } from './TrainingBuddyLogo'
import { SidebarNavItem } from './SidebarNavItem'
import { seedAthlete } from '@/mocks/data/athlete'
import { seedConversation } from '@/mocks/data/conversation'
import { seedTrainingPlan } from '@/mocks/data/trainingPlans'

interface SidebarProps {
  onMenuToggle?: () => void
}

const navItemClassName =
  'flex gap-3 items-center min-h-9 px-3 py-1.5 rounded-full w-full cursor-pointer data-[selected=true]:bg-zinc-200'

export function Sidebar({ onMenuToggle }: SidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const activeConversationId = location.pathname.startsWith('/chat/')
    ? location.pathname.split('/').at(-1)
    : undefined

  const planCreatedDate = new Date(seedTrainingPlan.createdAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  })

  const conversationMessageCount = seedConversation.messages.length
  const conversationPreview = seedConversation.messages[0]?.content.slice(0, 20) + '…'

  return (
    <div className="flex flex-col h-full gap-5 p-4">
      {/* Header */}
      <div className="flex items-center justify-between px-3 h-10.75">
        <div className="flex items-center">
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
        <SidebarNavItem
          href="/plan"
          icon={<FileLetterP width={16} height={16} />}
          title={seedTrainingPlan.name}
          subtitle={`Created ${planCreatedDate}`}
        />

        <div className="flex flex-col gap-3 mt-3">
          <div className="px-3 pt-3 pb-1">
            <span className="text-xs font-medium text-zinc-500">Chat</span>
          </div>

          <Button
            variant="secondary"
            size="sm"
            fullWidth
            className="justify-start gap-4 px-2.5"
            onPress={() => {
              void navigate({ to: '/chat/$conversationId', params: { conversationId: 'new' } })
            }}
          >
            <Plus width={16} height={16} />
            <span className="flex-1 text-left">New</span>
            <Kbd variant="light">
              <Kbd.Abbr keyValue="command" />
              <Kbd.Content>N</Kbd.Content>
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
              <span className="shrink-0 text-zinc-500 pt-px">
                <Comment width={16} height={16} />
              </span>
              <span className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-zinc-900 leading-snug truncate">
                  {conversationPreview}
                </span>
                <span className="text-xs text-zinc-500 leading-snug truncate">
                  {String(conversationMessageCount)} messages
                </span>
              </span>
            </ListBox.Item>
          </ListBox>
        </div>
      </div>

      {/* Profile footer */}
      <div className="flex items-center gap-2 shrink-0">
        <Avatar size="sm">
          <Avatar.Fallback className="text-xs">{seedAthlete.name[0]}</Avatar.Fallback>
        </Avatar>
        <span className="text-xs text-zinc-500 truncate">{seedAthlete.email}</span>
      </div>
    </div>
  )
}

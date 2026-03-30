import { Button, Avatar, Kbd } from '@heroui/react'
import { Bars, Plus, Comment, FileText } from '@gravity-ui/icons'
import { useNavigate } from '@tanstack/react-router'
import { TrainingBuddyLogo } from './TrainingBuddyLogo'
import { SidebarNavItem } from './SidebarNavItem'
import { seedAthlete } from '@/mocks/data/athlete'
import { seedConversation } from '@/mocks/data/conversation'
import { seedTrainingPlan } from '@/mocks/data/trainingPlans'

interface SidebarProps {
  onMenuToggle?: () => void
}

export function Sidebar({ onMenuToggle }: SidebarProps) {
  const navigate = useNavigate()

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
          icon={<FileText width={16} height={16} />}
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

          <SidebarNavItem
            href={`/chat/${seedConversation.id}`}
            icon={<Comment width={16} height={16} />}
            title={conversationPreview}
            subtitle={`${String(conversationMessageCount)} messages`}
          />
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

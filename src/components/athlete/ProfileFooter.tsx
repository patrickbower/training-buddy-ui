import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Avatar, Button, Dropdown, Label } from '@heroui/react'
import type { Athlete } from '@/types/domain'
import { useAuthStore } from '@/stores/authStore'
import { SettingsModal } from './SettingsModal'

interface ProfileFooterProps {
  athlete: Athlete
}

export function ProfileFooter({ athlete }: ProfileFooterProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  const handleAction = (key: string | number) => {
    if (key === 'settings') {
      setIsModalOpen(true)
    } else if (key === 'logout') {
      logout()
      void navigate({ to: '/login' })
    }
  }

  return (
    <Dropdown>
      <Button
        variant="ghost"
        aria-label="Profile menu"
        className="flex items-center gap-2 w-full justify-start px-0 h-auto min-h-0 font-normal data-[pressed=true]:transform-none"
      >
        <Avatar size="sm">
          <Avatar.Fallback className="text-xs">{athlete.name[0]}</Avatar.Fallback>
        </Avatar>
        <span className="text-xs text-zinc-500 truncate">{athlete.email}</span>
      </Button>
      <Dropdown.Popover className="backdrop-blur-md bg-white/80">
        <Dropdown.Menu aria-label="Profile options" onAction={handleAction}>
          <Dropdown.Item id="settings" textValue="Settings">
            <Label>Settings</Label>
          </Dropdown.Item>
          <Dropdown.Item id="logout" textValue="Logout" variant="danger">
            <Label>Logout</Label>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
      <SettingsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
        }}
        athlete={athlete}
      />
    </Dropdown>
  )
}

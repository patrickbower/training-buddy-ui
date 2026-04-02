import { useState } from 'react'
import { Avatar, Dropdown, Label } from '@heroui/react'
import type { Athlete } from '@/types/domain'
import { SettingsModal } from './SettingsModal'

interface ProfileFooterProps {
  athlete: Athlete
}

export function ProfileFooter({ athlete }: ProfileFooterProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleAction = (key: string | number) => {
    if (key === 'settings') {
      setIsModalOpen(true)
    } else if (key === 'logout') {
      console.log('logout')
    }
  }

  return (
    <Dropdown>
      <Dropdown.Trigger>
        <button className="flex items-center gap-2 w-full" aria-label="Profile menu">
          <Avatar size="sm">
            <Avatar.Fallback className="text-xs">{athlete.name[0]}</Avatar.Fallback>
          </Avatar>
          <span className="text-xs text-zinc-500 truncate">{athlete.email}</span>
        </button>
      </Dropdown.Trigger>
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

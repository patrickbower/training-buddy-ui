import { Alert, Avatar, Button, Label, Modal } from '@heroui/react'
import { Check } from '@gravity-ui/icons'
import type { Athlete } from '@/types/domain'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  athlete: Athlete
}

export function SettingsModal({ isOpen, onClose, athlete }: SettingsModalProps) {
  return (
    <Modal.Backdrop
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <Modal.Container>
        <Modal.Dialog className="sm:max-w-lg">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Avatar size="sm">
              <Avatar.Fallback className="text-xs">{athlete.name[0]}</Avatar.Fallback>
            </Avatar>
            <Modal.Heading>Settings</Modal.Heading>
          </Modal.Header>
          <Modal.Body className="flex flex-col gap-4">
            {/* Email row */}
            <div className="flex items-center justify-between px-4">
              <div className="flex flex-col">
                <Label className="text-sm text-zinc-900">Email</Label>
                <span className="text-sm text-zinc-500">{athlete.email}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="size-4 text-zinc-400" />
              </div>
            </div>

            {/* Strava row */}
            <div className="flex items-center justify-between px-4">
              <div className="flex flex-col">
                <Label className="text-sm text-zinc-900">Strava</Label>
                <span className="text-sm text-zinc-500">{athlete.stravaId}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="size-4 text-zinc-400" />
              </div>
            </div>

            {/* Display preferences */}
            <Alert className="bg-zinc-50">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>Display preferences</Alert.Title>
                <Alert.Description>
                  Your preferences (e.g. km or miles) come from Strava and cannot be changed here.
                </Alert.Description>
              </Alert.Content>
              <Button
                size="sm"
                variant="tertiary"
                className="shrink-0"
                onPress={() => {
                  console.log('strava')
                }}
              >
                Strava
              </Button>
            </Alert>

            {/* Account access */}
            <Alert status="danger" className="bg-red-50">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>Account access</Alert.Title>
                <Alert.Description>
                  Deleting your account is permanent and cannot be undone.
                </Alert.Description>
              </Alert.Content>
              <Button
                size="sm"
                variant="primary"
                className="shrink-0 bg-[#ff383c] border-[#ff383c]"
                onPress={() => {
                  console.log('delete')
                }}
              >
                Delete
              </Button>
            </Alert>
          </Modal.Body>
          <Modal.Footer>
            <Button slot="close" onPress={onClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  )
}

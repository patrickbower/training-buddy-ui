import { useState } from 'react'
import { Avatar, Button, Label, Modal } from '@heroui/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { queryKeys } from '@/lib/queryKeys'
import type { Athlete, CoachingStyle } from '@/types/domain'

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  athlete: Athlete
}

const COACHING_STYLE_OPTIONS: { value: CoachingStyle; label: string }[] = [
  { value: 'supportive', label: 'Supportive' },
  { value: 'data_driven', label: 'Data-driven' },
  { value: 'tough_love', label: 'Tough love' },
  { value: 'balanced', label: 'Balanced' },
]

export function ProfileModal({ isOpen, onClose, athlete }: ProfileModalProps) {
  const queryClient = useQueryClient()
  const profile = athlete.profile

  const [primaryGoal, setPrimaryGoal] = useState(profile?.primaryGoal ?? '')
  const [goalTimeline, setGoalTimeline] = useState(profile?.goalTimeline ?? '')
  const [currentInjuries, setCurrentInjuries] = useState(profile?.currentInjuries ?? '')
  const [weeklyAvailabilityDays, setWeeklyAvailabilityDays] = useState(
    String(profile?.weeklyAvailabilityDays ?? ''),
  )
  const [coachingStyle, setCoachingStyle] = useState<CoachingStyle>(
    profile?.coachingStyle ?? 'balanced',
  )
  const [additionalContext, setAdditionalContext] = useState(profile?.additionalContext ?? '')

  const mutation = useMutation({
    mutationFn: () =>
      api.athlete.updateProfile({
        primaryGoal: primaryGoal || undefined,
        goalTimeline: goalTimeline || null,
        currentInjuries: currentInjuries || null,
        weeklyAvailabilityDays: weeklyAvailabilityDays ? Number(weeklyAvailabilityDays) : undefined,
        coachingStyle,
        additionalContext: additionalContext || null,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.athlete() })
      onClose()
    },
  })

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
            <Modal.Heading>Coaching Profile</Modal.Heading>
          </Modal.Header>
          <Modal.Body className="flex flex-col gap-4">
            <hr />

            {/* Runner type — read-only */}
            <div className="flex flex-col gap-1 px-4">
              <Label className="text-sm text-zinc-900">Runner type</Label>
              <span className="text-sm text-zinc-500">
                {profile?.runnerType.replace(/_/g, ' ') ?? '—'}
              </span>
              <span className="text-xs text-zinc-400">Set during onboarding — not editable</span>
            </div>

            <hr />

            {/* Primary goal */}
            <div className="flex flex-col gap-1 px-4">
              <Label className="text-sm text-zinc-900">Primary goal</Label>
              <input
                className="border border-zinc-200 rounded-lg px-3 py-2 text-sm"
                value={primaryGoal}
                onChange={(e) => {
                  setPrimaryGoal(e.target.value)
                }}
                placeholder="e.g. Run a sub-4 hour marathon"
              />
            </div>

            {/* Goal timeline */}
            <div className="flex flex-col gap-1 px-4">
              <Label className="text-sm text-zinc-900">Goal timeline</Label>
              <input
                className="border border-zinc-200 rounded-lg px-3 py-2 text-sm"
                type="date"
                value={goalTimeline}
                onChange={(e) => {
                  setGoalTimeline(e.target.value)
                }}
              />
            </div>

            {/* Current injuries */}
            <div className="flex flex-col gap-1 px-4">
              <Label className="text-sm text-zinc-900">Current injuries</Label>
              <input
                className="border border-zinc-200 rounded-lg px-3 py-2 text-sm"
                value={currentInjuries}
                onChange={(e) => {
                  setCurrentInjuries(e.target.value)
                }}
                placeholder="e.g. Sore left knee (or leave blank)"
              />
            </div>

            {/* Weekly availability */}
            <div className="flex flex-col gap-1 px-4">
              <Label className="text-sm text-zinc-900">Weekly training days</Label>
              <input
                className="border border-zinc-200 rounded-lg px-3 py-2 text-sm w-20"
                type="number"
                min={1}
                max={7}
                value={weeklyAvailabilityDays}
                onChange={(e) => {
                  setWeeklyAvailabilityDays(e.target.value)
                }}
              />
            </div>

            {/* Coaching style */}
            <div className="flex flex-col gap-1 px-4">
              <Label className="text-sm text-zinc-900">Coaching style</Label>
              <div className="flex flex-wrap gap-2">
                {COACHING_STYLE_OPTIONS.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => {
                      setCoachingStyle(value)
                    }}
                    className={`px-3 py-1 rounded-full text-sm border ${
                      coachingStyle === value
                        ? 'border-zinc-900 bg-zinc-900 text-white'
                        : 'border-zinc-200 text-zinc-700'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Additional context */}
            <div className="flex flex-col gap-1 px-4">
              <Label className="text-sm text-zinc-900">Additional context</Label>
              <textarea
                className="border border-zinc-200 rounded-lg px-3 py-2 text-sm resize-none"
                rows={3}
                value={additionalContext}
                onChange={(e) => {
                  setAdditionalContext(e.target.value)
                }}
                placeholder="Anything else your coach should know…"
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="ghost" onPress={onClose}>
              Cancel
            </Button>
            <Button
              onPress={() => {
                mutation.mutate()
              }}
              isPending={mutation.isPending}
            >
              Save
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  )
}

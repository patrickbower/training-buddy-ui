import { useState, useEffect } from 'react'
import { Button } from '@heroui/react'
import { useNavigate } from '@tanstack/react-router'
import { useStravaSnapshot } from '@/hooks/useStravaSnapshot'
import { useOnboarding, TOTAL_STEPS } from '@/hooks/useOnboarding'
import { useAuthStore } from '@/stores/authStore'
import { ChatInput } from '@/components/chat/ChatInput'
import type { RunnerType } from '@/types/domain'

// ── Summary copy ────────────────────────────────────────────────────────────

const summaryByRunnerType: Record<RunnerType, string> = {
  beginner_runner:
    "You're just getting started — and that's exciting. Your Strava shows you've been building a habit, and that foundation is everything.",
  intermediate_marathoner:
    "You've got real marathon miles in your legs. Your consistency and that long run speak for themselves.",
  experienced_ultra:
    "Ultra distances. That says a lot. You know how to suffer and keep going — let's channel that into something purposeful.",
  comeback_runner:
    "Life got in the way, but you're back. That took courage. Let's build you back up carefully and sustainably.",
  speed_focused:
    "Short, sharp, fast — that's your game. Your pace data shows you love pushing hard. Let's build on that speed.",
  inconsistent_runner:
    "Your running has had its ups and downs. That's normal. Together we'll find a rhythm that sticks.",
  minimal_data:
    "You're new here or just getting started on Strava. No worries — we'll figure out your training style as we go.",
}

// ── Step configuration ───────────────────────────────────────────────────────

interface StepConfig {
  prompt: string
  chips: string[]
  placeholder: string
  skippable: boolean
}

const STEPS: Partial<Record<number, StepConfig>> = {
  1: {
    prompt:
      "Based on your Strava history, I'd classify you as {inferredType}. Does that feel right?",
    chips: [
      'Yes, that sounds right',
      'Beginner runner',
      'Intermediate marathoner',
      'Speed focused',
      'Inconsistent runner',
      'Comeback runner',
      'Experienced ultra',
    ],
    placeholder: 'Describe your running background…',
    skippable: false,
  },
  2: {
    prompt: "What's your primary running goal, and when would you like to achieve it?",
    chips: [
      'Sub-4hr marathon by Oct 2026',
      'Run my first 5K',
      'Run consistently 4x/week',
      'Complete an ultra',
    ],
    placeholder: 'e.g. Run a sub-4 hour marathon by October…',
    skippable: false,
  },
  3: {
    prompt: 'Do you have a specific race or event in mind?',
    chips: ['London Marathon 2026', 'Local 10K', 'No specific event'],
    placeholder: 'Name the race or event…',
    skippable: true,
  },
  4: {
    prompt: 'How many days per week can you realistically train?',
    chips: ['3 days', '4 days', '5 days', '6 days'],
    placeholder: 'Enter a number…',
    skippable: false,
  },
  5: {
    prompt: 'Any current injuries or physical constraints I should know about?',
    chips: ['None', 'Sore knee', 'Lower back pain', 'Hip issue'],
    placeholder: 'Describe any injuries or limitations…',
    skippable: false,
  },
  6: {
    prompt: 'What coaching style works best for you?',
    chips: ['Supportive', 'Data-driven', 'Tough love', 'Balanced'],
    placeholder: 'Describe your preferred style…',
    skippable: false,
  },
  7: {
    prompt: 'Anything else I should know before we get started? (optional)',
    chips: ['Nothing else'],
    placeholder: 'Share anything else on your mind…',
    skippable: true,
  },
}

// ── Metric card ──────────────────────────────────────────────────────────────

interface MetricCardProps {
  label: string
  value: string
  dataWindow: string
}

function MetricCard({ label, value, dataWindow }: MetricCardProps) {
  return (
    <div className="flex flex-col items-center gap-1 p-4 rounded-xl bg-zinc-100 flex-1">
      <span className="text-2xl font-semibold text-zinc-900">{value}</span>
      <span className="text-sm font-medium text-zinc-700">{label}</span>
      <span className="text-xs text-zinc-400">{dataWindow}</span>
    </div>
  )
}

// ── Welcome screen ───────────────────────────────────────────────────────────

function WelcomeScreen({ onStart }: { onStart: () => void }) {
  const { snapshot, isLoading } = useStravaSnapshot()

  if (isLoading || !snapshot) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-sm text-zinc-400">Loading your Strava stats…</p>
      </div>
    )
  }

  const summary = summaryByRunnerType[snapshot.inferredRunnerType]

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 px-6 max-w-md mx-auto">
      <div className="flex gap-3 w-full">
        <MetricCard
          label="Total Runs"
          value={String(snapshot.totalActivities)}
          dataWindow={snapshot.dataWindow}
        />
        <MetricCard
          label="Avg Weekly"
          value={`${String(snapshot.avgWeeklyKm)} km`}
          dataWindow={snapshot.dataWindow}
        />
        <MetricCard
          label="Longest Run"
          value={`${String(snapshot.longestRunKm)} km`}
          dataWindow={snapshot.dataWindow}
        />
      </div>

      <p className="text-base text-zinc-600 text-center">{summary}</p>

      <Button size="lg" fullWidth onPress={onStart}>
        Let&apos;s Go
      </Button>
    </div>
  )
}

// ── Conversation step ────────────────────────────────────────────────────────

interface StepViewProps {
  step: number
  inferredRunnerType: RunnerType
  onNext: (answer: string) => void
  onBack: () => void
  onSkip: () => void
}

function StepView({ step, inferredRunnerType, onNext, onBack, onSkip }: StepViewProps) {
  const config = STEPS[step]
  if (!config) return null

  const prompt = config.prompt.replace('{inferredType}', inferredRunnerType.replace(/_/g, ' '))

  return (
    <div className="flex flex-col min-h-screen px-6 py-8 max-w-md mx-auto gap-6">
      <div className="flex items-center justify-between">
        <p className="text-xs text-zinc-400">
          Step {step}/{TOTAL_STEPS}
        </p>
        {step > 1 && (
          <button className="text-xs text-zinc-500 underline" onClick={onBack}>
            Back
          </button>
        )}
      </div>

      <p className="text-base font-medium text-zinc-800">{prompt}</p>

      <div className="flex flex-wrap gap-2">
        {config.chips.map((chip) => (
          <Button
            key={chip}
            size="sm"
            variant="outline"
            onPress={() => {
              onNext(chip)
            }}
          >
            {chip}
          </Button>
        ))}
      </div>

      <div className="mt-auto">
        <ChatInput onSend={onNext} />
      </div>

      {config.skippable && (
        <button className="text-xs text-zinc-400 underline text-center" onClick={onSkip}>
          Skip this step
        </button>
      )}
    </div>
  )
}

// ── Summary review (step 8) ──────────────────────────────────────────────────

const STEP_LABELS: Record<number, string> = {
  1: 'Runner type',
  2: 'Primary goal',
  3: 'Target race',
  4: 'Weekly days',
  5: 'Injuries',
  6: 'Coaching style',
  7: 'Additional context',
}

interface SummaryViewProps {
  answers: Partial<Record<number, string>>
  onBack: () => void
  onConfirm: () => void
  isSubmitting: boolean
}

function SummaryView({ answers, onBack, onConfirm, isSubmitting }: SummaryViewProps) {
  return (
    <div className="flex flex-col min-h-screen px-6 py-8 max-w-md mx-auto gap-6">
      <div className="flex items-center justify-between">
        <p className="text-xs text-zinc-400">Step 8/{TOTAL_STEPS}</p>
        <button className="text-xs text-zinc-500 underline" onClick={onBack}>
          Back
        </button>
      </div>

      <p className="text-base font-medium text-zinc-800">
        Here&apos;s what I know about you. Look right?
      </p>

      <div className="flex flex-col gap-3">
        {Object.entries(STEP_LABELS).map(([stepNum, label]) => {
          const answer = answers[Number(stepNum)]
          if (!answer) return null
          return (
            <div key={stepNum} className="flex flex-col gap-0.5">
              <span className="text-xs text-zinc-400 uppercase tracking-wide">{label}</span>
              <span className="text-sm text-zinc-800">{answer}</span>
            </div>
          )
        })}
      </div>

      <Button size="lg" fullWidth onPress={onConfirm} isDisabled={isSubmitting} className="mt-auto">
        {isSubmitting ? 'Saving…' : 'Looks good — start coaching'}
      </Button>
    </div>
  )
}

// ── Completion screen ─────────────────────────────────────────────────────────

function CompletionScreen({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="flex flex-col min-h-screen px-6 py-8 max-w-md mx-auto gap-6 items-center justify-center text-center">
      <p className="text-lg font-semibold text-zinc-900">You&apos;re all set!</p>
      <p className="text-sm text-zinc-500">
        You can update your coaching profile anytime from the profile menu at the bottom of the
        sidebar.
      </p>
      <Button onPress={onGetStarted}>Get started</Button>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

type PageStage = 'welcome' | 'conversation'

export function OnboardingPage() {
  const [stage, setStage] = useState<PageStage>('welcome')
  const { snapshot } = useStravaSnapshot()
  const { step, answers, next, back, skip, confirm, isSubmitting, isComplete, completedAthlete } =
    useOnboarding()
  const completeOnboarding = useAuthStore((s) => s.completeOnboarding)
  const navigate = useNavigate()

  useEffect(() => {
    if (isComplete && completedAthlete?.onboardingCompletedAt) {
      completeOnboarding(completedAthlete.onboardingCompletedAt)
    }
  }, [isComplete, completedAthlete, completeOnboarding])

  if (stage === 'welcome') {
    return (
      <WelcomeScreen
        onStart={() => {
          setStage('conversation')
        }}
      />
    )
  }

  if (isComplete) {
    return (
      <CompletionScreen
        onGetStarted={() => {
          void navigate({ to: '/chat/$conversationId', params: { conversationId: 'conv_01' } })
        }}
      />
    )
  }

  if (step === TOTAL_STEPS) {
    return (
      <SummaryView
        answers={answers}
        onBack={back}
        onConfirm={confirm}
        isSubmitting={isSubmitting}
      />
    )
  }

  return (
    <StepView
      step={step}
      inferredRunnerType={snapshot?.inferredRunnerType ?? 'minimal_data'}
      onNext={next}
      onBack={back}
      onSkip={skip}
    />
  )
}

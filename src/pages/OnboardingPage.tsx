import { Button } from '@heroui/react'
import { useNavigate } from '@tanstack/react-router'
import { useStravaSnapshot } from '@/hooks/useStravaSnapshot'
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

// ── Page ─────────────────────────────────────────────────────────────────────

export function OnboardingPage() {
  const navigate = useNavigate()

  return (
    <WelcomeScreen
      onStart={() => {
        void navigate({ to: '/chat/$conversationId', params: { conversationId: 'conv_01' } })
      }}
    />
  )
}

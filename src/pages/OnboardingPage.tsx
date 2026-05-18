import { Button } from '@heroui/react'
import { useNavigate } from '@tanstack/react-router'
import { useStravaSnapshot } from '@/hooks/useStravaSnapshot'
import { useAthlete } from '@/hooks/useAthlete'
import { TrainingBuddyLogo } from '@/components/shared/TrainingBuddyLogo'
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
}

function MetricCard({ label, value }: MetricCardProps) {
  return (
    <div className="flex flex-col items-center gap-1 p-4 rounded-xl bg-zinc-50 flex-1 text-center">
      <span className="text-lg sm:text-2xl font-semibold text-zinc-900">{value}</span>
      <span className="text-sm font-medium text-zinc-400">{label}</span>
    </div>
  )
}

// ── Athlete avatar ────────────────────────────────────────────────────────────

function AthleteAvatar({ url }: { url: string | null }) {
  if (url) {
    return <img src={url} alt="" aria-hidden="true" className="size-10 rounded-full object-cover" />
  }
  return <div className="size-10 rounded-full bg-zinc-200" aria-hidden="true" />
}

// ── Welcome screen ───────────────────────────────────────────────────────────

function WelcomeScreen({ onStart }: { onStart: () => void }) {
  const { snapshot, isLoading: snapshotLoading } = useStravaSnapshot()
  const { athlete, isLoading: athleteLoading } = useAthlete()

  if (snapshotLoading || athleteLoading || !snapshot) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-sm text-zinc-400">Loading your Strava stats…</p>
      </div>
    )
  }

  const summary = summaryByRunnerType[snapshot.inferredRunnerType]

  return (
    <div className="relative min-h-screen">
      <div className="absolute top-5 left-5">
        <TrainingBuddyLogo width={140} />
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-6 max-w-md mx-auto">
        <AthleteAvatar url={athlete?.avatarUrl ?? null} />

        <h1 className="text-xl font-semibold text-zinc-900 text-center">
          Nice work getting here {snapshot.athleteFirstName}
        </h1>

        <p className="text-sm text-zinc-500 text-center">{summary}</p>

        <div className="flex gap-3 w-full">
          <MetricCard label="Total Runs" value={String(snapshot.totalActivities)} />
          <MetricCard label="Avg Weekly" value={`${String(snapshot.avgWeeklyKm)} km`} />
          <MetricCard label="Longest" value={`${String(snapshot.longestRunKm)} km`} />
        </div>

        <Button
          className="rounded-full bg-accent text-accent-foreground text-sm font-medium px-6"
          onPress={onStart}
        >
          Let&apos;s go!
        </Button>
      </div>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export function OnboardingPage() {
  const navigate = useNavigate()

  return (
    <WelcomeScreen
      onStart={() => {
        void navigate({ to: '/onboarding/chat' })
      }}
    />
  )
}

import type { Athlete, StravaSnapshot } from '@/types/domain'

export const seedAthlete: Athlete = {
  id: 'ath_01',
  stravaId: '12345678',
  name: 'Alex Runner',
  email: 'alex@example.com',
  avatarUrl: null,
  onboardingCompletedAt: '2026-01-16T10:00:00Z',
  profile: {
    runnerType: 'intermediate_marathoner',
    primaryGoal: 'Run a sub-4 hour marathon',
    goalTimeline: '2026-10-01',
    currentInjuries: null,
    weeklyAvailabilityDays: 4,
    coachingStyle: 'data_driven',
    additionalContext: null,
    updatedAt: '2026-01-16T10:00:00Z',
  },
  createdAt: '2026-01-15T09:00:00Z',
}

export const seedNewAthlete: Athlete = {
  id: 'ath_02',
  stravaId: '87654321',
  name: 'Jordan New',
  email: 'jordan@example.com',
  avatarUrl: null,
  onboardingCompletedAt: null,
  profile: null,
  createdAt: '2026-05-01T09:00:00Z',
}

export const seedStravaSnapshot: StravaSnapshot = {
  totalActivities: 142,
  avgWeeklyKm: 38.5,
  longestRunKm: 32.1,
  avgPacePerKm: '5:28',
  dataWindow: 'Last 6 months',
  inferredRunnerType: 'intermediate_marathoner',
  inferredConfidence: 'high',
}

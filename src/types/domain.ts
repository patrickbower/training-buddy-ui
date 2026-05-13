// Canonical domain types for Training Buddy.
// Source of truth: docs/DOMAIN.md
// These types mirror the API contract in docs/API_CONTRACT.md

export type RunnerType =
  | 'beginner_runner'
  | 'intermediate_marathoner'
  | 'experienced_ultra'
  | 'comeback_runner'
  | 'speed_focused'
  | 'inconsistent_runner'
  | 'minimal_data'

export type CoachingStyle = 'supportive' | 'data_driven' | 'tough_love' | 'balanced'

export interface AthleteProfile {
  runnerType: RunnerType
  primaryGoal: string
  goalTimeline: string | null // ISO 8601 date
  currentInjuries: string | null
  weeklyAvailabilityDays: number
  coachingStyle: CoachingStyle
  additionalContext: string | null
  updatedAt: string // ISO 8601
}

export interface Athlete {
  id: string
  stravaId: string
  name: string
  email: string
  avatarUrl: string | null
  onboardingCompletedAt: string | null // null = onboarding not yet completed
  profile: AthleteProfile | null // null pre-onboarding
  createdAt: string // ISO 8601
}

export interface StravaSnapshot {
  athleteFirstName: string
  totalActivities: number
  avgWeeklyKm: number
  longestRunKm: number
  avgPacePerKm: string // e.g. "5:30"
  dataWindow: string // e.g. "Last 6 months"
  inferredRunnerType: RunnerType
  inferredConfidence: 'high' | 'low'
}

export interface StravaActivity {
  id: string
  date: string // ISO 8601 date (YYYY-MM-DD)
  distanceKm: number
  durationSeconds: number
  pacePerKm: string // e.g. "5:30"
}

export type SessionType = 'easy' | 'tempo' | 'interval' | 'long' | 'rest' | 'race'

export interface Session {
  id: string
  planId: string
  date: string // ISO 8601 date (YYYY-MM-DD)
  type: SessionType
  targetDistanceKm: number | null
  targetPacePerKm: string | null // e.g. "5:30"
  notes: string
  completedRunId: string | null
}

export type PlanStatus = 'active' | 'completed' | 'paused'

export interface TrainingPlan {
  id: string
  athleteId: string
  name: string
  description: string
  startDate: string // ISO 8601 date
  endDate: string // ISO 8601 date
  sessions: Session[]
  status: PlanStatus
  createdAt: string
}

export type PerceivedEffort = 1 | 2 | 3 | 4 | 5

export interface Run {
  id: string
  athleteId: string
  sessionId: string | null
  date: string // ISO 8601 date
  distanceKm: number
  durationSeconds: number
  averagePacePerKm: string // e.g. "5:45"
  averageHeartRate: number | null
  maxHeartRate: number | null
  elevationGainM: number | null
  perceivedEffort: PerceivedEffort | null
  stravaActivityId: string | null
  createdAt: string
}

export type MessageRole = 'athlete' | 'coach'

export interface OnboardingStep {
  index: number
  total: number
}

export interface MessageCard {
  title: string
  body: string
  cta?: { label: string; to: string }
}

export interface CoachMessage {
  id: string
  conversationId: string
  role: MessageRole
  content: string
  quickReplies: string[] | null
  onboardingStep: OnboardingStep | null
  card: MessageCard | null
  createdAt: string
}

export interface Conversation {
  id: string
  athleteId: string
  messages: CoachMessage[]
  createdAt: string
  updatedAt: string
}

// API response wrappers

export interface PaginatedRuns {
  runs: Run[]
  total: number
}

export interface ApiError {
  error: string
  code: 'UNAUTHORIZED' | 'NOT_FOUND' | 'VALIDATION_ERROR' | 'INTERNAL_ERROR' | (string & {})
}

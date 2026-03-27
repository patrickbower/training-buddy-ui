// Canonical domain types for Training Buddy.
// Source of truth: docs/DOMAIN.md
// These types mirror the API contract in docs/API_CONTRACT.md

export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced'

export type GoalType = 'race' | 'distance' | 'consistency' | 'weight_loss' | 'general_fitness'

export interface AthleteGoal {
  id: string
  type: GoalType
  description: string
  targetDate: string | null // ISO 8601 date
}

export interface Athlete {
  id: string
  stravaId: string
  name: string
  email: string
  avatarUrl: string | null
  fitnessLevel: FitnessLevel
  weeklyMileageTarget: number // km
  goals: AthleteGoal[]
  createdAt: string // ISO 8601
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

export interface CoachMessage {
  id: string
  conversationId: string
  role: MessageRole
  content: string
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

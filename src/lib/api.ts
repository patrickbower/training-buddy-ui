import type {
  Athlete,
  AthleteProfile,
  StravaSnapshot,
  Run,
  PaginatedRuns,
  TrainingPlan,
  Session,
  Conversation,
  CoachMessage,
  ApiError,
} from '@/types/domain'

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '/api'

export class ApiRequestError extends Error {
  readonly status: number
  readonly body: ApiError

  constructor(status: number, body: ApiError) {
    super(body.error)
    this.status = status
    this.body = body
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers)
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  const response = await fetch(`${BASE_URL}${path}`, {
    credentials: 'include',
    ...init,
    headers,
  })

  if (!response.ok) {
    const body = (await response.json()) as ApiError
    throw new ApiRequestError(response.status, body)
  }

  return response.json() as Promise<T>
}

function toQuery(params: Record<string, string | number>): string {
  return (
    '?' + new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString()
  )
}

export const api = {
  strava: {
    snapshot: (): Promise<StravaSnapshot> => request('/strava/snapshot'),
  },

  athlete: {
    get: (): Promise<Athlete> => request('/athlete'),
    update: (
      data: Partial<
        Omit<Athlete, 'id' | 'stravaId' | 'createdAt' | 'onboardingCompletedAt' | 'profile'>
      >,
    ): Promise<Athlete> => request('/athlete', { method: 'PATCH', body: JSON.stringify(data) }),
    updateProfile: (data: Partial<Omit<AthleteProfile, 'updatedAt'>>): Promise<AthleteProfile> =>
      request('/athlete/profile', { method: 'PATCH', body: JSON.stringify(data) }),
  },

  runs: {
    list: (params?: { limit?: number; offset?: number }): Promise<PaginatedRuns> => {
      const query = params ? toQuery(params as Record<string, number>) : ''
      return request(`/runs${query}`)
    },
    get: (id: string): Promise<Run> => request(`/runs/${id}`),
    create: (data: Omit<Run, 'id' | 'athleteId' | 'createdAt'>): Promise<Run> =>
      request('/runs', { method: 'POST', body: JSON.stringify(data) }),
  },

  trainingPlans: {
    list: (): Promise<TrainingPlan[]> => request('/training-plans'),
    get: (planId: string): Promise<TrainingPlan> => request(`/training-plans/${planId}`),
    generate: (data: {
      startDate: string
      goalId: string
      weeksCount: number
    }): Promise<TrainingPlan> =>
      request('/training-plans', { method: 'POST', body: JSON.stringify(data) }),
    updateSession: (planId: string, sessionId: string, data: Partial<Session>): Promise<Session> =>
      request(`/training-plans/${planId}/sessions/${sessionId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
  },

  conversation: {
    get: (): Promise<Conversation> => request('/conversation'),
    create: (): Promise<Conversation> => request('/conversation', { method: 'POST' }),
    sendMessage: (content: string, options?: { signal?: AbortSignal }): Promise<CoachMessage> =>
      request('/conversation/messages', {
        method: 'POST',
        body: JSON.stringify({ content }),
        signal: options?.signal,
      }),
  },
} as const

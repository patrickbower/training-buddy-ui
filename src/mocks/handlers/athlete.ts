import { http, HttpResponse } from 'msw'
import { seedAthlete, seedStravaSnapshot } from '../data/athlete'
import type { Athlete, AthleteProfile } from '@/types/domain'

// Starts with onboardingCompletedAt: null to simulate a fresh onboarding session.
// Set to a date when PATCH /api/athlete/profile is called (onboarding complete).
let mockAthlete: Athlete = { ...seedAthlete, onboardingCompletedAt: null }

export const athleteHandlers = [
  http.get('/api/athlete', () => {
    return HttpResponse.json(mockAthlete)
  }),

  http.patch('/api/athlete', async ({ request }) => {
    const body = await request.json()
    mockAthlete = { ...mockAthlete, ...(body as object) }
    return HttpResponse.json(mockAthlete)
  }),

  http.get('/api/strava/snapshot', () => {
    return HttpResponse.json(seedStravaSnapshot)
  }),

  http.patch('/api/athlete/profile', async ({ request }) => {
    const body = (await request.json()) as object
    const updatedProfile = {
      ...(mockAthlete.profile ?? {}),
      ...body,
      updatedAt: new Date().toISOString(),
    } as AthleteProfile
    mockAthlete = {
      ...mockAthlete,
      onboardingCompletedAt: new Date().toISOString(),
      profile: updatedProfile,
    }
    return HttpResponse.json(updatedProfile)
  }),
]

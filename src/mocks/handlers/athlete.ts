import { http, HttpResponse } from 'msw'
import { seedAthlete, seedStravaSnapshot } from '../data/athlete'

export const athleteHandlers = [
  http.get('/api/athlete', () => {
    return HttpResponse.json(seedAthlete)
  }),

  http.patch('/api/athlete', async ({ request }) => {
    const body = await request.json()
    const updated = { ...seedAthlete, ...(body as object) }
    return HttpResponse.json(updated)
  }),

  http.get('/api/strava/snapshot', () => {
    return HttpResponse.json(seedStravaSnapshot)
  }),

  http.patch('/api/athlete/profile', async ({ request }) => {
    const body = (await request.json()) as object
    const updatedProfile = {
      ...(seedAthlete.profile ?? {}),
      ...body,
      updatedAt: new Date().toISOString(),
    }
    return HttpResponse.json(updatedProfile)
  }),
]

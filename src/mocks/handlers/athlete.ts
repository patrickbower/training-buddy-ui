import { http, HttpResponse } from 'msw'
import { seedAthlete } from '../data/athlete'

export const athleteHandlers = [
  http.get('/api/athlete', () => {
    return HttpResponse.json(seedAthlete)
  }),

  http.patch('/api/athlete', async ({ request }) => {
    const body = await request.json()
    const updated = { ...seedAthlete, ...(body as object) }
    return HttpResponse.json(updated)
  }),
]

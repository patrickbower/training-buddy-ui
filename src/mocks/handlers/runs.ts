import { http, HttpResponse } from 'msw'
import type { Run } from '@/types/domain'
import { seedRuns } from '../data/runs'

// In-memory store so POST persists within a session
let runs = [...seedRuns]

export const runHandlers = [
  http.get('/api/runs', ({ request }) => {
    const url = new URL(request.url)
    const limit = Number(url.searchParams.get('limit') ?? 20)
    const offset = Number(url.searchParams.get('offset') ?? 0)

    const paginated = runs.slice(offset, offset + limit)
    return HttpResponse.json({ runs: paginated, total: runs.length })
  }),

  http.get('/api/runs/:id', ({ params }) => {
    const run = runs.find((r) => r.id === params.id)
    if (!run) {
      return HttpResponse.json({ error: 'Run not found', code: 'NOT_FOUND' }, { status: 404 })
    }
    return HttpResponse.json(run)
  }),

  http.post('/api/runs', async ({ request }) => {
    const body = (await request.json()) as Omit<Run, 'id' | 'athleteId' | 'createdAt'>
    const newRun: Run = {
      id: `run_${crypto.randomUUID()}`,
      athleteId: 'ath_01',
      createdAt: new Date().toISOString(),
      ...body,
    }
    runs = [newRun, ...runs]
    return HttpResponse.json(newRun, { status: 201 })
  }),
]

export function resetMockState() {
  runs = [...seedRuns]
}

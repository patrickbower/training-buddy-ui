# Mocking Conventions

MSW (Mock Service Worker) is the single mocking strategy for all API calls. No `jest.mock`, no manual fetch mocks.

## Why MSW

MSW intercepts at the network layer, so the same handlers work in unit tests (via `msw/node`) and in the browser during development (`msw/browser`). This means mock data is a first-class development tool, not just a test concern.

## Structure

```
src/mocks/
  handlers/
    athlete.ts        # GET /athlete
    runs.ts           # GET /runs, POST /runs
    trainingPlans.ts  # GET /training-plans, POST /training-plans
    conversation.ts   # GET /conversation, POST /conversation/messages
  data/
    athlete.ts        # seed Athlete
    runs.ts           # seed Run[]
    trainingPlans.ts  # seed TrainingPlan[]
    conversation.ts   # seed Conversation with CoachMessages
  server.ts           # msw/node server for tests
  browser.ts          # msw/browser worker for development
  index.ts            # exports handlers[]
```

## Handler pattern

```ts
// src/mocks/handlers/runs.ts
import { http, HttpResponse } from 'msw'
import { seedRuns } from '../data/runs'

export const runHandlers = [
  http.get('/api/runs', () => {
    return HttpResponse.json(seedRuns)
  }),

  http.post('/api/runs', async ({ request }) => {
    const body = await request.json()
    const newRun = { id: crypto.randomUUID(), ...body, createdAt: new Date().toISOString() }
    return HttpResponse.json(newRun, { status: 201 })
  }),
]
```

## Using in tests

The MSW server is set up globally in `src/test/setup.ts`. No per-test boilerplate needed for happy-path scenarios.

To override a handler in a specific test:

```ts
import { server } from '@/mocks/server'
import { http, HttpResponse } from 'msw'

it('shows an error when the API fails', async () => {
  server.use(
    http.get('/api/runs', () => HttpResponse.json({ error: 'Server error' }, { status: 500 })),
  )
  // ... render and assert
})
```

## Development mode

When `VITE_USE_MOCKS=true`, the MSW browser worker starts automatically in `src/main.tsx`. This lets the app run fully without a backend.

See [API_CONTRACT.md](API_CONTRACT.md) for the full list of endpoints being mocked.

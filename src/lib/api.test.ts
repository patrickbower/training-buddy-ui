import { describe, it, expect } from 'vitest'
import { api, ApiRequestError } from './api'
import { server } from '@/mocks/server'
import { http, HttpResponse } from 'msw'

describe('api.athlete', () => {
  it('get() resolves with the athlete profile', async () => {
    const athlete = await api.athlete.get()
    expect(athlete.id).toBe('ath_01')
    expect(athlete.name).toBe('Alex Runner')
  })

  it('update() sends a PATCH and resolves with the updated athlete', async () => {
    const updated = await api.athlete.update({ name: 'Pat Runner' })
    expect(updated.name).toBe('Pat Runner')
    expect(updated.id).toBe('ath_01')
  })
})

describe('api.runs', () => {
  it('list() resolves with paginated runs', async () => {
    const result = await api.runs.list()
    expect(result.runs).toBeInstanceOf(Array)
    expect(typeof result.total).toBe('number')
  })

  it('list({ limit, offset }) serialises query params', async () => {
    let capturedUrl = ''
    server.use(
      http.get('/api/runs', ({ request }) => {
        capturedUrl = request.url
        return HttpResponse.json({ runs: [], total: 0 })
      }),
    )
    await api.runs.list({ limit: 5, offset: 10 })
    expect(capturedUrl).toContain('limit=5')
    expect(capturedUrl).toContain('offset=10')
  })

  it('get(id) resolves with a single run', async () => {
    const run = await api.runs.get('run_01')
    expect(run.id).toBe('run_01')
    expect(run.athleteId).toBe('ath_01')
  })

  it('create(data) sends POST and resolves with the created run', async () => {
    const run = await api.runs.create({
      sessionId: null,
      date: '2026-03-28',
      distanceKm: 10,
      durationSeconds: 3000,
      averagePacePerKm: '5:00',
      averageHeartRate: null,
      maxHeartRate: null,
      elevationGainM: null,
      perceivedEffort: null,
      stravaActivityId: null,
    })
    expect(run.distanceKm).toBe(10)
    expect(run.id).toBeDefined()
  })
})

describe('api.trainingPlans', () => {
  it('list() resolves with an array of training plans', async () => {
    const plans = await api.trainingPlans.list()
    expect(plans).toBeInstanceOf(Array)
    expect(plans[0].id).toBe('plan_01')
  })

  it('get(planId) resolves with a single training plan', async () => {
    const plan = await api.trainingPlans.get('plan_01')
    expect(plan.id).toBe('plan_01')
    expect(plan.sessions).toBeInstanceOf(Array)
  })

  it('generate(data) sends POST and resolves with the created plan', async () => {
    const plan = await api.trainingPlans.generate({
      startDate: '2026-04-01',
      goalId: 'goal_01',
      weeksCount: 8,
    })
    expect(plan.id).toBeDefined()
    expect(plan.name).toContain('8-Week')
  })

  it('updateSession() sends PATCH and resolves with the updated session', async () => {
    const session = await api.trainingPlans.updateSession('plan_01', 'sess_01', {
      completedRunId: 'run_01',
    })
    expect(session.completedRunId).toBe('run_01')
  })
})

describe('api.conversation', () => {
  it('get() resolves with the conversation', async () => {
    const conversation = await api.conversation.get()
    expect(conversation.id).toBeDefined()
    expect(conversation.messages).toBeInstanceOf(Array)
  })

  it('sendMessage() sends POST and resolves with a CoachMessage', async () => {
    const message = await api.conversation.sendMessage('How far should I run today?')
    expect(message.role).toBe('coach')
    expect(message.content).toBeDefined()
  })
})

describe('ApiRequestError', () => {
  it('is thrown with status and body when the response is not ok', async () => {
    server.use(
      http.get('/api/runs/:id', () =>
        HttpResponse.json({ error: 'Run not found', code: 'NOT_FOUND' }, { status: 404 }),
      ),
    )
    await expect(api.runs.get('run_missing')).rejects.toBeInstanceOf(ApiRequestError)
    await expect(api.runs.get('run_missing')).rejects.toMatchObject({
      status: 404,
      body: { error: 'Run not found', code: 'NOT_FOUND' },
    })
  })
})

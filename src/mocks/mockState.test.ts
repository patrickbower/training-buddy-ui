import { describe, it, expect } from 'vitest'
import { api } from '@/lib/api'
import { resetMockState } from './handlers/runs'
import { resetMockState as resetPlansMockState } from './handlers/trainingPlans'
import {
  resetMockState as resetConversationMockState,
  setNextCoachResponse,
} from './handlers/conversation'
import { resetMockState as resetAll } from './index'

describe('runs handler state', () => {
  it('resetMockState() restores the original seed runs after a POST has mutated state', async () => {
    const before = await api.runs.list()
    const originalTotal = before.total

    await api.runs.create({
      sessionId: null,
      date: '2026-03-28',
      distanceKm: 5,
      durationSeconds: 1500,
      averagePacePerKm: '5:00',
      averageHeartRate: null,
      maxHeartRate: null,
      elevationGainM: null,
      perceivedEffort: null,
      stravaActivityId: null,
    })

    const afterPost = await api.runs.list()
    expect(afterPost.total).toBe(originalTotal + 1)

    resetMockState()

    const afterReset = await api.runs.list()
    expect(afterReset.total).toBe(originalTotal)
  })
})

describe('trainingPlans handler state', () => {
  it('resetMockState() restores the original seed plans after a POST has mutated state', async () => {
    const before = await api.trainingPlans.list()
    const originalCount = before.length

    await api.trainingPlans.generate({ startDate: '2026-04-01', goalId: 'goal_01', weeksCount: 8 })

    const afterPost = await api.trainingPlans.list()
    expect(afterPost.length).toBe(originalCount + 1)

    resetPlansMockState()

    const afterReset = await api.trainingPlans.list()
    expect(afterReset.length).toBe(originalCount)
  })
})

describe('conversation handler state', () => {
  it('resetMockState() resets responseIndex so the next POST returns coachResponses[0]', async () => {
    const firstResponse = (await api.conversation.sendMessage('hello')).content
    const secondResponse = (await api.conversation.sendMessage('hello')).content

    // Responses should differ — the index has advanced
    expect(secondResponse).not.toBe(firstResponse)

    resetConversationMockState()

    const afterReset = (await api.conversation.sendMessage('hello')).content
    expect(afterReset).toBe(firstResponse)
  })

  it('setNextCoachResponse() makes the next POST return that specific content (one-shot)', async () => {
    setNextCoachResponse('Take a rest day. Fatigue is data.')

    const response = (await api.conversation.sendMessage('How am I doing?')).content
    expect(response).toBe('Take a rest day. Fatigue is data.')

    // Second POST should fall back to round-robin — not the override
    const secondResponse = (await api.conversation.sendMessage('And now?')).content
    expect(secondResponse).not.toBe('Take a rest day. Fatigue is data.')
  })
})

describe('aggregated resetMockState from index', () => {
  it('resets runs, plans, and conversation state in one call', async () => {
    // Start from a known clean state for this test
    resetAll()

    const originalRunsTotal = (await api.runs.list()).total
    const originalPlansCount = (await api.trainingPlans.list()).length
    const firstReply = (await api.conversation.sendMessage('hi')).content

    await api.runs.create({
      sessionId: null,
      date: '2026-03-28',
      distanceKm: 5,
      durationSeconds: 1500,
      averagePacePerKm: '5:00',
      averageHeartRate: null,
      maxHeartRate: null,
      elevationGainM: null,
      perceivedEffort: null,
      stravaActivityId: null,
    })
    await api.trainingPlans.generate({ startDate: '2026-04-01', goalId: 'goal_01', weeksCount: 4 })
    await api.conversation.sendMessage('hi')

    resetAll()

    expect((await api.runs.list()).total).toBe(originalRunsTotal)
    expect((await api.trainingPlans.list()).length).toBe(originalPlansCount)
    // responseIndex reset: next reply cycles back to what index 0 returned
    expect((await api.conversation.sendMessage('hi')).content).toBe(firstReply)
  })
})

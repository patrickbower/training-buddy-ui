import { it, expect } from 'vitest'
import type { Run, Session, TrainingPlan, CoachMessage } from '@/types/domain'
import { baseRun, seedRuns } from '../runs'
import { baseCoachMessage, baseAthleteMessage, seedConversation } from '../conversation'
import { makeTrainingPlan } from '@/test/factories'
import {
  baseEasySession,
  baseTempoSession,
  baseLongSession,
  baseRestSession,
  baseTrainingPlan,
  seedTrainingPlan,
  seedTrainingPlans,
} from '../trainingPlans'

it('baseRun satisfies Run and is included in seedRuns', () => {
  const run: Run = baseRun
  expect(run.id).toBe('run_01')
  expect(seedRuns[0]).toBe(baseRun)
})

it('session bases satisfy Session with correct types', () => {
  const easy: Session = baseEasySession
  expect(easy.type).toBe('easy')

  const tempo: Session = baseTempoSession
  expect(tempo.type).toBe('tempo')

  const long: Session = baseLongSession
  expect(long.type).toBe('long')

  const rest: Session = baseRestSession
  expect(rest.type).toBe('rest')
  expect(rest.targetDistanceKm).toBeNull()
})

it('baseTrainingPlan satisfies TrainingPlan and is the same object as seedTrainingPlan', () => {
  const plan: TrainingPlan = baseTrainingPlan
  expect(plan.id).toBe('plan_01')
  expect(plan.sessions).toHaveLength(4)
  expect(seedTrainingPlan).toBe(baseTrainingPlan)
  expect(seedTrainingPlans[0]).toBe(baseTrainingPlan)
})

it('baseCoachMessage and baseAthleteMessage satisfy CoachMessage with correct roles', () => {
  const coach: CoachMessage = baseCoachMessage
  expect(coach.role).toBe('coach')

  const athlete: CoachMessage = baseAthleteMessage
  expect(athlete.role).toBe('athlete')

  expect(seedConversation.messages[0]).toBe(baseCoachMessage)
})

it('CoachMessage carries quickReplies — string[] on onboarding prompts, null elsewhere', () => {
  expect(Array.isArray(baseCoachMessage.quickReplies)).toBe(true)
  expect(baseCoachMessage.quickReplies?.length).toBeGreaterThan(0)

  expect(baseAthleteMessage.quickReplies).toBeNull()

  const withChips = seedConversation.messages.filter((m) => Array.isArray(m.quickReplies))
  expect(withChips.length).toBeGreaterThan(0)
})

it('makeTrainingPlan returns a TrainingPlan with defaults and applies overrides', () => {
  const plan: TrainingPlan = makeTrainingPlan()
  expect(plan.id).toBe('plan_01')

  const custom = makeTrainingPlan({ id: 'plan_test', name: 'Custom Plan' })
  expect(custom.id).toBe('plan_test')
  expect(custom.name).toBe('Custom Plan')
  expect(custom.athleteId).toBe('ath_01') // base value preserved
})

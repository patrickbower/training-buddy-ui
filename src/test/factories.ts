import type { TrainingPlan } from '@/types/domain'
import { baseTrainingPlan } from '@/mocks/data/trainingPlans'

export function makeTrainingPlan(overrides?: Partial<TrainingPlan>): TrainingPlan {
  return { ...baseTrainingPlan, ...overrides }
}

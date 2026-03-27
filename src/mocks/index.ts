import { athleteHandlers } from './handlers/athlete'
import { runHandlers } from './handlers/runs'
import { trainingPlanHandlers } from './handlers/trainingPlans'
import { conversationHandlers } from './handlers/conversation'

export const handlers = [
  ...athleteHandlers,
  ...runHandlers,
  ...trainingPlanHandlers,
  ...conversationHandlers,
]

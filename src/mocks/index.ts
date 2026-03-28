import { athleteHandlers } from './handlers/athlete'
import { runHandlers, resetMockState as resetRuns } from './handlers/runs'
import { trainingPlanHandlers, resetMockState as resetPlans } from './handlers/trainingPlans'
import { conversationHandlers, resetMockState as resetConversation } from './handlers/conversation'

export const handlers = [
  ...athleteHandlers,
  ...runHandlers,
  ...trainingPlanHandlers,
  ...conversationHandlers,
]

export function resetMockState() {
  resetRuns()
  resetPlans()
  resetConversation()
}

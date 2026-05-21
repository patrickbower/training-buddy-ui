import { http, HttpResponse } from 'msw'
import {
  seedConversation,
  onboardingSequence,
  cannedResponses,
  TOTAL_ONBOARDING_STEPS,
} from '../data/conversation'
import type { Conversation, CoachMessage } from '@/types/domain'

let conversation: Conversation = { ...seedConversation, messages: [...seedConversation.messages] }

const TOTAL_STEPS = TOTAL_ONBOARDING_STEPS

let responseIndex = 0
let nextCoachResponse: string | null = null

export const conversationHandlers = [
  http.get('/api/conversation', () => {
    return HttpResponse.json(conversation)
  }),

  http.post('/api/conversation', () => {
    const newConversation: Conversation = {
      id: 'conv_02',
      athleteId: 'ath_01',
      messages: [
        {
          id: `msg_${crypto.randomUUID()}`,
          conversationId: 'conv_02',
          role: 'coach',
          content:
            "You're targeting a sub-4hr marathon by October — let's build your plan. Where do you want to start?",
          quickReplies: ['My weekly schedule', 'Race-day prep', 'Start from scratch'],
          onboardingStep: null,
          card: null,
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    // Replace active conversation so GET /api/conversation returns the new one
    conversation = newConversation
    return HttpResponse.json(newConversation, { status: 201 })
  }),

  http.post('/api/conversation/messages', async ({ request }) => {
    const body = (await request.json()) as { content: string }

    // Add athlete message
    const athleteMessage: CoachMessage = {
      id: `msg_${crypto.randomUUID()}`,
      conversationId: conversation.id,
      role: 'athlete',
      content: body.content,
      quickReplies: null,
      onboardingStep: null,
      card: null,
      createdAt: new Date().toISOString(),
    }

    // Add coach response — one-shot override → onboarding sequence → canned fallback
    let coachContent: string
    let coachQuickReplies: string[] | null = null
    let coachOnboardingStep: CoachMessage['onboardingStep'] = null
    let coachCard: CoachMessage['card'] = null

    if (nextCoachResponse !== null) {
      coachContent = nextCoachResponse
      nextCoachResponse = null
    } else if (responseIndex < onboardingSequence.length) {
      const step = onboardingSequence[responseIndex]
      coachContent = step.content
      coachQuickReplies = step.quickReplies
      coachCard = step.card
      coachOnboardingStep = step.complete
        ? { index: TOTAL_STEPS, total: TOTAL_STEPS, complete: true }
        : { index: responseIndex + 2, total: TOTAL_STEPS }
      responseIndex++
    } else {
      coachContent =
        cannedResponses[(responseIndex - onboardingSequence.length) % cannedResponses.length]
      responseIndex++
    }

    const coachMessage: CoachMessage = {
      id: `msg_${crypto.randomUUID()}`,
      conversationId: conversation.id,
      role: 'coach',
      content: coachContent,
      quickReplies: coachQuickReplies,
      onboardingStep: coachOnboardingStep,
      card: coachCard,
      createdAt: new Date().toISOString(),
    }

    conversation = {
      ...conversation,
      messages: [...conversation.messages, athleteMessage, coachMessage],
      updatedAt: new Date().toISOString(),
    }

    // Return the coach message (in production this would be SSE streaming)
    return HttpResponse.json(coachMessage, { status: 201 })
  }),
]

export function resetMockState() {
  conversation = { ...seedConversation, messages: [...seedConversation.messages] }
  responseIndex = 0
  nextCoachResponse = null
}

export function setNextCoachResponse(content: string) {
  nextCoachResponse = content
}

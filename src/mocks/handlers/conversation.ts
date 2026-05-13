import { http, HttpResponse } from 'msw'
import { seedConversation } from '../data/conversation'
import type { Conversation, CoachMessage } from '@/types/domain'

let conversation: Conversation = { ...seedConversation, messages: [...seedConversation.messages] }

// Onboarding sequence — mirrors what the real backend returns for conv_01
const onboardingSequence: { content: string; quickReplies: string[] | null }[] = [
  {
    content: "Great! What's your primary running goal?",
    quickReplies: [
      'Sub-4hr marathon by Oct 2026',
      'Run my first 5K',
      'Run consistently 4x/week',
      'Complete an ultra',
    ],
  },
  {
    content: 'How many days a week can you realistically train?',
    quickReplies: ['3 days', '4 days', '5 days', '6+ days'],
  },
  {
    content: "What's your current weekly mileage?",
    quickReplies: ['Under 20 km', '20–40 km', '40–60 km', 'Over 60 km'],
  },
  {
    content: 'Do you have any upcoming races already on the calendar?',
    quickReplies: ['Yes, a few', 'Just one target race', 'Nothing booked yet'],
  },
  {
    content:
      "Love it. Here's what I know about you: intermediate marathoner, targeting a sub-4hr marathon by October, training 4 days a week. You can update your coaching profile anytime from the profile menu at the bottom of the sidebar. Ready to build your plan?",
    quickReplies: null,
  },
]

// Fallback canned responses used after onboarding sequence is exhausted
const cannedResponses = [
  "Great question! Based on your recent training, I'd recommend keeping today's effort easy — around 70% max heart rate. Listen to your body and don't push if you're feeling fatigued.",
  "You're making excellent progress. Consistency is the key to marathon success, and you're nailing it. Keep up the fantastic work!",
  "That's something we should definitely factor into your plan. Rest and recovery are just as important as the runs themselves.",
  "I've looked at your recent runs and your pacing is really improving. Your tempo sessions in particular are looking strong.",
]

let responseIndex = 0
let nextCoachResponse: string | null = null

export const conversationHandlers = [
  http.get('/api/conversation', () => {
    return HttpResponse.json(conversation)
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
      createdAt: new Date().toISOString(),
    }

    // Add coach response — one-shot override → onboarding sequence → canned fallback
    let coachContent: string
    let coachQuickReplies: string[] | null = null

    if (nextCoachResponse !== null) {
      coachContent = nextCoachResponse
      nextCoachResponse = null
    } else if (responseIndex < onboardingSequence.length) {
      const step = onboardingSequence[responseIndex]
      coachContent = step.content
      coachQuickReplies = step.quickReplies
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

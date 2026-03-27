import { http, HttpResponse } from 'msw'
import { seedConversation } from '../data/conversation'
import type { Conversation, CoachMessage } from '@/types/domain'

let conversation: Conversation = { ...seedConversation, messages: [...seedConversation.messages] }

// Canned coach responses for the mock
const coachResponses = [
  "Great question! Based on your recent training, I'd recommend keeping today's effort easy — around 70% max heart rate. Listen to your body and don't push if you're feeling fatigued.",
  "You're making excellent progress. Consistency is the key to marathon success, and you're nailing it. Keep up the fantastic work!",
  "That's something we should definitely factor into your plan. Rest and recovery are just as important as the runs themselves.",
  "I've looked at your recent runs and your pacing is really improving. Your tempo sessions in particular are looking strong.",
]

let responseIndex = 0

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
      createdAt: new Date().toISOString(),
    }

    // Add coach response
    const coachMessage: CoachMessage = {
      id: `msg_${crypto.randomUUID()}`,
      conversationId: conversation.id,
      role: 'coach',
      content: coachResponses[responseIndex % coachResponses.length],
      createdAt: new Date().toISOString(),
    }
    responseIndex++

    conversation = {
      ...conversation,
      messages: [...conversation.messages, athleteMessage, coachMessage],
      updatedAt: new Date().toISOString(),
    }

    // Return the coach message (in production this would be SSE streaming)
    return HttpResponse.json(coachMessage, { status: 201 })
  }),
]

import { http, HttpResponse } from 'msw'
import { seedConversation } from '../data/conversation'
import type { Conversation, CoachMessage, MessageCard } from '@/types/domain'

let conversation: Conversation = { ...seedConversation, messages: [...seedConversation.messages] }

// Onboarding sequence — Q2–Q7 then synthesis (Q1 is pre-seeded, so index starts at 2)
const TOTAL_STEPS = 7
const onboardingSequence: {
  content: string
  quickReplies: string[] | null
  card: MessageCard | null
}[] = [
  {
    content: "What's your primary running goal, and when would you like to achieve it?",
    quickReplies: [
      'Sub-4hr marathon by Oct 2026',
      'Run my first 5K',
      'Run consistently 4x/week',
      'Complete an ultra',
    ],
    card: null,
  },
  {
    content: 'Do you have a specific race or event in mind?',
    quickReplies: ['London Marathon 2026', 'Local 10K', 'No specific event'],
    card: null,
  },
  {
    content: 'How many days per week can you realistically train?',
    quickReplies: ['3 days', '4 days', '5 days', '6 days'],
    card: null,
  },
  {
    content: 'Any current injuries or physical constraints I should know about?',
    quickReplies: ['None', 'Sore knee', 'Lower back pain', 'Hip issue'],
    card: null,
  },
  {
    content: 'What coaching style works best for you?',
    quickReplies: ['Supportive', 'Data-driven', 'Tough love', 'Balanced'],
    card: null,
  },
  {
    content: 'Anything else I should know before we get started? (optional)',
    quickReplies: ['Nothing else'],
    card: null,
  },
  {
    content:
      "Here's what I know about you: intermediate marathoner, targeting a **sub-4hr marathon** by October, training **4 days a week**, London Marathon 2026 in sight.",
    quickReplies: null,
    card: {
      title: "You're all set!",
      body: 'Your coaching profile is saved. You can update it anytime from the profile menu in the sidebar.',
      cta: { label: "Let's build your plan →", to: '/' },
    },
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
      // Sequence starts at Q2 (index 2), seed covered Q1
      coachOnboardingStep = { index: responseIndex + 2, total: TOTAL_STEPS }
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

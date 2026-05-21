import type { CoachMessage, Conversation, MessageCard } from '@/types/domain'

export interface OnboardingStep {
  content: string
  quickReplies: string[] | null
  card: MessageCard | null
  complete?: boolean
}

export const TOTAL_ONBOARDING_STEPS = 7

export const onboardingSequence: OnboardingStep[] = [
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
    complete: true,
  },
]

export const cannedResponses = [
  "Great question! Based on your recent training, I'd recommend keeping today's effort easy — around 70% max heart rate. Listen to your body and don't push if you're feeling fatigued.",
  "You're making excellent progress. Consistency is the key to marathon success, and you're nailing it. Keep up the fantastic work!",
  "That's something we should definitely factor into your plan. Rest and recovery are just as important as the runs themselves.",
  "I've looked at your recent runs and your pacing is really improving. Your tempo sessions in particular are looking strong.",
]

export const baseCoachMessage: CoachMessage = {
  id: 'msg_01',
  conversationId: 'conv_01',
  role: 'coach',
  content:
    "Based on your Strava history, I'd classify you as an intermediate marathoner. Does that feel right?",
  quickReplies: [
    'Yes, that sounds right',
    'Beginner runner',
    'Intermediate marathoner',
    'Speed focused',
    'Comeback runner',
    'Experienced ultra',
  ],
  onboardingStep: { index: 1, total: 7 },
  card: null,
  createdAt: '2026-03-25T10:00:00Z',
}

export const baseAthleteMessage: CoachMessage = {
  id: 'msg_02',
  conversationId: 'conv_01',
  role: 'athlete',
  content: 'Yes, that sounds right',
  quickReplies: null,
  onboardingStep: null,
  card: null,
  createdAt: '2026-03-25T10:01:00Z',
}

export const seedConversation: Conversation = {
  id: 'conv_01',
  athleteId: 'ath_01',
  createdAt: '2026-03-25T10:00:00Z',
  updatedAt: '2026-03-25T10:00:00Z',
  messages: [baseCoachMessage],
}

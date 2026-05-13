import type { CoachMessage, Conversation } from '@/types/domain'

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
  createdAt: '2026-03-25T10:00:00Z',
}

export const baseAthleteMessage: CoachMessage = {
  id: 'msg_02',
  conversationId: 'conv_01',
  role: 'athlete',
  content: 'Yes, that sounds right',
  quickReplies: null,
  createdAt: '2026-03-25T10:01:00Z',
}

export const seedConversation: Conversation = {
  id: 'conv_01',
  athleteId: 'ath_01',
  createdAt: '2026-03-25T10:00:00Z',
  updatedAt: '2026-03-27T08:15:00Z',
  messages: [
    baseCoachMessage,
    baseAthleteMessage,
    {
      id: 'msg_03',
      conversationId: 'conv_01',
      role: 'coach',
      content: "Great! What's your primary running goal?",
      quickReplies: [
        'Sub-4hr marathon by Oct 2026',
        'Run my first 5K',
        'Run consistently 4x/week',
        'Complete an ultra',
      ],
      createdAt: '2026-03-25T10:01:30Z',
    },
    {
      id: 'msg_04',
      conversationId: 'conv_01',
      role: 'athlete',
      content: 'Sub-4hr marathon by Oct 2026',
      quickReplies: null,
      createdAt: '2026-03-27T08:14:00Z',
    },
    {
      id: 'msg_05',
      conversationId: 'conv_01',
      role: 'coach',
      content:
        "Love it. Here's what I know about you: intermediate marathoner, targeting a sub-4hr marathon by October. You can update your coaching profile anytime from the profile menu at the bottom of the sidebar. Ready to build your plan?",
      quickReplies: null,
      createdAt: '2026-03-27T08:15:00Z',
    },
  ],
}

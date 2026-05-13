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
  updatedAt: '2026-03-25T10:00:00Z',
  messages: [baseCoachMessage],
}

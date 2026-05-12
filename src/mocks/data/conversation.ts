import type { CoachMessage, Conversation } from '@/types/domain'

export const baseCoachMessage: CoachMessage = {
  id: 'msg_01',
  conversationId: 'conv_01',
  role: 'coach',
  content:
    "Welcome, Alex! Based on your onboarding, I can see you're an intermediate marathoner aiming for a sub-4 hour marathon. I've got everything I need to build a plan around your goal. Ready to get started?",
  createdAt: '2026-03-25T10:00:00Z',
}

export const baseAthleteMessage: CoachMessage = {
  id: 'msg_02',
  conversationId: 'conv_01',
  role: 'athlete',
  content: "Yes! I'm a bit nervous about the long runs. How should I pace them?",
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
      content:
        "That's completely normal — and honestly a sign you're taking it seriously. For your long runs, aim for a pace where you can hold a full conversation. Based on your recent 14.5km at 6:00/km, I'd suggest keeping long runs between 6:00–6:30/km. The goal is time on feet, not speed. You'll build endurance without frying your legs for the week ahead.",
      createdAt: '2026-03-25T10:01:30Z',
    },
    {
      id: 'msg_04',
      conversationId: 'conv_01',
      role: 'athlete',
      content: 'That makes sense. What about nutrition on the long runs?',
      createdAt: '2026-03-27T08:14:00Z',
    },
    {
      id: 'msg_05',
      conversationId: 'conv_01',
      role: 'coach',
      content:
        "Great question. Once your long runs go over 75 minutes, start practising with gels or chews. I've added a note to your Saturday session to take one at 10km. This isn't just about energy — it's training your gut to handle fuel while running, which is crucial on race day.",
      createdAt: '2026-03-27T08:15:00Z',
    },
  ],
}

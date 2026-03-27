import type { Athlete } from '@/types/domain'

export const seedAthlete: Athlete = {
  id: 'ath_01',
  stravaId: '12345678',
  name: 'Alex Runner',
  email: 'alex@example.com',
  avatarUrl: null,
  fitnessLevel: 'intermediate',
  weeklyMileageTarget: 40,
  goals: [
    {
      id: 'goal_01',
      type: 'race',
      description: 'Sub-4 hour marathon',
      targetDate: '2026-10-01',
    },
    {
      id: 'goal_02',
      type: 'consistency',
      description: 'Run at least 4 days per week',
      targetDate: null,
    },
  ],
  createdAt: '2026-01-15T09:00:00Z',
}

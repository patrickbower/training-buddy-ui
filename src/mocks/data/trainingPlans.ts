import type { TrainingPlan } from '@/types/domain'

export const seedTrainingPlan: TrainingPlan = {
  id: 'plan_01',
  athleteId: 'ath_01',
  name: '12-Week Marathon Build',
  description:
    'A progressive plan targeting a sub-4 hour marathon. Builds weekly mileage safely with a mix of easy runs, tempo work, and long runs.',
  startDate: '2026-04-01',
  endDate: '2026-06-23',
  status: 'active',
  createdAt: '2026-03-25T10:00:00Z',
  sessions: [
    {
      id: 'sess_01',
      planId: 'plan_01',
      date: '2026-04-01',
      type: 'easy',
      targetDistanceKm: 8,
      targetPacePerKm: '5:45',
      notes: 'Conversational pace. Focus on keeping heart rate below 145bpm.',
      completedRunId: null,
    },
    {
      id: 'sess_02',
      planId: 'plan_01',
      date: '2026-04-03',
      type: 'tempo',
      targetDistanceKm: 6,
      targetPacePerKm: '5:00',
      notes: '2km easy warm-up, 4km at tempo pace, 1km cool-down.',
      completedRunId: null,
    },
    {
      id: 'sess_03',
      planId: 'plan_01',
      date: '2026-04-05',
      type: 'long',
      targetDistanceKm: 16,
      targetPacePerKm: '6:00',
      notes: 'Easy effort throughout. Fuelling practice: take a gel at 10km.',
      completedRunId: null,
    },
    {
      id: 'sess_04',
      planId: 'plan_01',
      date: '2026-04-07',
      type: 'rest',
      targetDistanceKm: null,
      targetPacePerKm: null,
      notes: 'Full rest or gentle 20min walk. Let your body recover.',
      completedRunId: null,
    },
  ],
}

export const seedTrainingPlans: TrainingPlan[] = [seedTrainingPlan]

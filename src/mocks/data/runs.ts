import type { Run } from '@/types/domain'

export const seedRuns: Run[] = [
  {
    id: 'run_01',
    athleteId: 'ath_01',
    sessionId: 'sess_01',
    date: '2026-03-24',
    distanceKm: 8.2,
    durationSeconds: 2706, // ~45 min
    averagePacePerKm: '5:30',
    averageHeartRate: 148,
    maxHeartRate: 162,
    elevationGainM: 45,
    perceivedEffort: 3,
    stravaActivityId: null,
    createdAt: '2026-03-24T07:30:00Z',
  },
  {
    id: 'run_02',
    athleteId: 'ath_01',
    sessionId: 'sess_03',
    date: '2026-03-22',
    distanceKm: 14.5,
    durationSeconds: 5220, // ~87 min
    averagePacePerKm: '6:00',
    averageHeartRate: 142,
    maxHeartRate: 158,
    elevationGainM: 120,
    perceivedEffort: 4,
    stravaActivityId: '9876543210',
    createdAt: '2026-03-22T08:00:00Z',
  },
  {
    id: 'run_03',
    athleteId: 'ath_01',
    sessionId: null,
    date: '2026-03-20',
    distanceKm: 5.0,
    durationSeconds: 1500, // 25 min
    averagePacePerKm: '5:00',
    averageHeartRate: 155,
    maxHeartRate: 172,
    elevationGainM: 10,
    perceivedEffort: 5,
    stravaActivityId: null,
    createdAt: '2026-03-20T18:00:00Z',
  },
]

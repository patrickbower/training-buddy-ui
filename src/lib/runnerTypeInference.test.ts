import { describe, it, expect } from 'vitest'
import { runnerTypeInference } from './runnerTypeInference'
import type { StravaActivity } from '@/types/domain'

function makeActivity(overrides: Partial<StravaActivity> = {}): StravaActivity {
  return {
    id: Math.random().toString(),
    date: '2026-01-01',
    distanceKm: 8,
    durationSeconds: 2640,
    pacePerKm: '5:30',
    ...overrides,
  }
}

function makeActivities(count: number, overrides: Partial<StravaActivity> = {}): StravaActivity[] {
  return Array.from({ length: count }, () => makeActivity(overrides))
}

describe('runnerTypeInference', () => {
  it('returns minimal_data with low confidence when fewer than 10 activities', () => {
    const result = runnerTypeInference(makeActivities(5))
    expect(result.type).toBe('minimal_data')
    expect(result.confidence).toBe('low')
  })

  it('returns beginner_runner when activity count is low and avg pace is slow', () => {
    const activities = makeActivities(12, { distanceKm: 5, pacePerKm: '7:00' })
    const result = runnerTypeInference(activities)
    expect(result.type).toBe('beginner_runner')
  })

  it('returns intermediate_marathoner when consistent volume and longest run > 30km', () => {
    const activities = makeActivities(24, { distanceKm: 12 })
    activities[0] = makeActivity({ distanceKm: 32 })
    const result = runnerTypeInference(activities)
    expect(result.type).toBe('intermediate_marathoner')
  })

  it('returns experienced_ultra when longest run > 42km', () => {
    const activities = makeActivities(30, { distanceKm: 15 })
    activities[0] = makeActivity({ distanceKm: 45 })
    const result = runnerTypeInference(activities)
    expect(result.type).toBe('experienced_ultra')
  })

  it('returns speed_focused when avg distance is short and pace is fast', () => {
    const activities = makeActivities(20, { distanceKm: 5, pacePerKm: '4:00' })
    const result = runnerTypeInference(activities)
    expect(result.type).toBe('speed_focused')
  })

  it('returns inconsistent_runner when weekly volume has high variance', () => {
    // Alternate active weeks (60km) and rest weeks (0km) — 18 runs over 12 weeks
    const activities: StravaActivity[] = []
    const baseDate = new Date('2026-01-05') // Monday
    for (let week = 0; week < 12; week++) {
      if (week % 2 === 0) {
        for (let day = 0; day < 3; day++) {
          const d = new Date(baseDate)
          d.setDate(d.getDate() + week * 7 + day)
          activities.push(makeActivity({ distanceKm: 20, date: d.toISOString().slice(0, 10) }))
        }
      }
    }
    const result = runnerTypeInference(activities)
    expect(result.type).toBe('inconsistent_runner')
  })

  it('returns comeback_runner when there is a gap > 8 weeks followed by resumed activity', () => {
    const activities: StravaActivity[] = [
      // Before-gap runs
      makeActivity({ date: '2026-01-01', distanceKm: 10 }),
      makeActivity({ date: '2026-01-08', distanceKm: 10 }),
      makeActivity({ date: '2026-01-15', distanceKm: 10 }),
      makeActivity({ date: '2026-01-22', distanceKm: 10 }),
      makeActivity({ date: '2026-01-29', distanceKm: 10 }),
      makeActivity({ date: '2026-02-05', distanceKm: 10 }),
      // After-gap runs (62 days after Feb 05 = Apr 08)
      makeActivity({ date: '2026-04-08', distanceKm: 8 }),
      makeActivity({ date: '2026-04-15', distanceKm: 8 }),
      makeActivity({ date: '2026-04-22', distanceKm: 8 }),
      makeActivity({ date: '2026-04-29', distanceKm: 8 }),
    ]
    const result = runnerTypeInference(activities)
    expect(result.type).toBe('comeback_runner')
  })

  it('returns high confidence when 2 or more signals align', () => {
    // experienced_ultra: longest run > 42km + high volume
    const activities = makeActivities(30, { distanceKm: 15 })
    activities[0] = makeActivity({ distanceKm: 45 })
    const result = runnerTypeInference(activities)
    expect(result.confidence).toBe('high')
  })

  it('returns low confidence for minimal_data regardless of other signals', () => {
    const result = runnerTypeInference(makeActivities(3, { distanceKm: 45 }))
    expect(result.type).toBe('minimal_data')
    expect(result.confidence).toBe('low')
  })
})

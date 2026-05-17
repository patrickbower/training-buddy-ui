import type { RunnerType, StravaActivity } from '@/types/domain'

export interface InferenceResult {
  type: RunnerType
  confidence: 'high' | 'low'
}

function parsePaceToSeconds(pace: string): number {
  const [min = 0, sec = 0] = pace.split(':').map(Number)
  return min * 60 + sec
}

function weekKey(date: Date): string {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - d.getDay())
  return d.toISOString().slice(0, 10)
}

function stdDev(values: number[]): number {
  if (values.length === 0) return 0
  const mean = values.reduce((a, b) => a + b, 0) / values.length
  const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length
  return Math.sqrt(variance)
}

export function runnerTypeInference(activities: StravaActivity[]): InferenceResult {
  if (activities.length < 10) {
    return { type: 'minimal_data', confidence: 'low' }
  }

  const sorted = [...activities].sort((a, b) => a.date.localeCompare(b.date))

  const longestRunKm = Math.max(...activities.map((a) => a.distanceKm))
  const avgDistanceKm = activities.reduce((s, a) => s + a.distanceKm, 0) / activities.length
  const avgPaceSeconds =
    activities.reduce((s, a) => s + parsePaceToSeconds(a.pacePerKm), 0) / activities.length

  // Weekly volume for variance — include all weeks in range, even zero-volume ones
  const firstWeekStart = new Date(sorted[0].date)
  firstWeekStart.setDate(firstWeekStart.getDate() - firstWeekStart.getDay())
  const lastDate = new Date(sorted[sorted.length - 1].date)

  const weeklyKm = new Map<string, number>()
  const cursor = new Date(firstWeekStart)
  while (cursor <= lastDate) {
    weeklyKm.set(cursor.toISOString().slice(0, 10), 0)
    cursor.setDate(cursor.getDate() + 7)
  }
  for (const a of activities) {
    const key = weekKey(new Date(a.date))
    weeklyKm.set(key, (weeklyKm.get(key) ?? 0) + a.distanceKm)
  }
  const weeklyVolumes = [...weeklyKm.values()]
  const volumeStdDev = stdDev(weeklyVolumes)
  const volumeMean = weeklyVolumes.reduce((a, b) => a + b, 0) / weeklyVolumes.length

  // Gap detection: find largest gap between consecutive runs
  let maxGapDays = 0
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1].date).getTime()
    const curr = new Date(sorted[i].date).getTime()
    const gapDays = (curr - prev) / (1000 * 60 * 60 * 24)
    if (gapDays > maxGapDays) maxGapDays = gapDays
  }
  const hasLongGap = maxGapDays > 56 // 8 weeks

  // Signal detection
  const signals = {
    ultraLong: longestRunKm > 42,
    highVolume: avgDistanceKm > 12,
    marathonLong: longestRunKm > 30,
    consistentVolume: volumeStdDev / (volumeMean || 1) < 0.5,
    slowPace: avgPaceSeconds > 6 * 60 + 30, // > 6:30/km
    lowCount: activities.length < 20,
    shortAvgDistance: avgDistanceKm < 8,
    fastPace: avgPaceSeconds < 5 * 60, // < 5:00/km
    highVariance: volumeStdDev / (volumeMean || 1) > 0.8,
    comeback: hasLongGap,
  }

  // Classification in priority order
  if (signals.ultraLong) {
    const signalCount = [signals.ultraLong, signals.highVolume].filter(Boolean).length
    return { type: 'experienced_ultra', confidence: signalCount >= 2 ? 'high' : 'low' }
  }

  if (signals.comeback) {
    return { type: 'comeback_runner', confidence: 'low' }
  }

  if (signals.marathonLong && signals.consistentVolume) {
    return { type: 'intermediate_marathoner', confidence: 'high' }
  }

  if (signals.shortAvgDistance && signals.fastPace) {
    const signalCount = [signals.shortAvgDistance, signals.fastPace].filter(Boolean).length
    return { type: 'speed_focused', confidence: signalCount >= 2 ? 'high' : 'low' }
  }

  if (signals.highVariance) {
    return { type: 'inconsistent_runner', confidence: 'low' }
  }

  if (signals.slowPace && signals.lowCount) {
    const signalCount = [signals.slowPace, signals.lowCount].filter(Boolean).length
    return { type: 'beginner_runner', confidence: signalCount >= 2 ? 'high' : 'low' }
  }

  return { type: 'minimal_data', confidence: 'low' }
}

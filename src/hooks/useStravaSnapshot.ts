import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { queryKeys } from '@/lib/queryKeys'
import type { StravaSnapshot } from '@/types/domain'

export interface UseStravaSnapshotResult {
  snapshot: StravaSnapshot | undefined
  isLoading: boolean
  isError: boolean
}

export function useStravaSnapshot(): UseStravaSnapshotResult {
  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.stravaSnapshot(),
    queryFn: api.strava.snapshot,
  })

  return { snapshot: data, isLoading, isError }
}

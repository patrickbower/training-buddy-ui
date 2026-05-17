import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { queryKeys } from '@/lib/queryKeys'
import type { Athlete } from '@/types/domain'

interface UseAthleteResult {
  athlete: Athlete | undefined
  isLoading: boolean
  isError: boolean
}

export function useAthlete(): UseAthleteResult {
  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.athlete(),
    queryFn: api.athlete.get,
  })
  return { athlete: data, isLoading, isError }
}

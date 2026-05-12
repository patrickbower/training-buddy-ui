import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Athlete, AthleteProfile } from '@/types/domain'

export const TOTAL_STEPS = 8
const SKIPPABLE_STEPS = new Set([3, 7])

export type OnboardingAnswers = Partial<Record<number, string>>

export interface UseOnboardingResult {
  step: number
  answers: OnboardingAnswers
  next: (answer: string) => void
  back: () => void
  skip: () => void
  confirm: () => void
  isSubmitting: boolean
  isComplete: boolean
  completedAthlete: Athlete | undefined
}

function answersToProfile(answers: OnboardingAnswers): Omit<AthleteProfile, 'updatedAt'> {
  return {
    runnerType: (answers[1] ?? 'minimal_data') as AthleteProfile['runnerType'],
    primaryGoal: answers[2] ?? '',
    goalTimeline: answers[3] ?? null,
    weeklyAvailabilityDays: Number(answers[4]) || 3,
    currentInjuries: answers[5] ?? null,
    coachingStyle: (answers[6] ?? 'balanced') as AthleteProfile['coachingStyle'],
    additionalContext: answers[7] ?? null,
  }
}

export function useOnboarding(): UseOnboardingResult {
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState<OnboardingAnswers>({})

  const partialSave = useMutation({
    mutationFn: (partial: Partial<Omit<AthleteProfile, 'updatedAt'>>) =>
      api.athlete.updateProfile(partial),
  })

  const submitProfile = useMutation({
    mutationFn: (profile: Omit<AthleteProfile, 'updatedAt'>) => api.athlete.createProfile(profile),
    onSuccess: () => {
      setStep(TOTAL_STEPS + 1) // signals completion
    },
  })

  const advance = (newAnswers: OnboardingAnswers) => {
    const next = step + 1
    if (next <= TOTAL_STEPS) {
      setStep(next)
    }
    return newAnswers
  }

  const next = (answer: string) => {
    const newAnswers = { ...answers, [step]: answer }
    setAnswers(newAnswers)
    advance(newAnswers)
    // Partial save after each step
    partialSave.mutate(answersToProfile(newAnswers))
  }

  const back = () => {
    if (step > 1) setStep(step - 1)
  }

  const skip = () => {
    if (SKIPPABLE_STEPS.has(step)) {
      advance(answers)
    }
  }

  const confirm = () => {
    submitProfile.mutate(answersToProfile(answers))
  }

  return {
    step,
    answers,
    next,
    back,
    skip,
    confirm,
    isSubmitting: submitProfile.isPending,
    isComplete: submitProfile.isSuccess,
    completedAthlete: submitProfile.data,
  }
}

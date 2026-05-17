import { useState } from 'react'
import { useNavigate, useRouterState } from '@tanstack/react-router'
import { Button, ErrorMessage, InputOTP, REGEXP_ONLY_DIGITS } from '@heroui/react'
import { useAuthStore } from '@/stores/authStore'
import { StravaLogo } from '@/components/shared/StravaLogo'

export function VerifyPage() {
  const navigate = useNavigate()
  const email = useRouterState({
    select: (s) => (s.location.state as { email?: string } | undefined)?.email ?? '',
  })

  const login = useAuthStore((s) => s.login)

  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resent, setResent] = useState(false)

  const handleComplete = async (value: string) => {
    setError(null)
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: value, email }),
      })

      if (!res.ok) {
        const data = (await res.json()) as { error?: string }
        setError(data.error ?? 'Something went wrong. Please try again.')
        setCode('')
        return
      }

      login(email)
      const { onboardingCompletedAt } = useAuthStore.getState()
      await navigate({ to: onboardingCompletedAt ? '/' : '/onboarding' })
    } catch {
      setError('Something went wrong. Please try again.')
      setCode('')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResend = () => {
    setResent(true)
    setError(null)
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <h2 className="text-base font-medium text-zinc-900">Verify email</h2>
        <p className="text-sm text-zinc-500">We&apos;ve sent a code to {email || 'your email'}</p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex self-center py-2">
          <InputOTP
            autoFocus
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS}
            variant="primary"
            value={code}
            isInvalid={!!error}
            isDisabled={isSubmitting}
            onChange={(val) => {
              setCode(val)
              setError(null)
            }}
            onComplete={(val: string) => void handleComplete(val)}
          >
            <InputOTP.Group>
              <InputOTP.Slot index={0} />
              <InputOTP.Slot index={1} />
              <InputOTP.Slot index={2} />
            </InputOTP.Group>
            <InputOTP.Separator />
            <InputOTP.Group>
              <InputOTP.Slot index={3} />
              <InputOTP.Slot index={4} />
              <InputOTP.Slot index={5} />
            </InputOTP.Group>
          </InputOTP>
        </div>
        {error && <ErrorMessage>{error}</ErrorMessage>}

        <div className="flex items-center gap-1 text-sm">
          <span className="text-zinc-500">Didn&apos;t receive a code?</span>
          {resent ? (
            <span className="font-medium text-zinc-900">Code resent</span>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onPress={handleResend}
              className="h-auto min-h-0 p-0 font-medium text-zinc-900 underline"
            >
              Resend
            </Button>
          )}
        </div>
      </div>

      <Button
        className="w-full rounded-full bg-[#fc4c02] text-sm font-medium text-white"
        isDisabled={code.length !== 6 || isSubmitting}
        isPending={isSubmitting}
        onPress={() => void handleComplete(code)}
      >
        Connect Strava
      </Button>

      <div className="flex items-start gap-3 pt-1">
        <StravaLogo />
        <p className="text-xs text-zinc-500">
          Training Buddy connects to Strava. We&apos;ll never see or store your login details.
        </p>
      </div>
    </div>
  )
}

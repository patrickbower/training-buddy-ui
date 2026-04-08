import { useState } from 'react'
import { useNavigate, useRouterState } from '@tanstack/react-router'
import { Avatar, Button, ErrorMessage, InputOTP, REGEXP_ONLY_DIGITS } from '@heroui/react'
import { Person } from '@gravity-ui/icons'
import { useAuthStore } from '@/stores/authStore'

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
      await navigate({ to: '/plan' })
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
    <div className="w-full max-w-xs rounded-3xl bg-white/80 p-6 shadow-xl backdrop-blur-xl">
      {/* Header */}
      <div className="mb-3 flex flex-col gap-3">
        <Avatar size="sm">
          <Avatar.Fallback>
            <Person className="size-4" />
          </Avatar.Fallback>
        </Avatar>
        <h2 className="text-base font-medium text-zinc-900">Verify email</h2>
      </div>

      {/* Body */}
      <div className="mb-5 flex flex-col gap-3">
        <p className="text-sm text-zinc-500">We&apos;ve sent a code to {email || 'your email'}</p>

        <InputOTP
          autoFocus
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS}
          variant="secondary"
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

      {/* Footer */}
      <Button
        className="w-full rounded-full bg-[#fc4c02] text-sm font-medium text-white"
        isDisabled={code.length !== 6 || isSubmitting}
        isPending={isSubmitting}
        onPress={() => void handleComplete(code)}
      >
        Login using Strava
      </Button>
    </div>
  )
}

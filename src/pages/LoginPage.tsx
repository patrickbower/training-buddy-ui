import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Button, FieldError, Form, Input, Label, TextField } from '@heroui/react'
import { StravaLogo } from '@/components/shared/StravaLogo'

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        const data = (await res.json()) as { error?: string }
        setError(data.error ?? 'Something went wrong. Please try again.')
        return
      }

      await navigate({ to: '/verify', state: { email } })
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <h2 className="text-base font-medium text-zinc-900">Welcome</h2>
        <p className="text-sm text-zinc-500 pb-3">
          Enter your Training Buddy waitlist email, then connect Strava to sync your activities.
        </p>
      </div>

      <Form id="login-form" onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-3">
        <TextField isInvalid={!!error} className="flex flex-col gap-3">
          <Label className="text-sm font-medium text-zinc-900">
            Your Training Buddy Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setError(null)
            }}
            fullWidth
            variant="secondary"
          />
          {error && <FieldError>{error}</FieldError>}
        </TextField>
      </Form>

      <Button
        type="submit"
        form="login-form"
        className="w-full rounded-full text-sm font-medium text-white bg-zinc-950"
        isDisabled={!isValidEmail(email) || isSubmitting}
        isPending={isSubmitting}
      >
        Verify email
      </Button>

      <div className="flex gap-5 pt-1">
        <StravaLogo />
        <p className="text-xs text-zinc-500">
          Training Buddy connects to Strava. We&apos;ll never see or store your login details.
        </p>
      </div>
    </div>
  )
}

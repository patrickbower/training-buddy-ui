import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Avatar, Button, FieldError, Form, Input, Label, TextField } from '@heroui/react'
import { Person } from '@gravity-ui/icons'

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
    <div className="w-full max-w-sm rounded-3xl bg-white/80 p-6 shadow-xl backdrop-blur-xl">
      {/* Header */}
      <div className="mb-3 flex flex-col gap-3">
        <Avatar size="sm">
          <Avatar.Fallback>
            <Person className="size-4" />
          </Avatar.Fallback>
        </Avatar>
        <h2 className="text-base font-medium text-zinc-900">Login</h2>
      </div>

      {/* Body */}
      <Form
        id="login-form"
        onSubmit={(e) => void handleSubmit(e)}
        className="mb-5 flex flex-col gap-6"
      >
        <p className="text-sm text-zinc-500">Enter email you signed up with</p>

        <TextField isInvalid={!!error} className="flex flex-col gap-3">
          <Label className="text-sm font-medium text-zinc-900">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setError(null)
            }}
            fullWidth
            variant="primary"
          />
          {error && <FieldError>{error}</FieldError>}
        </TextField>
      </Form>

      {/* Footer */}
      <Button
        type="submit"
        form="login-form"
        className="w-full rounded-full bg-[#fc4c02] text-sm font-medium text-white"
        isDisabled={!isValidEmail(email) || isSubmitting}
        isPending={isSubmitting}
      >
        Login using Strava
      </Button>
    </div>
  )
}

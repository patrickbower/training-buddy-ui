import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from './authStore'

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ isAuthenticated: false, email: null })
  })

  it('starts unauthenticated with no email', () => {
    const { isAuthenticated, email } = useAuthStore.getState()
    expect(isAuthenticated).toBe(false)
    expect(email).toBeNull()
  })

  it('login sets isAuthenticated and stores the email', () => {
    useAuthStore.getState().login('athlete@test.com')
    const { isAuthenticated, email } = useAuthStore.getState()
    expect(isAuthenticated).toBe(true)
    expect(email).toBe('athlete@test.com')
  })

  it('logout resets isAuthenticated and clears the email', () => {
    useAuthStore.getState().login('athlete@test.com')
    useAuthStore.getState().logout()
    const { isAuthenticated, email } = useAuthStore.getState()
    expect(isAuthenticated).toBe(false)
    expect(email).toBeNull()
  })
})

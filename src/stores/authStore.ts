import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { toast } from '@/lib/toast'

interface AuthState {
  isAuthenticated: boolean
  email: string | null
  onboardingCompletedAt: string | null
  login: (email: string) => void
  logout: () => void
  completeOnboarding: (completedAt: string) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      email: null,
      onboardingCompletedAt: null,
      login: (email) => {
        set({ isAuthenticated: true, email })
      },
      logout: () => {
        set({ isAuthenticated: false, email: null, onboardingCompletedAt: null })
        toast.info("You've been signed out")
      },
      completeOnboarding: (completedAt) => {
        set({ onboardingCompletedAt: completedAt })
      },
    }),
    { name: 'auth' },
  ),
)

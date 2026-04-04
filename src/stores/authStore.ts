import { create } from 'zustand'

interface AuthState {
  isAuthenticated: boolean
  email: string | null
  login: (email: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  email: null,
  login: (email) => { set({ isAuthenticated: true, email }); },
  logout: () => { set({ isAuthenticated: false, email: null }); },
}))

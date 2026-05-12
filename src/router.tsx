import {
  createRouter,
  createRootRoute,
  createRoute,
  redirect,
  Outlet,
} from '@tanstack/react-router'
import { AppShell } from '@/components/shared/AppShell'
import { AuthLayout } from '@/components/shared/AuthLayout'
import { ChatPage } from '@/pages/ChatPage'
import { PlanPage } from '@/pages/PlanPage'
import { OnboardingPage } from '@/pages/OnboardingPage'
import { LoginPage } from '@/pages/LoginPage'
import { VerifyPage } from '@/pages/VerifyPage'
import { useAuthStore } from '@/stores/authStore'

// Single root — renders nothing but a passthrough outlet
const rootRoute = createRootRoute({
  component: Outlet,
})

// Authenticated layout — wraps app pages with AppShell chrome
const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'app',
  component: AppShell,
  beforeLoad: () => {
    const { isAuthenticated, onboardingCompletedAt } = useAuthStore.getState()
    if (!isAuthenticated) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({ to: '/login' })
    }
    if (onboardingCompletedAt === null) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({ to: '/onboarding' })
    }
  },
})

const indexRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/',
  beforeLoad: () => {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw redirect({ to: '/chat/$conversationId', params: { conversationId: 'conv_01' } })
  },
})

export const chatRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/chat/$conversationId',
  component: ChatPage,
})

// /plan stays in the router to avoid broken links — removed from sidebar nav
const planRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/plan',
  component: PlanPage,
})

// Onboarding — outside AppShell, no sidebar chrome
const onboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/onboarding',
  component: OnboardingPage,
  beforeLoad: () => {
    if (!useAuthStore.getState().isAuthenticated) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({ to: '/login' })
    }
  },
})

// Unauthenticated layout — no AppShell, redirects away if already logged in
const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'auth',
  component: AuthLayout,
  beforeLoad: () => {
    if (useAuthStore.getState().isAuthenticated) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({ to: '/' })
    }
  },
})

const loginRoute = createRoute({
  getParentRoute: () => authRoute,
  path: '/login',
  component: LoginPage,
})

const verifyRoute = createRoute({
  getParentRoute: () => authRoute,
  path: '/verify',
  component: VerifyPage,
})

const routeTree = rootRoute.addChildren([
  appRoute.addChildren([indexRoute, chatRoute, planRoute]),
  onboardingRoute,
  authRoute.addChildren([loginRoute, verifyRoute]),
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }

  interface HistoryState {
    email?: string
  }
}

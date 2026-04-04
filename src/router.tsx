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
    if (!useAuthStore.getState().isAuthenticated) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({ to: '/login' })
    }
  },
})

const indexRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/',
  beforeLoad: () => {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw redirect({ to: '/plan' })
  },
})

export const chatRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/chat/$conversationId',
  component: ChatPage,
})

const planRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/plan',
  component: PlanPage,
})

// Unauthenticated layout — no AppShell, redirects away if already logged in
const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'auth',
  component: AuthLayout,
  beforeLoad: () => {
    if (useAuthStore.getState().isAuthenticated) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({ to: '/plan' })
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

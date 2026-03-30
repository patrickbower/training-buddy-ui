import { createRouter, createRootRoute, createRoute, redirect } from '@tanstack/react-router'
import { AppShell } from '@/components/shared/AppShell'
import { ChatPage } from '@/pages/ChatPage'
import { PlanPage } from '@/pages/PlanPage'

const rootRoute = createRootRoute({
  component: AppShell,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw redirect({ to: '/plan' })
  },
})

export const chatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/chat/$conversationId',
  component: ChatPage,
})

const planRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/plan',
  component: PlanPage,
})

const routeTree = rootRoute.addChildren([indexRoute, chatRoute, planRoute])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

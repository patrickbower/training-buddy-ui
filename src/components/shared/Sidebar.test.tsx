import { describe, it, expect, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import {
  createMemoryHistory,
  createRouter,
  createRoute,
  createRootRoute,
  RouterProvider,
} from '@tanstack/react-router'
import { render } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Sidebar } from './Sidebar'
import { useAuthStore } from '@/stores/authStore'
import { queryKeys } from '@/lib/queryKeys'
import type { Conversation } from '@/types/domain'

const coachingConversation: Conversation = {
  id: 'conv_02',
  athleteId: 'ath_01',
  messages: [
    {
      id: 'msg_01',
      conversationId: 'conv_02',
      role: 'coach',
      content: "You're targeting a sub-4hr marathon — let's build your plan.",
      quickReplies: ['My weekly schedule', 'Race-day prep'],
      onboardingStep: null,
      card: null,
      createdAt: '2026-05-18T10:00:00Z',
    },
  ],
  createdAt: '2026-05-18T10:00:00Z',
  updatedAt: '2026-05-18T10:00:00Z',
}

interface RenderOptions {
  path?: string
  conversation?: Conversation
}

function renderSidebar({ path = '/chat/conv_01', conversation }: RenderOptions = {}) {
  const rootRoute = createRootRoute()
  const sidebarRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '$',
    component: Sidebar,
  })
  const router = createRouter({
    routeTree: rootRoute.addChildren([sidebarRoute]),
    history: createMemoryHistory({ initialEntries: [path] }),
  })
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  if (conversation) {
    queryClient.setQueryData(queryKeys.conversation(), conversation)
  }
  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
}

describe('Sidebar', () => {
  beforeEach(() => {
    useAuthStore.setState({ isAuthenticated: false, email: null, onboardingCompletedAt: null })
  })

  it('does not render a Plan nav item', async () => {
    const { container } = renderSidebar()
    await screen.findByText(/new/i)
    expect(container.querySelector('[href="/plan"]')).toBeNull()
    expect(screen.queryByText('Plan')).toBeNull()
  })

  it('renders a New chat button', async () => {
    renderSidebar()
    const newButton = await screen.findByRole('button', { name: /new/i })
    expect(newButton).toBeDefined()
  })

  it('shows no conversations before onboarding is complete', async () => {
    renderSidebar({ path: '/chat/conv_02' })
    await screen.findByRole('button', { name: /new/i })
    expect(screen.queryByRole('option')).toBeNull()
  })

  it('shows the conversation after onboarding is complete', async () => {
    useAuthStore.setState({ onboardingCompletedAt: '2026-05-18T10:00:00Z' })
    renderSidebar({ path: '/chat/conv_02', conversation: coachingConversation })
    expect(await screen.findByRole('option')).toBeInTheDocument()
  })

  it('marks the active conversation as selected when path matches', async () => {
    useAuthStore.setState({ onboardingCompletedAt: '2026-05-18T10:00:00Z' })
    renderSidebar({ path: '/chat/conv_02', conversation: coachingConversation })
    expect(await screen.findByRole('option', { selected: true })).toBeInTheDocument()
  })

  it('does not mark the conversation as selected on a different route', async () => {
    useAuthStore.setState({ onboardingCompletedAt: '2026-05-18T10:00:00Z' })
    renderSidebar({ path: '/plan', conversation: coachingConversation })
    await screen.findByRole('option')
    expect(screen.queryByRole('option', { selected: true })).toBeNull()
  })
})

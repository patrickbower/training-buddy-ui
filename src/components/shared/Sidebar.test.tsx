import { describe, it, expect } from 'vitest'
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

function renderSidebar(initialPath = '/chat/conv_01') {
  const rootRoute = createRootRoute()
  const sidebarRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '$',
    component: Sidebar,
  })
  const router = createRouter({
    routeTree: rootRoute.addChildren([sidebarRoute]),
    history: createMemoryHistory({ initialEntries: [initialPath] }),
  })
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
}

describe('Sidebar', () => {
  it('does not render a Plan nav item', async () => {
    const { container } = renderSidebar()
    // Wait for sidebar to mount, then verify Plan text is absent
    await screen.findByText(/chat/i)
    expect(container.querySelector('[href="/plan"]')).toBeNull()
    expect(screen.queryByText('Plan')).toBeNull()
  })

  it('renders a Chat nav item', async () => {
    renderSidebar()
    const chatButton = await screen.findByRole('button', { name: /chat/i })
    expect(chatButton).toBeDefined()
  })
})

import { describe, it, expect } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  createMemoryHistory,
  createRouter,
  createRoute,
  createRootRoute,
  RouterProvider,
} from '@tanstack/react-router'
import { render } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { OnboardingPage } from './OnboardingPage'

function renderOnboardingPage() {
  const rootRoute = createRootRoute()
  const route = createRoute({
    getParentRoute: () => rootRoute,
    path: '/onboarding',
    component: OnboardingPage,
  })
  const onboardingChatRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/onboarding/chat',
    component: () => <div>Onboarding chat page</div>,
  })
  const router = createRouter({
    routeTree: rootRoute.addChildren([route, onboardingChatRoute]),
    history: createMemoryHistory({ initialEntries: ['/onboarding'] }),
  })
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
}

describe('OnboardingPage — welcome screen', () => {
  it('renders three metric cards once data loads', async () => {
    renderOnboardingPage()
    await waitFor(() => {
      expect(screen.getByText('Total Runs')).toBeInTheDocument()
      expect(screen.getByText('Avg Weekly')).toBeInTheDocument()
      expect(screen.getByText('Longest Run')).toBeInTheDocument()
    })
  })

  it('shows the data window label on each card', async () => {
    renderOnboardingPage()
    await waitFor(() => {
      const labels = screen.getAllByText('Last 6 months')
      expect(labels.length).toBeGreaterThanOrEqual(1)
    })
  })

  it("renders a Let's Go CTA button", async () => {
    renderOnboardingPage()
    const cta = await screen.findByRole('button', { name: /let's go/i })
    expect(cta).toBeInTheDocument()
  })

  it("clicking Let's Go navigates to /onboarding/chat", async () => {
    const user = userEvent.setup()
    renderOnboardingPage()

    await user.click(await screen.findByRole('button', { name: /let's go/i }))

    expect(await screen.findByText('Onboarding chat page')).toBeInTheDocument()
  })
})

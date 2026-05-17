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
import { LoginPage } from './LoginPage'

function renderLoginPage() {
  const rootRoute = createRootRoute()
  const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/login',
    component: LoginPage,
  })
  const verifyRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/verify',
    component: () => <div>Verify page</div>,
  })
  const router = createRouter({
    routeTree: rootRoute.addChildren([loginRoute, verifyRoute]),
    history: createMemoryHistory({ initialEntries: ['/login'] }),
  })
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
}

describe('LoginPage', () => {
  it('submit button is disabled when email is empty', async () => {
    renderLoginPage()
    const button = await screen.findByRole('button', { name: /connect strava/i })
    expect(button).toBeDisabled()
  })

  it('submit button is disabled when email format is invalid', async () => {
    const user = userEvent.setup()
    renderLoginPage()
    const input = await screen.findByRole('textbox')
    await user.type(input, 'notanemail')
    expect(screen.getByRole('button', { name: /connect strava/i })).toBeDisabled()
  })

  it('submit button is enabled when a valid email is entered', async () => {
    const user = userEvent.setup()
    renderLoginPage()
    const input = await screen.findByRole('textbox')
    await user.type(input, 'athlete@test.com')
    expect(screen.getByRole('button', { name: /connect strava/i })).not.toBeDisabled()
  })

  it('shows an error message when the API returns 400', async () => {
    const user = userEvent.setup()
    renderLoginPage()
    const input = await screen.findByRole('textbox')
    await user.type(input, 'fail@test.com')
    await user.click(screen.getByRole('button', { name: /connect strava/i }))
    await waitFor(() => {
      expect(screen.getByText('User not found')).toBeInTheDocument()
    })
  })
})

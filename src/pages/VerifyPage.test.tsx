import { describe, it, expect, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  createMemoryHistory,
  createRouter,
  createRoute,
  createRootRoute,
  RouterProvider,
} from '@tanstack/react-router'
import { render, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { VerifyPage } from './VerifyPage'
import { useAuthStore } from '@/stores/authStore'

async function renderVerifyPage(email = 'athlete@test.com') {
  const rootRoute = createRootRoute()
  const verifyRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/verify',
    component: VerifyPage,
  })
  const planRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/plan',
    component: () => <div>Plan page</div>,
  })
  const history = createMemoryHistory({ initialEntries: ['/verify'] })
  const router = createRouter({
    routeTree: rootRoute.addChildren([verifyRoute, planRoute]),
    history,
  })

  // Seed the router state so VerifyPage can read the email
  await act(async () => {
    await router.navigate({ to: '/verify', state: { email } })
  })

  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
}

describe('VerifyPage', () => {
  beforeEach(() => {
    useAuthStore.setState({ isAuthenticated: false, email: null })
  })

  it('shows the email passed via router state', async () => {
    await renderVerifyPage('john@test.com')
    await screen.findByText(/john@test\.com/)
  })

  it('submit button is disabled until all 6 digits are entered', async () => {
    await renderVerifyPage()
    const button = await screen.findByRole('button', { name: /connect strava/i })
    expect(button).toBeDisabled()
  })

  it('shows an error message when the API returns 400', async () => {
    const user = userEvent.setup()
    await renderVerifyPage()
    await screen.findByRole('button', { name: /connect strava/i })

    // InputOTP renders a hidden input — interact via keyboard on the container
    const otpContainer = document.querySelector('.input-otp__container, [data-input-otp-container]')
    const otpInput = otpContainer
      ? otpContainer.querySelector('input')
      : document.querySelector('input[autocomplete]')

    if (otpInput) {
      await user.click(otpInput)
      await user.keyboard('000000')
    }

    await waitFor(() => {
      expect(screen.getByText('Invalid code')).toBeInTheDocument()
    })
  })

  it('shows "Code resent" confirmation when Resend is clicked', async () => {
    const user = userEvent.setup()
    await renderVerifyPage()
    const resend = await screen.findByRole('button', { name: /resend/i })
    await user.click(resend)
    expect(screen.getByText('Code resent')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /resend/i })).not.toBeInTheDocument()
  })
})

import { describe, it, expect, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
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
import { ProfileFooter } from './ProfileFooter'
import { seedAthlete } from '@/mocks/data/athlete'
import { useAuthStore } from '@/stores/authStore'

function renderProfileFooter() {
  const rootRoute = createRootRoute()
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => <ProfileFooter athlete={seedAthlete} />,
  })
  const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/login',
    component: () => <div>Login page</div>,
  })
  const router = createRouter({
    routeTree: rootRoute.addChildren([indexRoute, loginRoute]),
    history: createMemoryHistory({ initialEntries: ['/'] }),
  })
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
}

describe('ProfileFooter', () => {
  beforeEach(() => {
    useAuthStore.setState({ isAuthenticated: true, email: seedAthlete.email })
  })

  it('renders the profile button with the athlete email', async () => {
    renderProfileFooter()
    expect(await screen.findByText(seedAthlete.email)).toBeInTheDocument()
  })

  it('clicking the profile button shows the dropdown', async () => {
    const user = userEvent.setup()
    renderProfileFooter()

    await user.click(await screen.findByRole('button', { name: /profile menu/i }))

    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(screen.getByText('Logout')).toBeInTheDocument()
  })

  it('dropdown contains Settings, Profile, and Logout items', async () => {
    const user = userEvent.setup()
    renderProfileFooter()

    await user.click(await screen.findByRole('button', { name: /profile menu/i }))

    expect(screen.getByRole('menuitem', { name: /settings/i })).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: /^profile$/i })).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: /logout/i })).toBeInTheDocument()
  })

  it('Profile item appears between Settings and Logout', async () => {
    const user = userEvent.setup()
    renderProfileFooter()

    await user.click(await screen.findByRole('button', { name: /profile menu/i }))

    const items = screen.getAllByRole('menuitem')
    const names = items.map((el) => el.textContent.trim())
    const settingsIdx = names.findIndex((n) => /settings/i.test(n))
    const profileIdx = names.findIndex((n) => /^profile$/i.test(n))
    const logoutIdx = names.findIndex((n) => /logout/i.test(n))

    expect(settingsIdx).toBeLessThan(profileIdx)
    expect(profileIdx).toBeLessThan(logoutIdx)
  })

  it('clicking Profile opens the ProfileModal', async () => {
    const user = userEvent.setup()
    renderProfileFooter()

    await user.click(await screen.findByRole('button', { name: /profile menu/i }))
    await user.click(screen.getByRole('menuitem', { name: /^profile$/i }))

    expect(screen.queryByRole('menuitem', { name: /^profile$/i })).not.toBeInTheDocument()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText(/^profile$/i)).toBeInTheDocument()
  })

  it('clicking Logout clears auth state', async () => {
    const user = userEvent.setup()
    renderProfileFooter()

    await user.click(await screen.findByRole('button', { name: /profile menu/i }))
    await user.click(screen.getByRole('menuitem', { name: /logout/i }))

    expect(useAuthStore.getState().isAuthenticated).toBe(false)
    expect(useAuthStore.getState().email).toBeNull()
  })

  it('clicking Logout navigates to /login', async () => {
    const user = userEvent.setup()
    renderProfileFooter()

    await user.click(await screen.findByRole('button', { name: /profile menu/i }))
    await user.click(screen.getByRole('menuitem', { name: /logout/i }))

    expect(await screen.findByText('Login page')).toBeInTheDocument()
  })

  it('clicking Logout closes the dropdown', async () => {
    const user = userEvent.setup()
    renderProfileFooter()

    await user.click(await screen.findByRole('button', { name: /profile menu/i }))
    await user.click(screen.getByRole('menuitem', { name: /logout/i }))

    expect(screen.queryByRole('menuitem', { name: /logout/i })).not.toBeInTheDocument()
  })

  it('clicking Settings closes the dropdown and opens the Settings modal', async () => {
    const user = userEvent.setup()
    renderProfileFooter()

    await user.click(await screen.findByRole('button', { name: /profile menu/i }))
    await user.click(screen.getByRole('menuitem', { name: /settings/i }))

    expect(screen.queryByRole('menuitem', { name: /settings/i })).not.toBeInTheDocument()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('clicking outside the dropdown closes it', async () => {
    const user = userEvent.setup()
    renderProfileFooter()

    await user.click(await screen.findByRole('button', { name: /profile menu/i }))
    expect(screen.getByText('Settings')).toBeInTheDocument()

    await user.click(document.body)

    expect(screen.queryByText('Settings')).not.toBeInTheDocument()
  })
})

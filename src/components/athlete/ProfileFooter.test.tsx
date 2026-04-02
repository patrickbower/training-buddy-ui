import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/utils'
import { ProfileFooter } from './ProfileFooter'
import { seedAthlete } from '@/mocks/data/athlete'

describe('ProfileFooter', () => {
  it('renders the profile button with the athlete email', () => {
    renderWithProviders(<ProfileFooter athlete={seedAthlete} />)
    expect(screen.getByText(seedAthlete.email)).toBeInTheDocument()
  })

  it('clicking the profile button shows the dropdown', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ProfileFooter athlete={seedAthlete} />)

    await user.click(screen.getByRole('button', { name: /profile menu/i }))

    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(screen.getByText('Logout')).toBeInTheDocument()
  })

  it('dropdown contains Settings and Logout items', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ProfileFooter athlete={seedAthlete} />)

    await user.click(screen.getByRole('button', { name: /profile menu/i }))

    expect(screen.getByRole('menuitem', { name: /settings/i })).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: /logout/i })).toBeInTheDocument()
  })

  it('clicking Logout closes the dropdown', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ProfileFooter athlete={seedAthlete} />)

    await user.click(screen.getByRole('button', { name: /profile menu/i }))
    await user.click(screen.getByRole('menuitem', { name: /logout/i }))

    expect(screen.queryByRole('menuitem', { name: /logout/i })).not.toBeInTheDocument()
  })

  it('clicking Settings closes the dropdown', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ProfileFooter athlete={seedAthlete} />)

    await user.click(screen.getByRole('button', { name: /profile menu/i }))
    await user.click(screen.getByRole('menuitem', { name: /settings/i }))

    expect(screen.queryByRole('menuitem', { name: /settings/i })).not.toBeInTheDocument()
  })

  it('clicking Settings closes the dropdown and opens the Settings modal', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ProfileFooter athlete={seedAthlete} />)

    await user.click(screen.getByRole('button', { name: /profile menu/i }))
    await user.click(screen.getByRole('menuitem', { name: /settings/i }))

    expect(screen.queryByRole('menuitem', { name: /settings/i })).not.toBeInTheDocument()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('clicking outside the dropdown closes it', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ProfileFooter athlete={seedAthlete} />)

    await user.click(screen.getByRole('button', { name: /profile menu/i }))
    expect(screen.getByText('Settings')).toBeInTheDocument()

    await user.click(document.body)

    expect(screen.queryByText('Settings')).not.toBeInTheDocument()
  })
})

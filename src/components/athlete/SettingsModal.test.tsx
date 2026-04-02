import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/utils'
import { SettingsModal } from './SettingsModal'
import { seedAthlete } from '@/mocks/data/athlete'

describe('SettingsModal', () => {
  it('renders email and Strava when isOpen is true', () => {
    renderWithProviders(<SettingsModal isOpen={true} onClose={vi.fn()} athlete={seedAthlete} />)

    expect(screen.getByText(seedAthlete.email)).toBeInTheDocument()
    expect(screen.getByText(seedAthlete.stravaId)).toBeInTheDocument()
  })

  it('renders the Display preferences section', () => {
    renderWithProviders(<SettingsModal isOpen={true} onClose={vi.fn()} athlete={seedAthlete} />)

    expect(screen.getByText('Display preferences')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /strava/i })).toBeInTheDocument()
  })

  it('renders the Account access section', () => {
    renderWithProviders(<SettingsModal isOpen={true} onClose={vi.fn()} athlete={seedAthlete} />)

    expect(screen.getByText('Account access')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
  })

  it('clicking the Close footer button calls onClose', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    renderWithProviders(<SettingsModal isOpen={true} onClose={onClose} athlete={seedAthlete} />)

    // Footer button has visible text "Close"; the X trigger has aria-label="Close" with no text
    await user.click(screen.getByText('Close'))

    expect(onClose).toHaveBeenCalled()
  })

  it('clicking the X button calls onClose', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    renderWithProviders(<SettingsModal isOpen={true} onClose={onClose} athlete={seedAthlete} />)

    // X trigger has aria-label="Close"; getByLabelText finds it without matching the footer button
    await user.click(screen.getByLabelText('Close'))

    expect(onClose).toHaveBeenCalled()
  })

  it('does not render when isOpen is false', () => {
    renderWithProviders(<SettingsModal isOpen={false} onClose={vi.fn()} athlete={seedAthlete} />)

    expect(screen.queryByText('Settings')).not.toBeInTheDocument()
  })
})

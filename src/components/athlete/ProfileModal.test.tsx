import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/utils'
import { ProfileModal } from './ProfileModal'
import { seedAthlete, seedNewAthlete } from '@/mocks/data/athlete'

describe('ProfileModal — form state reset', () => {
  it('resets edited fields to athlete values when remounted on reopen', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    const { rerender } = renderWithProviders(
      <ProfileModal key={1} isOpen={true} onClose={onClose} athlete={seedAthlete} />,
    )

    // Edit the primary goal field
    const input = screen.getByPlaceholderText(/run a sub-4 hour marathon/i)
    await user.clear(input)
    await user.type(input, 'Run a 5K')
    expect(input).toHaveValue('Run a 5K')

    // Reopen with a new key — simulates ProfileFooter incrementing profileKey
    rerender(<ProfileModal key={2} isOpen={true} onClose={onClose} athlete={seedAthlete} />)

    expect(screen.getByPlaceholderText(/run a sub-4 hour marathon/i)).toHaveValue(
      seedAthlete.profile?.primaryGoal ?? '',
    )
  })

  it('renders the athlete primary goal on open', () => {
    renderWithProviders(<ProfileModal isOpen={true} onClose={vi.fn()} athlete={seedAthlete} />)
    expect(screen.getByPlaceholderText(/run a sub-4 hour marathon/i)).toHaveValue(
      seedAthlete.profile?.primaryGoal ?? '',
    )
  })

  it('does not render when isOpen is false', () => {
    renderWithProviders(<ProfileModal isOpen={false} onClose={vi.fn()} athlete={seedAthlete} />)
    expect(screen.queryByText('Profile')).not.toBeInTheDocument()
  })

  it('initialises all fields to empty strings when athlete.profile is null', () => {
    renderWithProviders(<ProfileModal isOpen={true} onClose={vi.fn()} athlete={seedNewAthlete} />)
    expect(screen.getByPlaceholderText(/run a sub-4 hour marathon/i)).toHaveValue('')
    expect(screen.getByPlaceholderText(/sore left knee/i)).toHaveValue('')
    expect(screen.getByPlaceholderText(/anything else your coach should know/i)).toHaveValue('')
  })
})

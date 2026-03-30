import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/utils'
import { ChatInput } from './ChatInput'

describe('ChatInput', () => {
  it('calls onSend with the typed message when send button is pressed', async () => {
    const user = userEvent.setup()
    const onSend = vi.fn()
    renderWithProviders(<ChatInput onSend={onSend} />)

    await user.type(screen.getByRole('textbox', { name: /message/i }), 'How far should I run?')
    await user.click(screen.getByRole('button', { name: /send/i }))

    expect(onSend).toHaveBeenCalledWith('How far should I run?')
  })

  it('clears the input after sending', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ChatInput onSend={vi.fn()} />)

    const input = screen.getByRole('textbox', { name: /message/i })
    await user.type(input, 'Hello coach')
    await user.click(screen.getByRole('button', { name: /send/i }))

    expect(input).toHaveValue('')
  })

  it('does not call onSend when the input is empty', async () => {
    const user = userEvent.setup()
    const onSend = vi.fn()
    renderWithProviders(<ChatInput onSend={onSend} />)

    await user.click(screen.getByRole('button', { name: /send/i }))

    expect(onSend).not.toHaveBeenCalled()
  })

  it('renders the disclaimer text', () => {
    renderWithProviders(<ChatInput onSend={vi.fn()} />)
    expect(screen.getByText(/training buddy is an ai model/i)).toBeInTheDocument()
  })
})

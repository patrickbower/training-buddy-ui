import { describe, it, expect, beforeAll, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { server } from '@/mocks/server'
import { renderWithProviders } from '@/test/utils'
import { ChatView } from './ChatView'
import type { Conversation } from '@/types/domain'

beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = vi.fn()
})

const conversationWithChipsLast: Conversation = {
  id: 'conv_01',
  athleteId: 'ath_01',
  createdAt: '2026-03-25T10:00:00Z',
  updatedAt: '2026-03-25T10:01:00Z',
  messages: [
    {
      id: 'msg_01',
      conversationId: 'conv_01',
      role: 'coach',
      content: 'Earlier question',
      quickReplies: ['Old chip A', 'Old chip B'],
      onboardingStep: { index: 1, total: 7 },
      card: null,
      createdAt: '2026-03-25T10:00:00Z',
    },
    {
      id: 'msg_02',
      conversationId: 'conv_01',
      role: 'athlete',
      content: 'Old chip A',
      quickReplies: null,
      onboardingStep: null,
      card: null,
      createdAt: '2026-03-25T10:00:30Z',
    },
    {
      id: 'msg_03',
      conversationId: 'conv_01',
      role: 'coach',
      content: 'Does that feel right?',
      quickReplies: ['Yes', 'No', 'Not sure'],
      onboardingStep: { index: 2, total: 7 },
      card: null,
      createdAt: '2026-03-25T10:01:00Z',
    },
  ],
}

describe('ChatView — quickReplies', () => {
  it('shows chips on the last coach message', async () => {
    server.use(http.get('/api/conversation', () => HttpResponse.json(conversationWithChipsLast)))

    renderWithProviders(<ChatView />)

    await waitFor(() => {
      expect(screen.getByText('Does that feel right?')).toBeInTheDocument()
    })

    expect(screen.getByRole('button', { name: 'Yes' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'No' })).toBeInTheDocument()
  })

  it('does not show chips from earlier messages', async () => {
    server.use(http.get('/api/conversation', () => HttpResponse.json(conversationWithChipsLast)))

    renderWithProviders(<ChatView />)

    await waitFor(() => {
      expect(screen.getByText('Does that feel right?')).toBeInTheDocument()
    })

    expect(screen.queryByRole('button', { name: 'Old chip A' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Old chip B' })).not.toBeInTheDocument()
  })

  it('clicking a chip sends it as a message and chips disappear', async () => {
    const user = userEvent.setup()
    let postFired = false

    server.use(
      http.get('/api/conversation', () => {
        if (postFired) {
          return HttpResponse.json({
            ...conversationWithChipsLast,
            messages: [
              ...conversationWithChipsLast.messages,
              {
                id: 'msg_04',
                conversationId: 'conv_01',
                role: 'athlete',
                content: 'Yes',
                quickReplies: null,
                onboardingStep: null,
                card: null,
                createdAt: '2026-03-25T10:01:30Z',
              },
            ],
          })
        }
        return HttpResponse.json(conversationWithChipsLast)
      }),
      http.post('/api/conversation/messages', () => {
        postFired = true
        return HttpResponse.json({})
      }),
    )

    renderWithProviders(<ChatView />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Yes' })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: 'Yes' }))

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'Yes' })).not.toBeInTheDocument()
    })
  })
})

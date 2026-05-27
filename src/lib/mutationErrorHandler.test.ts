import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/toast', () => ({
  toast: { error: vi.fn() },
}))

import { toast } from '@/lib/toast'
import { onMutationError } from '@/lib/mutationErrorHandler'

describe('onMutationError', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls toast.error with the error message when given an Error', () => {
    onMutationError(new Error('Save failed'))
    expect(toast.error).toHaveBeenCalledWith('Save failed')
  })

  it('calls toast.error with a fallback message when the error has no message', () => {
    onMutationError({ code: 500 })
    expect(toast.error).toHaveBeenCalledWith('Something went wrong')
  })
})

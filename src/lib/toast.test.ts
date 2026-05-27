import { describe, it, expect } from 'vitest'
import { toast } from '@/lib/toast'

describe('toast', () => {
  it('exports a toast object', () => {
    expect(toast).toBeDefined()
  })

  it('exposes success, error, warning and info as callable functions', () => {
    expect(typeof toast.success).toBe('function')
    expect(typeof toast.error).toBe('function')
    expect(typeof toast.warning).toBe('function')
    expect(typeof toast.info).toBe('function')
  })
})

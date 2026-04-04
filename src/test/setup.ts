import '@testing-library/jest-dom'
import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest'
import { server } from '@/mocks/server'
import { resetMockState } from '@/mocks/index'

// input-otp uses ResizeObserver and elementFromPoint — stub both for jsdom
// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}
window.ResizeObserver = class ResizeObserver {
  observe = noop
  unobserve = noop
  disconnect = noop
}
document.elementFromPoint = () => null

// Provide a working localStorage for jsdom (not fully supported in all vitest environments)
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value
    },
    removeItem: (key: string) => {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

// Start MSW server before all tests
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

// Reset handlers, mock state, and localStorage after each test to avoid state leakage
beforeEach(() => {
  localStorageMock.clear()
})

afterEach(() => {
  server.resetHandlers()
  resetMockState()
})

// Close server after all tests
afterAll(() => {
  server.close()
})

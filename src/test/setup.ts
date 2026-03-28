import '@testing-library/jest-dom'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { server } from '@/mocks/server'
import { resetMockState } from '@/mocks/index'

// Start MSW server before all tests
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

// Reset handlers and in-memory mock state after each test to avoid state leakage
afterEach(() => {
  server.resetHandlers()
  resetMockState()
})

// Close server after all tests
afterAll(() => {
  server.close()
})

import { setupServer } from 'msw/node'
import { handlers } from './index'

// Used in Vitest tests via src/test/setup.ts
export const server = setupServer(...handlers)

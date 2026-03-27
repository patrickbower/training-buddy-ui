import { setupWorker } from 'msw/browser'
import { handlers } from './index'

// Used in the browser during development when VITE_USE_MOCKS=true
export const worker = setupWorker(...handlers)

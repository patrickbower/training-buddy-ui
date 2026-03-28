import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider, QueryCache } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'
import { ApiRequestError } from '@/lib/api'

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      if (error instanceof ApiRequestError && error.status === 401) {
        window.location.href = '/api/auth/strava'
      }
    },
  }),
  defaultOptions: {
    queries: { staleTime: 60_000 },
  },
})

const rootEl = document.getElementById('root')
if (!rootEl) throw new Error('Root element not found')
createRoot(rootEl).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)

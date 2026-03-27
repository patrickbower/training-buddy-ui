import type { ReactElement } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

/**
 * Creates a fresh QueryClient for each test to avoid state leakage.
 */
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Don't retry in tests — fail fast
        gcTime: 0, // Don't cache between tests
      },
      mutations: {
        retry: false,
      },
    },
  })
}

function AllProviders({ children }: { children: React.ReactNode }) {
  const queryClient = createTestQueryClient()
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

/**
 * Use this instead of `render` from @testing-library/react.
 * Wraps with QueryClientProvider and any other global providers.
 *
 * @example
 * renderWithProviders(<RunSummary runId="run_01" />)
 */
function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { wrapper: AllProviders, ...options })
}

// Re-export everything from RTL so tests only need one import
export * from '@testing-library/react'
export { renderWithProviders }

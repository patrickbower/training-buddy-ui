# State Management

Two tools, one job each. Never blur the boundary.

## TanStack Query — server state

Use for anything that comes from or goes to the API: runs, training plans, athlete profile, coach messages.

- All query keys live in `src/lib/queryKeys.ts` as a typed const object.
- Mutations use `onMutate` for optimistic updates where UX demands it.
- Default `staleTime`: 60 seconds. Adjust per-query if data changes frequently.
- `QueryClientProvider` is set up in `src/main.tsx`.

Example query hook pattern:

```ts
export function useTrainingPlan(planId: string) {
  return useQuery({
    queryKey: queryKeys.trainingPlan(planId),
    queryFn: () => api.trainingPlans.getById(planId),
  })
}
```

## Zustand — client UI state

Use for ephemeral UI state that does not need to be fetched or persisted: conversation thread in the chat panel, UI flags (sidebar open/closed), optimistic message queue.

- One store per domain slice. Keep stores small and focused.
- Stores live in `src/stores/`.
- No derived state in stores — compute it with selectors at the call site.
- Never put server data in Zustand. If it came from an API, it belongs in TanStack Query.

Example store pattern:

```ts
interface ConversationStore {
  messages: CoachMessage[]
  addMessage: (message: CoachMessage) => void
  clearMessages: () => void
}

export const useConversationStore = create<ConversationStore>((set) => ({
  messages: [],
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  clearMessages: () => set({ messages: [] }),
}))
```

See [DOMAIN.md](DOMAIN.md) for entity types used in stores and queries.
See [MOCKING.md](MOCKING.md) for how to mock API calls in tests.

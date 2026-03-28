export const queryKeys = {
  athlete: () => ['athlete'] as const,
  runs: (params?: { limit?: number; offset?: number }) =>
    params ? (['runs', params] as const) : (['runs'] as const),
  run: (id: string) => ['runs', id] as const,
  trainingPlans: () => ['training-plans'] as const,
  trainingPlan: (planId: string) => ['training-plans', planId] as const,
  conversation: () => ['conversation'] as const,
} as const

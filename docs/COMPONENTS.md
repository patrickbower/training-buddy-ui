# Component Conventions

## Library

HeroUI v3 (`@heroui/react`) is the component library. Use HeroUI components as the first choice for all interactive elements (buttons, inputs, modals, cards). HeroUI components are WCAG 2.1 compliant by default — do not override accessibility attributes without good reason.

## Mobile-first

- Design for 375px viewport width as the baseline.
- Use Tailwind responsive prefixes to scale up: `sm:`, `md:`, `lg:`.
- Touch targets must be at least 44×44px.
- Avoid hover-only interactions — everything must work on touch.

## Perceived performance

- Every async action must have an immediate visual response (spinner, skeleton, or optimistic UI).
- Use HeroUI `Skeleton` for loading states on data-fetching components.
- Prefer optimistic updates via TanStack Query for user-initiated mutations.
- Transitions should use `framer-motion` — keep durations under 300ms.
- Never block the UI thread. Heavy computation goes in a Web Worker or is deferred.

## Tone and copy

- The coach is warm, encouraging, and non-judgmental.
- Celebrate effort over performance: "Great effort today!" not "You were slow."
- Avoid negative framing. "Let's build on that" not "You didn't hit your target."
- Use second person ("your run", "your plan") not third person.

## File structure

Components live in `src/components/`. Group by domain, not by type:

```
src/components/
  chat/         # CoachChat, MessageBubble, ChatInput
  plan/         # TrainingPlanCard, SessionCard, PlanCalendar
  runs/         # RunSummary, PaceChart, HeartRateChart
  athlete/      # AthleteProfile, GoalBadge
  shared/       # LoadingSpinner, EmptyState, ErrorBoundary
```

## Component rules

- Functional components only. No class components.
- One component per file. File name matches component name.
- Props interfaces are defined in the same file, named `[ComponentName]Props`.
- No direct DOM manipulation. Use refs only when unavoidable.
- Co-locate component tests: `ComponentName.test.tsx` next to `ComponentName.tsx`.

See [TESTING.md](TESTING.md) for component testing patterns.

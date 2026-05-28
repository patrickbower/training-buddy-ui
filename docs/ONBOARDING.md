# New Engineer Onboarding

Training Buddy is a mobile-first chat interface for an AI-powered running coach. Athletes connect via Strava OAuth, then interact with a coach through a conversational interface that guides onboarding, builds a training plan, and follows up after runs.

This document gives you the mental map. Deeper conventions are in the docs listed at the bottom.

---

## The Domain

Before reading code, read the domain. The central entity is an **Athlete**. An athlete has:

- A **TrainingPlan** with **Sessions** (planned workouts)
- **Runs** (completed workouts imported from Strava)
- A **Conversation** with the coach (persistent, discrete sessions — not one endless thread)

Key naming rule: **Session** = planned, **Run** = completed. These are not interchangeable.

The full glossary lives in [UBIQUITOUS_LANGUAGE.md](../UBIQUITOUS_LANGUAGE.md). Read it — it's short and saves confusion later.

---

## Mental Map

The codebase is organized by domain, not by file type. When you open `src/`, you should see the product:

```
src/
├── types/domain.ts         ← canonical TypeScript interfaces for the whole domain
├── components/
│   ├── chat/               ← everything about the coach conversation
│   ├── athlete/            ← profile, settings
│   └── shared/             ← app chrome (shell, sidebar, layouts)
├── pages/                  ← route endpoints, thin wrappers
├── hooks/                  ← data fetching and state per domain area
├── stores/                 ← ephemeral UI state (Zustand)
├── lib/                    ← typed API client, query keys, utilities
├── mocks/                  ← MSW handlers + seed data
└── test/                   ← shared test utilities and factories
```

`plan/` and `runs/` directories exist but are empty — they are reserved for future features.

---

## Tech Stack

| Concern         | Tool                           | Why                                                     |
| --------------- | ------------------------------ | ------------------------------------------------------- |
| Framework       | React 19 + Vite                | Fast builds, modern React features                      |
| Language        | TypeScript 5 (strict)          | `any` is not allowed                                    |
| Routing         | TanStack React Router          | File-less, typed routes with guard support              |
| Server state    | TanStack Query                 | API data, caching, loading/error states                 |
| UI state        | Zustand                        | Ephemeral client state only (sidebar open, form drafts) |
| Components      | HeroUI v3                      | WCAG 2.1 compliant, React 19 compatible                 |
| Styling         | Tailwind CSS v4                | Utility-first, mobile-first (375px baseline)            |
| Animations      | Framer Motion                  | Transitions must be sub-300ms                           |
| Notifications   | Sonner                         | Toast system, configured in `lib/toast.ts`              |
| Unit tests      | Vitest + React Testing Library | TDD default                                             |
| E2E tests       | Playwright                     | Critical paths (auth, onboarding, chat)                 |
| API mocking     | MSW                            | Single strategy across dev, unit, and E2E               |
| Package manager | pnpm                           | Required — do not use npm or yarn                       |

---

## State Management Boundary

This is the most important architectural rule to internalize:

- **TanStack Query** owns everything from the API: athlete data, runs, plans, conversations.
- **Zustand** owns only ephemeral UI state: sidebar visibility, form drafts, auth session flags.

Server data never goes in Zustand. UI state never goes in TanStack Query. The line is the network boundary.

---

## Routing and Guards

Routes are defined in [src/router.tsx](../src/router.tsx). There are no file-based conventions — each route is an explicit `createRoute` call.

Guard functions live in [src/router.guards.ts](../src/router.guards.ts). They run in `beforeLoad` and redirect if preconditions aren't met (e.g., unauthenticated user trying to access `/chat`, incomplete onboarding state reaching the chat route).

The route tree:

- `/login`, `/verify` → unauthenticated (AuthLayout)
- `/onboarding`, `/onboarding/chat` → onboarding flow, guarded
- `/chat/:conversationId` → authenticated coaching chat, guarded
- `/plan` → placeholder, hidden from nav

---

## Mocking Strategy

The backend does not exist yet. All API calls are intercepted by Mock Service Worker (MSW).

- In tests: `mocks/server.ts` (msw/node)
- In dev: `mocks/browser.ts` (msw/browser) — enabled when `VITE_USE_MOCKS=true`

Handlers are in `mocks/handlers/` organized by domain. Seed data is in `mocks/data/`. This means you can run the full app locally without any backend.

---

## Development Commands

```bash
pnpm dev          # start dev server with MSW mocks
pnpm build        # production build
pnpm typecheck    # TypeScript check (runs in CI)
pnpm lint         # ESLint
pnpm test         # unit + component tests (Vitest)
pnpm test:e2e     # E2E tests (Playwright)
```

---

## Conventions Reference

| Topic              | Doc                                                 |
| ------------------ | --------------------------------------------------- |
| TypeScript rules   | [TYPESCRIPT.md](TYPESCRIPT.md)                      |
| Component patterns | [COMPONENTS.md](COMPONENTS.md)                      |
| State management   | [STATE.md](STATE.md)                                |
| Testing            | [TESTING.md](TESTING.md)                            |
| Domain model       | [DOMAIN.md](DOMAIN.md)                              |
| Mocking            | [MOCKING.md](MOCKING.md)                            |
| Authentication     | [AUTH.md](AUTH.md)                                  |
| API contract       | [API_CONTRACT.md](API_CONTRACT.md)                  |
| UX philosophy      | [UX_OVERVIEW.md](UX_OVERVIEW.md)                    |
| Domain language    | [UBIQUITOUS_LANGUAGE.md](../UBIQUITOUS_LANGUAGE.md) |

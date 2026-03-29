# Training Buddy

An AI-powered running coach for intermediate runners. A mobile-first chat interface where users define a single training plan and use it as shared context for all ongoing coaching conversations.

The product is in private beta. Strava is the OAuth provider and the primary source of training data.

---

## Before You Code

If you are new to the project, read [docs/UX_OVERVIEW.md](docs/UX_OVERVIEW.md) first. It explains what the product is, the reasoning behind key UX decisions, the coaching session model, and what is deliberately out of scope for beta. Understanding the product intent will help you make better implementation decisions.

---

## Commands

```bash
pnpm dev          # start dev server
pnpm build        # production build
pnpm typecheck    # type check
pnpm lint         # lint
pnpm test         # unit tests (vitest)
pnpm test:e2e     # end-to-end tests (playwright)
```

---

## Developer Docs

| Doc                                          | What it covers                                                                                 |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| [docs/UX_OVERVIEW.md](docs/UX_OVERVIEW.md)   | Product intent, session model, memory architecture, coaching philosophy, safety guardrails     |
| [docs/DOMAIN.md](docs/DOMAIN.md)             | Canonical entity names and types (`Athlete`, `TrainingPlan`, `Session`, `Run`, `Conversation`) |
| [docs/COMPONENTS.md](docs/COMPONENTS.md)     | Component conventions                                                                          |
| [docs/STATE.md](docs/STATE.md)               | State management patterns                                                                      |
| [docs/TESTING.md](docs/TESTING.md)           | Testing conventions                                                                            |
| [docs/MOCKING.md](docs/MOCKING.md)           | Mock data and handler patterns                                                                 |
| [docs/AUTH.md](docs/AUTH.md)                 | Authentication and Strava OAuth                                                                |
| [docs/API_CONTRACT.md](docs/API_CONTRACT.md) | API contract between frontend and backend                                                      |
| [docs/TYPESCRIPT.md](docs/TYPESCRIPT.md)     | TypeScript conventions                                                                         |

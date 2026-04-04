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

## Development

### Mock API

API calls are intercepted by [MSW](https://mswjs.io/) in development and test. The dev server starts with mocks enabled by default via `VITE_USE_MOCKS=true`.

### Dummy auth

The login flow is a dummy implementation — no real Strava API calls are made. Any valid-format email and any 6-digit numeric code will succeed.

**To test unhappy paths**, use these magic values:

| Input           | Where                   | Result                            |
| --------------- | ----------------------- | --------------------------------- |
| `fail@test.com` | Email field on `/login` | `400 { error: "User not found" }` |
| `000000`        | OTP field on `/verify`  | `400 { error: "Invalid code" }`   |

These are handled by MSW in `src/mocks/handlers/auth.ts`. When real Strava OAuth is wired up, only the MSW handlers and backend implementation change — the client-side flow remains the same.

### Resetting auth state

Auth state is persisted to `localStorage` (key: `auth`). To reset your session during development, run in the browser console:

```js
localStorage.removeItem('auth')
```

Then refresh the page.

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

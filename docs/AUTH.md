# Authentication

## Strategy

Authentication is handled via **Strava OAuth** with **cookie-based sessions** (not JWT tokens).

The flow:

1. Athlete clicks "Connect with Strava"
2. Redirected to Strava OAuth consent screen
3. Strava redirects back to the backend callback URL with an auth code
4. Backend exchanges the code for Strava tokens, creates a session, sets an `HttpOnly` cookie
5. Front-end is now authenticated — all subsequent API requests include the cookie automatically

## Front-end responsibilities

- The front-end does **not** handle tokens. It never sees the Strava access token.
- The front-end does **not** set, read, or manage the session cookie directly.
- The `useAthlete` query hook detects unauthenticated state via a `401` response and redirects to the login screen.
- The login screen has a single CTA: "Connect with Strava" which links to the backend OAuth initiation endpoint.

## Current status

Authentication is **not yet implemented**. During development, all requests are made as the seed athlete (`src/mocks/data/athlete.ts`). The `useAthlete` hook returns seed data via MSW.

## When implementing

- The backend engineer owns the OAuth callback, session creation, and cookie configuration.
- The front-end needs: a `/login` route, a `useAthlete` hook that handles `401`, and a logout function that calls `POST /api/auth/logout`.
- CORS and cookie `SameSite` configuration is the backend engineer's responsibility — coordinate via [API_CONTRACT.md](API_CONTRACT.md).

## Security notes

- Never store Strava tokens in `localStorage` or `sessionStorage`.
- Never store sensitive user data in Zustand (it is not persisted, but avoid bad habits).
- The session cookie must be `HttpOnly`, `Secure`, and `SameSite=Lax` (minimum).

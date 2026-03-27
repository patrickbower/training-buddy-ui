# API Contract

This document is the source of truth for the front-end/back-end interface. It defines the endpoints this front-end consumes and the request/response shapes expected.

**Status**: All endpoints are currently mocked via MSW. No live backend exists yet.

**Base URL**: `VITE_API_BASE_URL` env var. Defaults to `/api` in development.

**Authentication**: Cookie-based session (see [AUTH.md](AUTH.md)). All endpoints except `/auth/*` require an authenticated session and return `401` if not present.

**Date format**: All date fields are ISO 8601 strings. Distances in km. Durations in seconds.

---

## Auth

### `GET /api/auth/strava`

Initiates Strava OAuth flow. Redirects to Strava consent screen.

### `GET /api/auth/callback`

Strava OAuth callback. Sets session cookie. Redirects to `/`.

### `POST /api/auth/logout`

Clears session cookie. Returns `204`.

---

## Athlete

### `GET /api/athlete`

Returns the authenticated athlete's profile.

**Response `200`**:

```json
{
  "id": "ath_01",
  "stravaId": "12345678",
  "name": "Alex Runner",
  "email": "alex@example.com",
  "avatarUrl": "https://example.com/avatar.jpg",
  "fitnessLevel": "intermediate",
  "weeklyMileageTarget": 40,
  "goals": [
    {
      "id": "goal_01",
      "type": "race",
      "description": "Sub-4hr marathon",
      "targetDate": "2026-10-01"
    }
  ],
  "createdAt": "2026-01-15T09:00:00Z"
}
```

### `PATCH /api/athlete`

Updates athlete profile fields.

**Request body**: Partial `Athlete` (excluding `id`, `stravaId`, `createdAt`).
**Response `200`**: Updated `Athlete`.

---

## Runs

### `GET /api/runs`

Returns the authenticated athlete's run history, newest first.

**Query params**:

- `limit` (number, default 20)
- `offset` (number, default 0)

**Response `200`**:

```json
{
  "runs": [
    /* Run[] */
  ],
  "total": 42
}
```

### `POST /api/runs`

Logs a new completed run.

**Request body**: `Omit<Run, 'id' | 'athleteId' | 'createdAt'>`
**Response `201`**: Created `Run`.

### `GET /api/runs/:id`

Returns a single run.

**Response `200`**: `Run`
**Response `404`**: `{ "error": "Run not found" }`

---

## Training Plans

### `GET /api/training-plans`

Returns all training plans for the athlete.

**Response `200`**: `TrainingPlan[]`

### `POST /api/training-plans`

Asks the AI coach to generate a new training plan. This may take several seconds.

**Request body**:

```json
{
  "startDate": "2026-04-01",
  "goalId": "goal_01",
  "weeksCount": 12
}
```

**Response `201`**: Created `TrainingPlan` with `sessions` populated.

### `GET /api/training-plans/:id`

Returns a single plan with all sessions.

**Response `200`**: `TrainingPlan`

### `PATCH /api/training-plans/:id/sessions/:sessionId`

Updates a planned session (e.g. marks it complete, links a run).

**Request body**: Partial `Session`
**Response `200`**: Updated `Session`

---

## Conversation

### `GET /api/conversation`

Returns the athlete's conversation history with the coach.

**Response `200`**: `Conversation`

### `POST /api/conversation/messages`

Sends a new message from the athlete. The coach response is streamed via Server-Sent Events.

**Request body**:

```json
{ "content": "How far should I run today?" }
```

**Response**: `text/event-stream` — each event is a partial `CoachMessage.content` string. Final event is `[DONE]`.

---

## Error format

All error responses follow this shape:

```json
{
  "error": "Human-readable message",
  "code": "MACHINE_READABLE_CODE"
}
```

Common codes: `UNAUTHORIZED`, `NOT_FOUND`, `VALIDATION_ERROR`, `INTERNAL_ERROR`

---

## Open questions for backend engineer

- [ ] Session cookie name and expiry duration
- [ ] Rate limiting on `POST /api/conversation/messages`
- [ ] Strava webhook for automatic Run import
- [ ] CORS allowed origins for local development
- [ ] Pagination strategy — cursor-based or offset?

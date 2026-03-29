# Training Buddy — UX Overview

> A reference document for developers joining the project. Captures what the product is, the reasoning behind key UX decisions, and the principles that should guide future development.

---

## What Is Training Buddy?

Training Buddy is an AI-powered running coach for intermediate runners. It is intentionally simple: a single conversational interface where a user defines one running plan, then uses that plan as the shared context for all ongoing coaching conversations.

The product is in private beta. Strava is both the OAuth provider and the primary data source. This is a deliberate architectural choice — it means users arrive with real training history already available, and it acts as a natural filter ensuring users are already active runners before they reach the product.

---

## The Onboarding Flow

When a new user authenticates via Strava OAuth, they are taken through a plan creation stage before the full app is unlocked. This is not a separate onboarding screen — it takes place inside the coaching interface itself, as a conversation with the coach.

**Why:** Baking onboarding into the chat interface means the user is already in the coaching relationship before they realise onboarding is over. There is no seam between "setting up" and "being coached." The last message of onboarding and the first message of coaching should be indistinguishable.

During onboarding, the Strava API fetches the user's run history in the background. The time it takes the user to answer three or four questions is sufficient for this data to be ready — no spinner, no waiting state.

**If Strava returns no data** (a new or inactive Strava account), the coach treats the user as a runner starting from scratch and relies on the self-reported profile. This is not an error state; the coach acknowledges it naturally and moves forward.

### What the Plan Captures

The plan is intentionally minimal. It should stay that way.

```json
{
  "name": "John",
  "primaryGoal": "trail marathon",
  "targetEvent": "Lake District Trail Marathon",
  "targetDate": "2026-10-18",
  "baseRunner": ["intermediate", "20 miles per week", "trail runner"]
}
```

The `targetDate` field is critical — without it, the coach cannot build a periodized plan. Everything else can be inferred or surfaced through conversation over time. Do not add fields to the plan without strong justification; bloat here degrades every coaching session that follows.

Strava data can be used to suggest defaults for `baseRunner`, but users should be given the opportunity to confirm or correct them — Strava tracks what you did, not who you are as a runner.

---

## Memory Architecture

Each chat session is given a tight, curated context package — not an ever-growing history. The goal is consistent coaching quality across sessions without hitting context window limits.

**Three layers:**

**Layer 1 — The Plan (always in context).** The JSON above. Static unless the user updates it. Present at the start of every session.

**Layer 2 — Attribute Summaries (always in context).** A small set of structured, evolving facts about the runner: injury status, confirmed race dates, significant training events, and similar. These are updated conservatively — only when a clear, explicit signal is detected in conversation (e.g. a confirmed injury diagnosis, not a passing mention of stiffness). This layer must remain tight. Its purpose is to give the coach continuity without requiring it to read every prior session.

**Layer 3 — Session Summaries (retrieved on demand).** Each completed session is summarised. The coach can retrieve relevant summaries when the current conversation warrants it — for example, when a user mentions a topic discussed in a previous session. These are not injected by default.

---

## Session Model

There are two types of session:

**Run-triggered sessions (coach-initiated).** When a run is logged on Strava, a webhook fires and the coach eagerly composes an opening message using the run data and the current attribute summaries. By the time the user opens the app, the session is already waiting with the coach's message ready. This is the primary coaching rhythm. Example opening: _"I saw you ran 9 miles this morning — your pace was stronger than last week's equivalent run. How did it feel?"_

Eager composition is deliberate: it is simpler to implement than lazy composition (no "has this been opened?" state management) and produces a better user experience.

**User-initiated sessions.** The user can open a new session at any time via the sidebar. This covers anything not tied to a specific run — race strategy, injury questions, general planning, and so on.

Sessions are discrete. There is no single endless conversation. This is intentional: long single-session chats degrade in quality as context fills, and discrete sessions allow memory to be managed deliberately across the tiered architecture above.

---

## The Plan View

The "Your run plan" item in the left sidebar shows the user a natural-language playback of their plan JSON, along with a prompt asking if they want to update anything. Updates are handled conversationally — there is no separate settings screen.

The plan is fixed unless the user actively chooses to update it. The coach may prompt a plan update when the conversation context suggests it is needed (for example, after a significant injury or a major change in circumstances). In that case, the user is guided through a re-run of the onboarding flow.

---

## Coaching Philosophy

The coach is **coach-led rhythmically** — it initiates sessions when a run is detected — and **user-led within sessions** — it responds to what the user brings rather than pushing unsolicited opinions mid-conversation.

The coach does not initiate outside of the run-triggered session model. Between sessions, it is silent.

Within a session, the coach is an expert with opinions. It does not simply answer questions; it notices things, asks follow-up questions, and brings coaching intelligence to the conversation.

---

## Safety Guardrails

Three rules must be enforced at the system prompt level. They are non-negotiable and should not be softened in future prompt iterations without careful review.

**Rule 1 — Pain triggers a hard stop.** Any mention of sharp pain, persistent pain, swelling, or inability to bear weight should cause the coach to pause training advice entirely and direct the user to seek professional assessment before their next run.

**Rule 2 — The 10% rule is a hard constraint.** The coach must never recommend increasing weekly mileage by more than 10% week-on-week, regardless of what the user asks for.

**Rule 3 — Medical questions are out of scope.** If a user asks anything medical ("is this a stress fracture?", "should I take ibuprofen?"), the coach immediately redirects to a medical professional. It does not speculate.

The in-app disclaimer should read: _"Training Buddy provides general running coaching only. For pain, injury, or health concerns, always consult a medical professional."_

---

## Target User

Training Buddy is designed for intermediate runners who are already using Strava. The Strava dependency is itself the filter: someone who tracks their runs on Strava and then seeks a coaching layer on top of it has already demonstrated the motivation and self-awareness the product is built for.

The product is not designed for complete beginners (less likely to be on Strava, higher injury risk, different coaching needs) or elite athletes (likely already working with human coaches, need more individualised periodisation than this tool currently offers).

---

## What Is Deliberately Out of Scope for Beta

The following are known future considerations, not oversights:

- Push notifications (sessions appear in sidebar; user returns to them when ready)
- User-facing memory inspection beyond the plan view
- A "skip debrief" mechanism for run-triggered sessions
- Multiple plans per user
- Manual run upload (Strava is the only data source at this stage)

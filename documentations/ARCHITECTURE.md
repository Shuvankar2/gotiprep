# System Architecture
## SUVNKR Practice Hub

**Version:** 1.0 (Draft)

---

## 1. Architecture Style

**Monorepo, shared-core, thin-client architecture.** One repo, one source of truth for types and scoring logic, two client shells (Web SPA, Mobile app), one API.

Rationale: you're a solo/small founding team (you + Ritav via Nenzon) — a monorepo minimizes duplicated logic between web and mobile (especially WPM/accuracy calculation, which must be identical everywhere for trust/fairness) and keeps OSS contribution simple (one repo to clone).

```
suvnkr-practice-hub/
├── apps/
│   ├── web/              # React + Vite SPA
│   ├── mobile/           # React Native (Expo) app
│   └── api/              # Node.js backend (REST/GraphQL)
├── packages/
│   ├── core-engine/      # WPM/accuracy calc, timer logic, scoring — pure TS, no UI
│   ├── ui-kit/            # Shared design-system components (web-first; RN variants where feasible)
│   ├── types/             # Shared TypeScript types/interfaces (User, Result, Passage, etc.)
│   └── config/            # Shared eslint/tsconfig/tailwind config
├── content/               # Passage bank, sentence-completion bank, email prompts (JSON/MD, versioned)
├── docs/                  # This documentation set
└── infra/                 # IaC / deployment configs (Docker, CI workflows)
```

Tooling for the monorepo: **Turborepo** (lighter than Nx, plenty for this scale, good caching for CI speed).

---

## 2. High-Level Component Diagram (textual)

```
┌─────────────┐     ┌──────────────┐
│   Web App    │     │  Mobile App   │
│ (React/Vite) │     │ (React Native)│
└──────┬───────┘     └──────┬────────┘
       │  HTTPS/JSON        │  HTTPS/JSON
       └─────────┬──────────┘
                  ▼
          ┌───────────────┐
          │   API Layer    │  (Node.js/Express or NestJS)
          │  - Auth (JWT)  │
          │  - REST routes │
          │  - Rate limit  │
          └───────┬───────┘
        ┌──────────┼───────────┐
        ▼          ▼           ▼
 ┌────────────┐ ┌────────┐ ┌────────────┐
 │  MongoDB    │ │ Redis  │ │ 3rd-party   │
 │  (Atlas)    │ │(cache/ │ │ services:   │
 │  - Users    │ │ rate-  │ │ OAuth, LLM  │
 │  - Results  │ │ limit) │ │ API, Email  │
 │  - Content  │ └────────┘ │ provider    │
 └────────────┘             └────────────┘
```

Ad SDKs (AdSense on web, AdMob on mobile) are client-side integrations — they do not route through your API; they call Google's ad servers directly from each client shell.

---

## 3. Client Architecture

### 3.1 Web (`apps/web`)
- **Framework:** React 18 + TypeScript + Vite.
- **Styling:** Tailwind CSS (matches the dark, card-based UI in your reference screenshot — Tailwind's utility approach is fast for this density of small components: toggles, chips, timers).
- **State:** Zustand for lightweight global state (auth, active test session); React Query (TanStack Query) for server-state/caching.
- **Routing:** React Router.
- **Typing engine:** lives in `packages/core-engine`, imported directly — the web app is a thin renderer over it.
- **Ad integration:** Google AdSense via `react-adsense` or raw script tag, env-var gated per NFR/FR-8.3.

### 3.2 Mobile (`apps/mobile`)
- **Framework:** React Native via **Expo** (managed workflow — faster iteration, OTA updates via EAS Update, simpler CI/CD than bare RN, and you already have RN-adjacent experience via Flutter on AquaGlass, but Expo/RN lets you reuse `core-engine` and `types` packages directly since they're both TypeScript/JS — this is the main reason to pick RN over Flutter here).
- **Navigation:** React Navigation.
- **State:** Same Zustand + React Query pattern as web for consistency.
- **Ad integration:** `react-native-google-mobile-ads` (AdMob).
- **Native modules needed:** Secure token storage (`expo-secure-store`), share sheet (`expo-sharing` / `react-native-share`) for FR-6.3.

> **Note on offline typing buffering (NFR from SRS §2.4):** implement typing-session state in local device storage (IndexedDB on web via a small wrapper, AsyncStorage/SecureStore on mobile) and sync completed results to the API on reconnect — keep this logic in `core-engine` too, behind an interface so both platforms share the sync strategy.

---

## 4. Backend Architecture (`apps/api`)

- **Framework:** Node.js + **Express** for v1 simplicity (NestJS is a reasonable upgrade later if the team grows and you want stricter module boundaries — not necessary for launch).
- **Database:** MongoDB (Atlas managed) — matches your existing MERN experience (NoteLoom, AquaGlass) and fits the semi-flexible content schemas (passages, prompts) well.
- **Cache/Rate-limit:** Redis (Upstash free tier works for early scale) — used for auth rate-limiting (NFR-7) and caching leaderboard/achievement computations.
- **Auth:** Passport.js strategies for Google/LinkedIn/GitHub OAuth + local email/password with bcrypt, issuing JWT access + refresh tokens (FR-1).
- **API style:** REST (simpler for OSS contributors to understand and test via Postman/curl vs GraphQL's steeper onboarding curve — recommend REST for this project).
- **Validation:** Zod schemas shared where possible with `packages/types`.
- **Background jobs:** A lightweight job queue (BullMQ on Redis) for: badge/achievement evaluation, job-alert digest emails, AI-feedback requests (so these don't block the request/response cycle).

### 4.1 Core data models (simplified)

```
User {
  id, email, passwordHash?, oauthProviders[],
  displayName, createdAt,
  jobAlertPreferences[], isAdmin
}

TestResult {
  id, userId, module: 'typing'|'passage'|'sentence'|'email',
  settingsUsed {}, wpm?, accuracy?, score?,
  durationSec, createdAt
}

Achievement {
  id, userId, badgeKey, unlockedAt
}

Passage / SentenceItem / EmailPrompt {
  id, category, difficulty, content, createdBy, active
}
```

---

## 5. Anti-Cheat / Integrity Notes
Since WPM and accuracy feed achievements/shareable cards (public-facing credibility), add minimal server-side sanity checks:
- Reject results where WPM exceeds a physically implausible ceiling (e.g., > 250 WPM) or duration mismatches the selected setting.
- Reject results submitted without matching keystroke-event metadata length (basic heuristic, not full anti-cheat — proportionate for v1).

---

## 6. Deployment Architecture

| Layer | Service | Notes |
|---|---|---|
| Web frontend | **Vercel** | Free tier generous, great DX, auto-preview per PR — good for OSS contributors |
| Mobile builds | **Expo EAS Build + Submit** | Handles Play Store/App Store binaries + submission |
| API | **Render** or **Railway** (start), migrate to AWS/GCP if scale demands | Simple container deploy, free/cheap tier to start |
| Database | **MongoDB Atlas** (free M0 tier initially) | |
| Cache/Queue | **Upstash Redis** (free tier) | |
| Email | **Resend** or AWS SES | Resend has a clean DX for transactional email |
| CI/CD | **GitHub Actions** | Lint, typecheck, test, build, deploy on merge to `main`; preview builds on PR |
| Error tracking | **Sentry** (free tier) | Both web and mobile SDKs available |
| Analytics | **Google Analytics 4** (web) + Firebase Analytics (mobile) or a privacy-friendlier option like Plausible if you want OSS-friendly analytics | |

---

## 7. Environment & Config Strategy (important for OSS)

- `.env.example` checked into repo listing every required variable (Mongo URI, JWT secret, OAuth client IDs/secrets, AdSense publisher ID, AdMob app ID, LLM API key) with placeholder values.
- All ad and AI-feedback features must **default to OFF** when their env vars are unset, so anyone forking/self-hosting doesn't accidentally break or, worse, inherit your ad account.
- Secrets never committed; add a pre-commit hook or GitHub secret-scanning action.

---

## 8. Sequence: Typing Test Flow (example)

1. Client requests a passage: `GET /api/passages?difficulty=medium&category=general`
2. Client renders passage, starts local timer + keystroke capture (all client-side, `core-engine`).
3. On completion (time-up or user submits), client computes final WPM/accuracy locally for instant UI feedback.
4. Client POSTs result: `POST /api/results` with `{ module, settingsUsed, wpm, accuracy, durationSec, keystrokeMeta }`.
5. API validates (integrity checks §5), persists to MongoDB, enqueues achievement-evaluation job.
6. Worker evaluates badge triggers, writes new `Achievement` rows if unlocked, optionally pushes a websocket/poll-based notification to client.
7. Client shows result screen (+ ad unit here, not before) and offers "Share result card" (FR-6.2/6.3).

---

## 9. Scalability Path (post-v1, if needed)
- Move passage/content bank to a CDN-backed static JSON store if read volume grows (reduces DB read load).
- Introduce read replicas / caching layer for leaderboard queries.
- Split `core-engine`-heavy compute (e.g., AI feedback) into a separate worker service if volume grows.

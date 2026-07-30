# Software Requirements Specification (SRS)
## SUVNKR Practice Hub

**Version:** 1.0 (Draft)
**Standard reference:** Structured loosely on IEEE 830 sections, trimmed for a solo/small-team OSS project.

---

## 1. Introduction

### 1.1 Purpose
Defines functional and non-functional requirements for SUVNKR Practice Hub v1 — a web + mobile skill-practice platform (typing, unseen passage, sentence completion, email writing) with social auth, achievements, and ad monetization.

### 1.2 Scope
Covers: guest and authenticated user flows, four practice modules, achievement engine, social login, ad integration hooks, and job-alert opt-in. Excludes payment processing, live multiplayer, and B2B features (deferred to v2, see PRD §6).

### 1.3 Intended Audience
You (as sole/lead developer under Nenzon Technologies), future open-source contributors, and anyone auditing the project for correctness.

### 1.4 Definitions
- **WPM** — Words Per Minute
- **Blind Mode** — test mode where typing errors are visually hidden until submission
- **Backspace Lock** — disables the backspace/delete key during a test
- **OSS** — Open Source Software

---

## 2. Overall Description

### 2.1 Product Perspective
Standalone product; not a plugin. Web app (React SPA) and mobile app (React Native) both consume a shared REST/GraphQL API and shared TypeScript logic package (see Architecture doc for monorepo layout).

### 2.2 User Classes

| Class | Access |
|---|---|
| Guest | Free-tier durations (5/10/15 min), no persistence |
| Registered (free) | + 30-min tests, Blind Mode, history, achievements, job alerts, social share |
| Admin (you) | Content management (passages, email prompts, sentence bank), user moderation, analytics dashboard |

### 2.3 Operating Environment
- Web: evergreen browsers (Chrome, Firefox, Edge, Safari — last 2 versions), responsive down to 360px width.
- Mobile: Android 8+ (API 26+), iOS 15+.
- Backend: Node.js LTS on Linux container (see Tech Stack doc for hosting).

### 2.4 Design & Implementation Constraints
- Must support offline-tolerant typing (local buffering; sync results on reconnect) — typing tests must not lose user input on flaky mobile networks.
- Ad SDKs must never block or delay the practice-test rendering path (perf + UX requirement, also Play Store policy).
- All timing-critical logic (WPM calculation, timers) must run client-side with server-side result validation (anti-tamper for leaderboard/achievement integrity).

---

## 3. Functional Requirements

### FR-1: Authentication
- FR-1.1: System shall support guest access with no login for core practice modules at free-tier durations.
- FR-1.2: System shall support account creation via email/password.
- FR-1.3: System shall support OAuth login via Google, LinkedIn, GitHub.
- FR-1.4: System shall issue JWT access token + refresh token on successful auth.
- FR-1.5: System shall allow account deletion and full data export (GDPR-style compliance, good OSS practice).

### FR-2: Typing Practice Module
- FR-2.1: User shall select test duration (5/10/15 min free; 30 min requires login).
- FR-2.2: System shall render a passage from the content bank matching selected difficulty/category.
- FR-2.3: User shall toggle Backspace Lock, Word Highlight, Blind Mode (login-gated), Auto-scroll independently before starting.
- FR-2.4: System shall compute WPM = (correct characters typed / 5) / minutes elapsed, and accuracy = correct chars / total chars typed.
- FR-2.5: System shall persist test result (if logged in) with timestamp, WPM, accuracy, settings used.
- FR-2.6: System shall prevent paste-into-typing-area (exam integrity).

### FR-3: Unseen Passage Practice
- FR-3.1: System shall serve a passage the user has not seen before (tracked per-user for logged-in users; random for guests).
- FR-3.2: System shall support "Read & Type" mode (reuses FR-2 engine) and "Read & Answer" mode (MCQ comprehension, timed).
- FR-3.3: System shall score comprehension attempts and store results separately from typing-speed results.

### FR-4: Sentence Completion Practice
- FR-4.1: System shall present cloze-style sentences with a blank the user must type the answer into (not multiple-choice).
- FR-4.2: System shall validate answers against an accepted-answers list (supporting minor synonym variance — configurable).
- FR-4.3: System shall show per-sentence instant correct/incorrect feedback and a set-level score at the end.

### FR-5: Email Writing Practice
- FR-5.1: System shall present a prompt from a 300+ item bank with category filter.
- FR-5.2: System shall enforce a configurable timer (default 9 min) and minimum word count (default 100).
- FR-5.3: System shall display a split-flap-style countdown timer.
- FR-5.4: System shall (optionally, if AI feedback enabled) submit the response to an LLM API for rubric-based feedback (structure, tone, grammar, word count) and shall rate-limit this per free user per day.

### FR-6: Achievements & Sharing
- FR-6.1: System shall evaluate badge-trigger conditions after each completed session (streaks, WPM thresholds, module-completion, accuracy).
- FR-6.2: System shall generate a shareable image card (server-side or client canvas render) summarizing a result/badge, brand-styled.
- FR-6.3: User shall be able to download or directly share the card to LinkedIn/Instagram/X via native share sheet (mobile) or share-intent links (web).

### FR-7: Job Alerts
- FR-7.1: User shall opt in/out of job alert emails per category during or after signup.
- FR-7.2: System shall send periodic (e.g., weekly) digest emails to opted-in users (transactional email provider — see Tech Stack).

### FR-8: Ads
- FR-8.1: System shall render ad units only in non-test-blocking zones: dashboard, result screen, passage-selection screen.
- FR-8.2: System shall NOT render any ad unit during an active timed test.
- FR-8.3: Ad configuration (publisher/unit IDs) shall be environment-variable driven, defaulting to disabled if unset (OSS self-host safety).

### FR-9: Admin/Content Management
- FR-9.1: Admin shall be able to add/edit/remove passages, sentence-completion items, and email prompts via an internal admin panel or CMS-lite (even a simple protected route + form is acceptable for v1; headless CMS optional).

---

## 4. Non-Functional Requirements

### 4.1 Performance
- NFR-1: Typing keystroke-to-render latency shall be < 16ms (60fps feel) — no debounce on the input path.
- NFR-2: Initial page load (LCP) shall be < 2.5s on 4G.
- NFR-3: API p95 response time < 300ms for read endpoints.

### 4.2 Scalability
- NFR-4: Backend shall be stateless (horizontally scalable), session state in JWT + DB, not in-memory server sessions.

### 4.3 Security
- NFR-5: Passwords hashed with bcrypt/argon2; never stored/logged in plaintext.
- NFR-6: OAuth secrets and API keys stored in environment variables / secret manager, never committed to the OSS repo (critical — add `.env.example` + secret-scanning CI check).
- NFR-7: Rate-limit auth endpoints and AI-feedback endpoints to prevent abuse.
- NFR-8: All traffic over HTTPS/TLS.

### 4.4 Availability
- NFR-9: Target 99.5% uptime for v1 (single-region hosting acceptable at this stage).

### 4.5 Accessibility
- NFR-10: WCAG 2.1 AA color contrast on core UI (dark theme, as shown in your screenshot, must still pass contrast checks).
- NFR-11: Full keyboard navigability outside the typing test area itself.

### 4.6 Compatibility
- NFR-12: Web app responsive from 360px to 2560px viewport widths.
- NFR-13: Mobile app supports both portrait orientations at minimum; landscape optional for typing screens.

### 4.7 Maintainability / OSS Health
- NFR-14: Shared TypeScript types between web, mobile, and API (single source of truth) to reduce drift.
- NFR-15: CI must run lint + typecheck + unit tests on every PR before merge is allowed on `main`.
- NFR-16: Code coverage target ≥ 60% for core scoring/WPM logic (this logic is the product's credibility — bugs here are reputationally costly).

---

## 5. External Interface Requirements

- **AdSense/AdMob SDKs** — see Tech Stack doc.
- **OAuth providers** — Google, LinkedIn, GitHub developer consoles (redirect URIs must be pre-registered per environment).
- **Transactional email provider** — for job alerts + auth emails (e.g., Resend, SendGrid, or AWS SES).
- **Optional LLM API** — for email-writing feedback (Claude/Gemini API), only if FR-5.4 is enabled.

---

## 6. Data Requirements (high-level — see Architecture doc for schema)
- User, Session/Result, Achievement, Passage, SentenceItem, EmailPrompt, JobAlertSubscription entities.
- All user-generated performance data must be exportable/deletable per NFR/FR-1.5.

# Product Requirements Document (PRD)
## SUVNKR Practice Hub

**Owner:** Shuvankar Debnath (SUVNKR)
**Status:** Draft v1.0
**Last updated:** 2026-07-29

---

## 1. Summary

SUVNKR Practice Hub is an open-source, cross-platform (Web + Mobile App) skill-practice platform for competitive exam and job-readiness prep. It combines four practice modules — **Typing Practice**, **Unseen Passage Practice**, **Sentence Completion Practice**, and **Email Writing Practice** — under one account, one streak system, and one achievement/badge layer that's shareable to social media.

It is monetized via Google Ads (AdSense on web, AdMob on mobile) and a freemium unlock model (longer test durations, Blind Mode, job alerts) gated behind free account creation — not a hard paywall.

**Reference inspiration:** TCS iON exam interface (Blind Mode, Backspace Lock), your existing email-writing practice build, and typing-test products like Monkeytype / 10FastFingers, re-skinned for exam-prep audiences (TCS NQT, bank PO, SSC, campus placement drives).

---

## 2. Problem Statement

Students preparing for typing-based sections of recruitment exams (TCS NQT, IBPS, SSC, government typing tests) and email-writing/communication rounds currently rely on:
- Fragmented tools — one site for typing speed, another for email writing, none for sentence completion or unseen passages in an exam-simulated environment.
- No single account that tracks progress, streaks, or shareable proof of practice (useful for LinkedIn/resume signaling).
- No tool that replicates the *actual* exam UI quirks (Backspace Lock, Blind Mode / hidden errors) that trip students up on exam day.

**Opportunity:** Build the single destination for "typing-adjacent" exam prep, branded under SUVNKR, with a UI polished enough to build personal brand credibility alongside solving a real student problem.

---

## 3. Goals

### 3.1 Product goals
- G1: Ship a web MVP covering Typing Practice + Email Writing Practice within 8–10 weeks (reuse your existing email-writing build).
- G2: Add Unseen Passage Practice and Sentence Completion within following 4–6 weeks.
- G3: Ship companion mobile app (feature parity for core practice, minus ads-heavy dashboard) within 3 months of web MVP.
- G4: Achieve a UI/UX distinctive enough to be shareable ("look what I built" + "look what I scored") — both are brand growth loops.

### 3.2 Business goals
- Google AdSense/AdMob revenue from free-tier usage.
- Free account creation → email list → job alerts channel (secondary monetization / partnership potential later).
- Brand halo for SUVNKR / Nenzon Technologies portfolio (open-source flagship project).

### 3.3 Non-goals (v1)
- No paid subscription tier in v1 (evaluate post-launch based on usage data).
- No proctoring / anti-cheat / webcam monitoring.
- No multiplayer live-race typing (consider v2).
- No native iOS/Android written in Swift/Kotlin — cross-platform only.

---

## 4. Target Users

| Persona | Description | Primary need |
|---|---|---|
| **Placement-drive student** | Final-year engineering/college student prepping for TCS NQT, Wipro, Infosys drives | Realistic exam-simulated typing + email round practice |
| **Govt exam aspirant** | SSC/Bank PO/Clerk aspirant | Typing speed certification-style practice, sentence completion (English section) |
| **Casual improver** | Anyone wanting to raise WPM/accuracy | Fast, gamified, low-friction practice |

---

## 5. Feature Set (v1 Scope)

### 5.1 Typing Practice (from your screenshot — already scoped)
- Duration selector: 5 / 10 / 15 min free, 30 min locked behind free account.
- Toggle: **Backspace Lock** (disables delete key — simulates strict exam mode).
- Toggle: **Word Highlight** (highlights current word in passage).
- Toggle: **Blind Mode** (hides errors during test — locked behind free account; mirrors TCS iON).
- Toggle: **Auto-scroll Passage** (keeps current word in view).
- Live metrics: WPM, accuracy %, error count, time remaining.
- Post-test results screen: WPM, accuracy, error heatmap, comparison to personal best.

### 5.2 Unseen Passage Practice
- Randomized passage pool by category (general, tech, current affairs, banking/finance) tagged by difficulty.
- Two sub-modes:
  - **Read & Type** (typing accuracy on unseen text, same engine as 5.1).
  - **Read & Answer** (comprehension MCQs after typing/reading, timed).
- Passage difficulty auto-adapts based on user's rolling accuracy (optional v1.1).

### 5.3 Sentence Completion Practice
- Fill-in-the-blank / cloze-style sentences typed by the user (not multiple choice — reinforces typing + grammar).
- Categories: grammar, vocabulary-in-context, idioms, banking/SSC English patterns.
- Instant feedback per sentence + end-of-set score.

### 5.4 Email Writing Practice (carry over from your existing build)
- 300-question bank, category chips, 9-minute timer, 100-word minimum, split-flap countdown — reuse as-is, restyle to match new design system.
- Add: AI-assisted scoring rubric (structure, tone, grammar, word count) — optional Claude/Gemini API integration for feedback (flag cost implications).

### 5.5 Accounts & Auth
- Guest mode: full access to free-tier durations, no save/history.
- Free account: email/password + Social login (Google, LinkedIn, GitHub) — LinkedIn is high-value here given resume/placement audience.
- Unlocks: 30-min tests, Blind Mode, history/analytics dashboard, job alerts opt-in.

### 5.6 Achievements & Social Sharing
- Badge system: streaks (3/7/30-day), WPM milestones (40/60/80/100+ WPM), accuracy milestones, "completed all 4 modules" badges, category-mastery badges.
- Auto-generated shareable result card (image, branded SUVNKR template) for LinkedIn/Instagram/X — this is a growth loop, prioritize it.
- Public profile page (optional, opt-in) showing badge wall — soft leaderboard/social proof.

### 5.7 Job Alerts (from screenshot copy)
- v1: Simple opt-in email list per category (IT services, banking, govt) — manually curated or scraped from public sources.
- v2: Integration with a job-listing API/partner.

### 5.8 Monetization
- Google AdSense on web (non-intrusive placements: sidebar, post-result screen — never mid-test).
- Google AdMob on mobile app (banner + interstitial on result screen only, never mid-test).
- Free-account gating for premium toggles (no payment processing required in v1).

---

## 6. Out-of-scope / Future Considerations (v2+)
- Live multiplayer typing races.
- Paid "Pro" tier (ad-free + AI feedback + advanced analytics).
- Institutional/B2B dashboard (colleges tracking student cohorts).
- Localization (Hindi/regional language typing tests).

---

## 7. Success Metrics

| Metric | Target (3 months post-launch) |
|---|---|
| Registered free accounts | 1,000+ |
| Weekly active users | 300+ |
| Avg. session → shared result card rate | 8%+ |
| Web Core Web Vitals (LCP) | < 2.5s |
| Ad viewability / RPM | Baseline, track monthly |
| GitHub stars (open-source signal) | 100+ in 3 months |

---

## 8. Open Source Strategy

- License: **MIT** (maximizes adoption/brand visibility; avoid AGPL if you want easy contributor onboarding — see licensing note in Tech Stack doc).
- Public monorepo under a `SUVNKR` or `Nenzon Technologies` GitHub org.
- `CONTRIBUTING.md`, issue templates, "good first issue" labels to attract contributors — doubles as a portfolio signal for Nenzon Technologies.
- Self-hosted ad slots must be config-flagged so open-source self-hosters can disable ads/analytics (important for OSS credibility and for you to avoid ToS issues if someone reuses your AdSense keys — they'll use their own).

---

## 9. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| AdSense approval rejected for exam-prep/low-content sites early on | Launch with rich content (passage library, blog/guides) before applying; avoid ads until traffic + content threshold met |
| Scope creep across 4 modules delays launch | Ship Typing + Email Writing first (you already have both partially built) |
| Mobile app store review delays (Google Play especially with ads + login) | Start Play Console developer account + policy review early, budget 1-2 weeks buffer |
| Open-source + ads friction (self-hosters inheriting your ad revenue) | Env-var gated ad configuration, clear README disclaimer |
| AI feedback (email scoring) API cost at scale | Rate-limit free tier (e.g., 3 AI-scored attempts/day), cache common feedback patterns |

---

## 10. Milestones (high-level)

1. **M1 (Weeks 1–2):** Design system + IA finalized, repo scaffolded (see Architecture doc).
2. **M2 (Weeks 3–6):** Typing Practice + Auth + Achievements MVP (web).
3. **M3 (Weeks 7–10):** Email Writing module ported/restyled, AdSense integrated, soft launch.
4. **M4 (Weeks 11–14):** Unseen Passage + Sentence Completion modules.
5. **M5 (Weeks 15–20):** Mobile app (React Native) with feature parity, AdMob, Play Store + App Store submission.
6. **M6 (Ongoing):** Job alerts, social share loop optimization, OSS community growth.

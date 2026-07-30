# Tech Stack & Execution Plan
## SUVNKR Practice Hub

---

## 1. Tech Stack Summary

| Layer | Choice | Why |
|---|---|---|
| Monorepo tooling | Turborepo | Lightweight, fast CI caching, low config overhead for a solo/small team |
| Web frontend | React 18 + TypeScript + Vite + Tailwind CSS | Matches your existing MERN skillset; Vite is fast for dev iteration |
| Web state | Zustand + TanStack Query | Minimal boilerplate vs Redux; you don't need Redux's ceremony at this scale |
| Mobile | React Native (Expo, managed) | Shares TS logic/types with web; faster ship cycle than Flutter for this specific case since your core scoring logic can be 100% reused |
| Backend | Node.js + Express + TypeScript | Directly matches your MERN background (NoteLoom, AquaGlass) |
| Database | MongoDB Atlas | Same as your existing projects; flexible schema fits content banks |
| Cache/Queue | Redis (Upstash) + BullMQ | Cheap, simple background job handling for achievements/emails |
| Auth | Passport.js (Google/LinkedIn/GitHub OAuth) + JWT | Standard, well-documented, OSS-friendly |
| Ads (web) | Google AdSense | Requested explicitly |
| Ads (mobile) | Google AdMob (`react-native-google-mobile-ads`) | Standard RN/Expo integration |
| Email | Resend (or AWS SES) | Transactional emails for job alerts, verification |
| Hosting (web) | Vercel | Free tier, PR previews, zero-config React deploys |
| Hosting (API) | Render or Railway → AWS/GCP later | Cheap start, easy container deploys |
| Mobile build/release | Expo EAS Build + Submit | Handles Play Store & App Store binaries |
| CI/CD | GitHub Actions | Free for public OSS repos |
| Error monitoring | Sentry | Free tier covers early-stage volume |
| Analytics | GA4 (web) + Firebase Analytics (mobile), or Plausible for a more OSS-aligned option | |
| Optional AI feedback | Claude API or Gemini API (email-writing rubric scoring) | You already integrate LLM/Gemini APIs (per your profile) |

---

## 2. Why not Flutter for mobile?
You used Flutter for AquaGlass, and it's a fine choice generally — but for *this specific product*, the deciding factor is code-sharing: your core WPM/accuracy/timer logic, validation schemas, and API types can be written once in TypeScript and imported unmodified by both the React web app and a React Native mobile app. Flutter (Dart) can't share that TypeScript code, meaning you'd hand-port and independently maintain the scoring engine twice — risky for a product where scoring correctness is the whole trust model (SRS NFR-16). If you already have strong Flutter velocity and are willing to maintain a Dart port of the engine in parallel, Flutter remains viable — but React Native is the lower-risk default here.

---

## 3. Licensing Note (Open Source)
- **MIT License** recommended: permissive, widely trusted, maximizes contributor and adopter comfort — good for portfolio/brand visibility goals.
- Avoid AGPL/GPL unless you specifically want to prevent closed-source forks — likely unnecessary friction for a personal-brand-driven OSS project where the goal is visibility, not protecting a business model (the business model here is ads + brand, not the code itself).
- Add a `SECURITY.md` (how to report vulnerabilities) — good practice given the project handles auth/user data.

---

## 4. Suggested Repo Setup Checklist
- [ ] Create GitHub org or use personal account; repo name e.g. `suvnkr-practice-hub`
- [ ] Turborepo scaffold: `npx create-turbo@latest`
- [ ] `apps/web` — Vite + React + TS template
- [ ] `apps/mobile` — `npx create-expo-app` with TS template
- [ ] `apps/api` — Express + TS starter
- [ ] `packages/core-engine`, `packages/types`, `packages/ui-kit`, `packages/config`
- [ ] `.env.example` at root and per-app
- [ ] `README.md` (project pitch, screenshots, setup instructions, contribution link)
- [ ] `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `LICENSE` (MIT), `SECURITY.md`
- [ ] GitHub Actions: `lint.yml`, `typecheck.yml`, `test.yml`, `deploy-web.yml`
- [ ] Issue templates + PR template
- [ ] Set up MongoDB Atlas free cluster + Upstash Redis free instance
- [ ] Register OAuth apps (Google Cloud Console, LinkedIn Developer, GitHub OAuth App) — separate dev/prod credentials
- [ ] Apply for Google AdSense **after** you have real content + traffic (passage library, a few blog posts on exam-prep tips) — cold applications with no content are commonly rejected
- [ ] Register Google Play Console (~one-time fee) + Apple Developer account (~$99/yr) when mobile nears release

---

## 5. Execution Roadmap (maps to PRD §10 milestones)

### Phase 0 — Foundation (Weeks 1–2)
- Finalize design system (colors, type scale, component library) — your existing dark theme from the screenshot is a strong starting point; formalize it as Tailwind config tokens.
- Scaffold monorepo, CI, deploy pipelines (deploy an empty "Hello SUVNKR" page to Vercel + Render on day 1 to validate the pipeline early).

### Phase 1 — Typing Practice + Auth MVP (Weeks 3–6)
- Build `core-engine` (WPM/accuracy/timer) as pure, unit-tested TS — this is the highest-leverage code in the whole product, get it right first.
- Build Typing Practice UI (durations, 4 toggles, live metrics) per your screenshot.
- Auth: email/password + Google OAuth first (LinkedIn/GitHub can follow — Google covers the widest user base fastest).
- Achievement engine v1 (a handful of badges) + shareable result card v1.

### Phase 2 — Email Writing Port + Monetization (Weeks 7–10)
- Port your existing email-writing practice build into the new design system/monorepo.
- Add AdSense (post-content-buildout, see checklist above).
- Soft launch: share on LinkedIn/X under SUVNKR, gather first real users, collect feedback.

### Phase 3 — Unseen Passage + Sentence Completion (Weeks 11–14)
- Build content bank (passages, sentence items) — consider crowd-sourcing via OSS contributions once repo has traction.
- Ship both modules, extend achievement engine.

### Phase 4 — Mobile App (Weeks 15–20)
- Expo app reusing `core-engine`/`types`/API.
- AdMob integration, share-sheet integration.
- Play Store + App Store submission (budget review-cycle time, especially first submission).

### Phase 5 — Growth Loop Hardening (Ongoing)
- Optimize the shareable result-card design — this is your primary organic growth channel; A/B test copy/visuals.
- Job alerts v1 (manually curated digest).
- Start accepting OSS contributions (label good-first-issues once core architecture is stable).

---

## 6. Solo-Founder Sequencing Advice
Given you're building this alongside Nenzon Technologies, IEMRF work, and academics: ship **Phase 1 + 2 (web only, typing + email writing)** as a real, live, ad-free-until-content-ready product before touching mobile or the remaining two modules. This mirrors your PRD milestones and avoids the common trap of building all four modules before anyone has used any of them.

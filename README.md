# Harshvardhan Kumar Nimesh — Portfolio

An animated developer portfolio built around one idea:

> **Enter my universe and see how I observe problems, reason through them, make
> engineering decisions, and build.**

The site has two ways in. **Explore Mode** is an interactive 3D solar system —
the Sun is me, the planets are projects, skills are constellations. **Recruiter
Mode** is a fast, low-animation layout that exposes everything in a scroll. Both
render the same content; a header toggle (persisted to `localStorage`) switches
between them, and visitors with `prefers-reduced-motion` land in Recruiter Mode
by default.

Live: deploys from `main` to Vercel.

---

## Stack

| Area          | Choice                                                                                                                |
| ------------- | --------------------------------------------------------------------------------------------------------------------- |
| Framework     | **Next.js 16** (App Router, Turbopack)                                                                                |
| UI            | **React 19**, **TypeScript**, **Tailwind CSS v4**                                                                     |
| 3D            | **three.js** via **@react-three/fiber** + **drei** + **postprocessing** (Explore Mode only, code-split, `ssr: false`) |
| Animation     | **Motion** (`motion/react`), `prefers-reduced-motion` aware                                                           |
| Content       | **Zod** schemas parsed at module load — a malformed case study fails `next build`                                     |
| AI scheduling | **@anthropic-ai/sdk** (Claude Sonnet + Haiku), Node route handlers                                                    |
| Rate limiting | **@upstash/ratelimit** + Redis (optional; no-op without env)                                                          |
| Email         | **Resend** REST API (optional)                                                                                        |
| Hosting       | **Vercel**                                                                                                            |

Target mix, per the project plan: ~80% conventional React/Next UI, ~20% 3D — the
site never sacrifices usability for effects.

---

## Getting started

```bash
npm install
cp .env.example .env.local     # then fill in values (see below)
npm run dev                    # http://localhost:3000
```

| Script                 | Purpose                    |
| ---------------------- | -------------------------- |
| `npm run dev`          | Dev server (Turbopack)     |
| `npm run build`        | Production build           |
| `npm run start`        | Serve the production build |
| `npm run lint`         | ESLint                     |
| `npm run typecheck`    | `tsc --noEmit`             |
| `npm run format`       | Prettier write             |
| `npm run format:check` | Prettier check             |

### Environment variables

| Variable                                              | Required                     | Notes                                                                                                                                             |
| ----------------------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                                | Recommended                  | Absolute site URL, no trailing slash. Drives metadata, Open Graph, canonical URLs, `sitemap.xml`, `robots.txt`. Falls back to a default if empty. |
| `ANTHROPIC_API_KEY`                                   | For the scheduler            | Without it, `/api/schedule` returns a graceful `503` and the rest of the Contact page still works.                                                |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Strongly recommended in prod | IP rate limiting for the public AI endpoints. Without both, limiting is a no-op. Free tier at upstash.com.                                        |
| `RESEND_API_KEY`                                      | Optional                     | Sends the booking notification email. Without it, a confirmed booking is logged server-side and the visitor still gets calendar links.            |
| `SCHEDULE_NOTIFY_EMAIL`                               | Optional                     | Where booking emails go. Defaults to `siteConfig.email`.                                                                                          |
| `SCHEDULE_FROM_EMAIL`                                 | Optional                     | `From:` for booking emails. Must be on a Resend-verified domain; the default `onboarding@resend.dev` only delivers to the Resend account owner.   |

`.env.local` is git-ignored. Never commit a real key.

---

## Project structure

```
src/
  app/
    page.tsx                  Home — renders Explore or Recruiter home by mode
    about/ experience/ skills/ resume/ contact/    static pages
    projects/page.tsx         project index
    projects/[slug]/page.tsx  case study (SSG via generateStaticParams)
    api/schedule/route.ts         scheduling chat endpoint (Claude)
    api/schedule/confirm/route.ts booking confirm + email-domain check + notify
    layout.tsx                metadata, JSON-LD Person, skip link, header/footer
    opengraph-image.tsx  icon.tsx  manifest.ts  sitemap.ts  robots.ts

  components/
    site-header.tsx           nav + Explore/Recruiter toggle (routes home on switch)
    mode/mode-provider.tsx    mode context, localStorage, reduced-motion default
    home/                     recruiter-home, home-experience (mode switch)
    universe/                 3D scene: sun, planet, scene-extras, opening-sequence,
                              universe-scene, universe-home, mobile-universe, loader
    skills/                   constellation-map (SVG), constellation-list, skill-detail
    contact/scheduler.tsx     the AI scheduling assistant UI
    project-embed.tsx         click-to-load <iframe> of a project's live app
    case-study.tsx            renders the case-study body
    <primitives>              container, button-link, badge, reveal, starfield, …

  content/                    all copy lives here, Zod-validated
    schema.ts                 project / experience / skill / constellation schemas
    projects.ts               case studies
    experience.ts             experience "journey" stages
    skills.ts                 skills as constellations + cross-links
    certificates.ts           empty by design (see below)
    scheduling.ts             availability config for the scheduler  ← edit this
    index.ts                  parses everything; a violation fails the build

  lib/
    site.ts                   identity, links, nav — single source of truth
    universe.ts               planet layout math
    constellations.ts         constellation layout math (SVG geometry)
    scheduling/slots.ts       deterministic slot engine (timezone/DST-safe, no deps)
    scheduling/types.ts       shared scheduling types
    ratelimit.ts              Upstash limiters + helpers (no-op without env)
    use-media.ts              SSR-safe matchMedia hooks
    utils.ts / motion.ts / assets.ts
```

---

## Content model

Everything a visitor reads comes from `src/content/*` and is validated by Zod in
`src/content/index.ts` **at module load** — an incomplete case study or a bad
slug throws during `next build` rather than shipping.

### Projects (`content/projects.ts`)

Each project's `caseStudy` follows the plan's structure:

```
Problem → Observation → Question → User Need → Constraints → Options →
Decision → Architecture → Challenges → Code Decisions → Before/After →
What I Learned
```

`challenges`, `codeDecisions`, and `beforeAfter` are optional arrays — fill them
in for the strongest projects. `featured: true` surfaces a project on the home
page and as a planet in the universe. `embedDemo` (a URL) renders a
click-to-load `<iframe>` of the live app on the case-study page — currently
enabled for ScheduleAI.

### Experience, Skills, Certificates

- `experience.ts` — stages in a "journey", each with what it changed about how I work.
- `skills.ts` — five constellations; every skill links to the project slugs that prove it.
- `certificates.ts` — **intentionally empty.** The universe's asteroid belt is a
  decorative "Additional learning" band. Add real entries and the belt becomes
  interactive (name, issuer, date, related skills, credential link).

---

## The AI scheduling assistant

On the Contact page. A recruiter talks through a time in a couple of lines
instead of an email thread; the assistant reads their preferred day/time and
shows real open slots to pick and confirm.

### Design — the model interprets, the engine decides

```
recruiter message
  → POST /api/schedule
      Claude turns the message into structured constraints
      { preferredDays, timeOfDay, earliestDate, durationMin, theirTimezone }
      + a short reply. It never states or invents a time.
  → deterministic engine (lib/scheduling/slots.ts)
      generates every real slot from availability + lead time,
      filters by the constraints, widens gracefully if nothing matches
  → UI shows the reply + slot buttons
  → recruiter picks a slot, enters full name + email (phone optional)
  → POST /api/schedule/confirm
      re-derives the slot (a stale or tampered time is rejected),
      verifies the email domain can receive mail (MX / A record),
      emails Harshvardhan (Resend) or logs it, returns Google Calendar + .ics
```

The correctness guarantee — every offered slot is provably inside stated
availability and lead time — comes from the engine, not the model. Same split as
the [ScheduleAI](https://github.com/harshvk8/ScheduleAi) project it's modelled on.

### Availability — `src/content/scheduling.ts`

The single source of truth. Edit `weekly` (windows you're _free_, `day` 0–6),
`durationsMin`, `slotStepMin`, `leadTimeHours`, `horizonDays`, `blackoutDates`,
and free-text `notes`. Anything not covered is treated as busy. A plain-English
summary of this config is fed to the model so it can answer "what about
Thursday?" and say you're booked when a day has no window.

### Cost & abuse controls

| Layer           | Behavior                                                                                                                                      |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Profanity regex | Warns with **no model call at all**                                                                                                           |
| Haiku triage    | Every turn is classified on Claude Haiku first — an off-topic message **never reaches Sonnet**                                                |
| Escalation      | Once a visitor is warned, the full pass also runs on Haiku                                                                                    |
| 2-strike cutoff | Two off-topic warnings (counted from the transcript, so the client can't reset them) → the server closes the chat and stops calling any model |
| Rate limits     | Upstash: 8 messages / 5 min, 40 / day, 3 confirms / day per IP                                                                                |
| Input caps      | Last 12 turns, 600 chars each                                                                                                                 |

### Model choice

Claude **Sonnet** for the recruiter-facing scheduling pass (fast, strong
instruction-following, short action-oriented replies). Claude **Haiku** for
triage and for flagged conversations.

---

## SEO, metadata, accessibility

- Per-page `title` / `description`, `metadataBase`, Open Graph + Twitter cards,
  generated `opengraph-image`, `icon`, `manifest`, `sitemap.ts`, `robots.ts`.
- JSON-LD `Person` in the root layout.
- Skip-to-content link, semantic landmarks, `sr-only` labels on icon controls,
  visible focus styles.
- `prefers-reduced-motion`: the opening sequence auto-skips, orbits calm, and the
  default mode becomes Recruiter.

---

## Branching & deployment

- **`main`** — production. Auto-deploys to Vercel.
- **`dev`** — active development.
- Optional `feature/*` branches from `dev`.

Flow: `dev → build → test → verify → merge to main (--no-ff) → production`.

---

## Roadmap

1. **Phase 1 — Make it work.** ✅ Complete professional portfolio: Home, About,
   Projects + case studies, Experience, Skills, Resume, Contact. Responsive,
   deployed.
2. **Phase 2 — Make it memorable.** ✅ Interactive universe (Sun, project planets,
   zoom transitions, skills constellations, experience journey, mobile layout)
   and Recruiter Mode. Certificate belt is decorative until `certificates.ts` has
   entries.
3. **Phase 3 — Show how I think.** 🚧 AI scheduling assistant ✅. Remaining:
   deepen the strongest case studies (code reasoning, before/after, "what I'd do
   differently"), visual architecture diagrams, a performance + accessibility
   pass, and a custom domain.

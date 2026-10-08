# Harshvardhan Kumar Nimesh — Portfolio

> Enter my universe and see how I observe problems, reason through them, make engineering decisions, and build.

I built this portfolio to show how I think, not just what I've made. Every project is written up as a case study that walks from the problem I noticed, through the options I weighed and the decision I made, to what I learned.

## Two ways to explore it

I designed the site with two modes, because a recruiter with two minutes and a curious visitor with twenty want different things.

- **Explore Mode** is an interactive 3D solar system. The Sun is me, the planets are my projects, and my skills are constellations.
- **Recruiter Mode** is a fast, low-animation layout that puts everything in a single scroll.

Both modes render the same content. A toggle in the header switches between them and remembers my choice in `localStorage`. If a visitor has `prefers-reduced-motion` turned on, the site opens in Recruiter Mode by default.

I held myself to roughly 80% conventional React/Next UI and 20% 3D. The effects should never get in the way of usability.

**Live:** deploys from `main` to Vercel.

## What I built

- A complete portfolio: Home, About, Projects with full case studies, Experience, Skills, Resume, and Contact.
- An interactive 3D universe with project planets, zoom transitions, skill constellations, an experience "journey," and a mobile layout.
- A Recruiter Mode that carries the same content without the animation.
- An **AI scheduling assistant** on the Contact page, so recruiters can book time with me in a couple of lines instead of an email thread (details below).
- SEO, metadata, and accessibility work throughout.

## Stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, TypeScript, Tailwind CSS v4 |
| 3D | three.js via `@react-three/fiber` + `drei` + `postprocessing` (Explore Mode only, code-split, `ssr: false`) |
| Animation | Motion (`motion/react`), `prefers-reduced-motion` aware |
| Content | Zod schemas parsed at module load, so a malformed case study fails `next build` |
| AI scheduling | `@anthropic-ai/sdk` (Claude Sonnet + Haiku), Node route handlers |
| Rate limiting | `@upstash/ratelimit` + Redis (optional; no-op without env) |
| Email | Resend REST API (optional) |
| Hosting | Vercel |

## Engineering decisions I'm proud of

**All content is validated at build time.** Everything a visitor reads lives in `src/content/*` and is checked by Zod when the module loads. An incomplete case study or a bad slug throws during `next build` instead of shipping broken.

**3D never blocks the page.** The scene is code-split and loaded with `ssr: false`, and it only loads in Explore Mode. Recruiter Mode never pays for it.

**The model interprets, the engine decides.** This is the core idea of the scheduling assistant, and it's the same split I used in my ScheduleAI project. See the next section.

## The AI scheduling assistant

A recruiter types something like "Thursday afternoon works for me." The assistant reads their preferred day and time, then shows real open slots they can pick and confirm.

I didn't let the model decide what's available. Claude only turns the message into structured constraints and a short reply, and it never states or invents a time. A deterministic engine generates every real slot, so each one offered is provably inside my stated availability and lead time.

```text
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
      emails me (Resend) or logs it, returns Google Calendar + .ics
```

### Availability

My availability lives in one file, `src/content/scheduling.ts`, which I edit weekly: the windows I'm free (`weekly`, days 0–6), `durationsMin`, `slotStepMin`, `leadTimeHours`, `horizonDays`, `blackoutDates`, and free-text `notes`. Anything not covered is treated as busy. A plain-English summary of this config is fed to the model so it can answer "what about Thursday?" and tell the recruiter when I'm booked.

### Keeping it cheap and abuse-resistant

Since this is a public AI endpoint, I built in several layers of protection.

| Layer | Behavior |
| --- | --- |
| Profanity regex | Warns with no model call at all |
| Haiku triage | Every turn is classified on Claude Haiku first, so an off-topic message never reaches Sonnet |
| Escalation | Once a visitor is warned, the full pass also runs on Haiku |
| 2-strike cutoff | Two off-topic warnings (counted from the transcript, so the client can't reset them) close the chat, and the server stops calling any model |
| Rate limits | Upstash: 8 messages / 5 min, 40 / day, 3 confirms / day per IP |
| Input caps | Last 12 turns, 600 chars each |

I use **Claude Sonnet** for the recruiter-facing scheduling pass because it's fast, follows instructions well, and gives short, action-oriented replies. I use **Claude Haiku** for triage and for flagged conversations.

## How each project is presented

Every project's case study follows the same structure:

```text
Problem → Observation → Question → User Need → Constraints → Options →
Decision → Architecture → Challenges → Code Decisions → Before/After →
What I Learned
```

The last three of these (challenges, code decisions, before/after) are optional, and I fill them in for my strongest projects. Projects marked `featured` appear on the home page and as planets in the universe. A project can also set `embedDemo` to render a click-to-load iframe of the live app on its case-study page. ScheduleAI uses this today.

Skills are grouped into five constellations, and every skill links to the projects that prove it. Experience is told as a journey, with each stage describing what it changed about how I work.

I left `certificates.ts` empty on purpose. The asteroid belt in the universe is a decorative "Additional learning" band for now, and it becomes interactive once I add real credentials.

## Accessibility and SEO

- Per-page titles and descriptions, `metadataBase`, Open Graph and Twitter cards, plus a generated `opengraph-image`, `icon`, `manifest`, `sitemap.ts`, and `robots.ts`.
- JSON-LD `Person` data in the root layout.
- A skip-to-content link, semantic landmarks, `sr-only` labels on icon controls, and visible focus styles.
- `prefers-reduced-motion` support: the opening sequence auto-skips, orbits calm down, and the default mode becomes Recruiter.

## Run it locally

```bash
npm install
cp .env.example .env.local   # then fill in values (see below)
npm run dev                  # http://localhost:3000
```

| Script | Purpose |
| --- | --- |
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run format` | Prettier write |
| `npm run format:check` | Prettier check |

### Environment variables

| Variable | Required | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Absolute site URL, no trailing slash. Drives metadata, Open Graph, canonical URLs, `sitemap.xml`, and `robots.txt`. Falls back to a default if empty. |
| `ANTHROPIC_API_KEY` | For the scheduler | Without it, `/api/schedule` returns a graceful 503 and the rest of the Contact page still works. |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Strongly recommended in prod | IP rate limiting for the public AI endpoints. Without both, limiting is a no-op. Free tier at [upstash.com](https://upstash.com). |
| `RESEND_API_KEY` | Optional | Sends the booking notification email. Without it, a confirmed booking is logged server-side and the visitor still gets calendar links. |
| `SCHEDULE_NOTIFY_EMAIL` | Optional | Where booking emails go. Defaults to `siteConfig.email`. |
| `SCHEDULE_FROM_EMAIL` | Optional | `From:` address for booking emails. Must be on a Resend-verified domain; the default `onboarding@resend.dev` only delivers to the Resend account owner. |

> `.env.local` is git-ignored. Never commit a real key.

## Project structure

```text
src/
  app/
    page.tsx                      Home — renders Explore or Recruiter home by mode
    about/ experience/ skills/ resume/ contact/    static pages
    projects/page.tsx             project index
    projects/[slug]/page.tsx      case study (SSG via generateStaticParams)
    api/schedule/route.ts         scheduling chat endpoint (Claude)
    api/schedule/confirm/route.ts booking confirm + email-domain check + notify
    layout.tsx                    metadata, JSON-LD Person, skip link, header/footer
    opengraph-image.tsx  icon.tsx  manifest.ts  sitemap.ts  robots.ts

  components/
    site-header.tsx               nav + Explore/Recruiter toggle (routes home on switch)
    mode/mode-provider.tsx        mode context, localStorage, reduced-motion default
    home/                         recruiter-home, home-experience (mode switch)
    universe/                     3D scene: sun, planet, scene-extras, opening-sequence,
                                  universe-scene, universe-home, mobile-universe, loader
    skills/                       constellation-map (SVG), constellation-list, skill-detail
    contact/scheduler.tsx         the AI scheduling assistant UI
    project-embed.tsx             click-to-load <iframe> of a project's live app
    case-study.tsx                renders the case-study body
    <primitives>                  container, button-link, badge, reveal, starfield, …

  content/                        all copy lives here, Zod-validated
    schema.ts                     project / experience / skill / constellation schemas
    projects.ts                   case studies
    experience.ts                 experience "journey" stages
    skills.ts                     skills as constellations + cross-links
    certificates.ts               empty by design
    scheduling.ts                 availability config for the scheduler  ← edit this
    index.ts                      parses everything; a violation fails the build

  lib/
    site.ts                       identity, links, nav — single source of truth
    universe.ts                   planet layout math
    constellations.ts             constellation layout math (SVG geometry)
    scheduling/slots.ts           deterministic slot engine (timezone/DST-safe, no deps)
    scheduling/types.ts           shared scheduling types
    ratelimit.ts                  Upstash limiters + helpers (no-op without env)
    use-media.ts                  SSR-safe matchMedia hooks
    utils.ts / motion.ts / assets.ts
```

## Branching and deployment

I work on `dev`, branch to `feature/*` when needed, and merge to `main` with `--no-ff` once a change is built, tested, and verified. `main` auto-deploys to Vercel.

## Roadmap

- [x] **Phase 1 — Make it work.** A complete professional portfolio, responsive and deployed.
- [x] **Phase 2 — Make it memorable.** The interactive universe and Recruiter Mode.
- [ ] **Phase 3 — Show how I think.** In progress.
  - [x] AI scheduling assistant
  - [ ] Deepen my strongest case studies (code reasoning, before/after, what I'd do differently)
  - [ ] Visual architecture diagrams
  - [ ] Performance and accessibility pass
  - [ ] Custom domain

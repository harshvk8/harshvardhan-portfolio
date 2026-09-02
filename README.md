# harshvardhan-portfolio

Animated developer portfolio showcasing my projects, skills, experience, and
problem-solving process.

The portfolio is built to communicate one idea: **enter my universe and see how
I observe problems, reason through them, make engineering decisions, and build.**

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** — dark, space-leaning design tokens in `src/app/globals.css`
- **Motion** — animation, `prefers-reduced-motion` aware via `<MotionConfig>`
- **Zod** — content schema, validated at build time
- Deployed on **Vercel**

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

| Script | Purpose |
| --- | --- |
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run format` | Prettier write |

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` for correct
metadata / Open Graph / sitemap URLs.

## Structure

```
src/
  app/            Routes: / about projects projects/[slug] experience skills resume contact
                  plus robots.ts, sitemap.ts, not-found.tsx
  components/     site-header, site-footer, page-shell, providers, icons
  content/        Typed content + Zod schema
    schema.ts       projectSchema / experienceSchema / skillCategorySchema
    projects.ts     case studies (PLACEHOLDER — replace in Phase 1)
    experience.ts   roles
    skills.ts       skills grouped by category, linked to project slugs
    index.ts        parses all content; a schema violation fails `next build`
  lib/            site.ts (identity + nav), utils.ts (cn), motion.ts (variants)
```

Case studies must carry the full structure the plan calls for:
**Problem → Observation → Question → User Need → Constraints → Options →
Decision → Architecture → Challenges → Code Decisions → Before/After →
What I Learned.** The Zod schema enforces it.

## Branching & deployment

- **`main`** — stable, production. Auto-deploys to Vercel.
- **`dev`** — active development. Merge to `main` once a phase is tested.
- **`feature/*`** — optional, branched from `dev` (e.g. `feature/universe`).

Flow: `dev → build → test → fix → verify → merge to main → production`.

## Roadmap

1. **Phase 1 — Make it work.** Complete, recruiter-ready professional portfolio.
   Home, About, Projects + case studies, Experience, Skills, Resume, Contact.
   Responsive, accessible, deployed.
2. **Phase 2 — Make it memorable.** Interactive universe: you as the Sun,
   projects as planets, certificates as asteroids, skills as constellations,
   zoom transitions — plus **Recruiter Mode** to skip the heavier animation.
3. **Phase 3 — Show how I think.** Deep case studies, architecture diagrams,
   selected code reasoning, an **AI scheduling assistant** (Claude Sonnet) in
   Contact, performance, SEO, custom domain, final polish.

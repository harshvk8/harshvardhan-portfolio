import { z } from "zod";

/**
 * Content schemas. Every entry in `projects.ts`, `experience.ts`, and
 * `skills.ts` is parsed against these at module load (see `index.ts`), so a
 * malformed or incomplete case study fails the build rather than shipping.
 *
 * The `caseStudy` shape intentionally mirrors the portfolio plan:
 * Problem -> Observation -> Question -> User Need -> Constraints ->
 * Options -> Decision -> Architecture -> Challenges -> Code Decisions ->
 * Before/After -> What I Learned.
 */

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be kebab-case");

export const challengeSchema = z.object({
  challenge: z.string(),
  initialApproach: z.string(),
  problem: z.string(),
  decision: z.string(),
  finalSolution: z.string(),
  result: z.string(),
});

export const codeDecisionSchema = z.object({
  title: z.string(),
  language: z.string().default("ts"),
  snippet: z.string(),
  why: z.string(),
});

export const beforeAfterSchema = z.object({
  aspect: z.string(),
  before: z.string(),
  after: z.string(),
  reason: z.string(),
});

export const caseStudySchema = z.object({
  problem: z.string(),
  observation: z.string(),
  question: z.string(),
  userNeed: z.string(),
  constraints: z.array(z.string()).min(1),
  options: z.array(z.object({ option: z.string(), tradeoff: z.string() })).min(1),
  decision: z.string(),
  architecture: z.string(),
  challenges: z.array(challengeSchema).default([]),
  codeDecisions: z.array(codeDecisionSchema).default([]),
  beforeAfter: z.array(beforeAfterSchema).default([]),
  learned: z.array(z.string()).min(1),
});

export const projectSchema = z.object({
  slug,
  name: z.string(),
  /** One-line problem description, not a tech summary. */
  tagline: z.string(),
  year: z.string(),
  featured: z.boolean().default(false),
  stack: z.array(z.string()).min(1),
  repo: z.string().url().optional(),
  demo: z.string().url().optional(),
  /** Path under /public, e.g. "/images/projects/foo.png". */
  cover: z.string().optional(),
  caseStudy: caseStudySchema,
});

export const experienceSchema = z.object({
  role: z.string(),
  org: z.string(),
  start: z.string(),
  end: z.string(),
  summary: z.string(),
  responsibilities: z.array(z.string()).min(1),
  /** What this experience taught me. */
  learned: z.string(),
});

export const skillSchema = z.object({
  name: z.string(),
  level: z.enum(["learning", "proficient", "strong"]).optional(),
  /** Slugs of projects where this skill was actually used. */
  projects: z.array(z.string()).default([]),
});

export const skillCategorySchema = z.object({
  category: z.string(),
  skills: z.array(skillSchema).min(1),
});

// Parsed / output types — what components consume.
export type Project = z.infer<typeof projectSchema>;
export type CaseStudy = z.infer<typeof caseStudySchema>;
export type Challenge = z.infer<typeof challengeSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type SkillCategory = z.infer<typeof skillCategorySchema>;
export type Skill = z.infer<typeof skillSchema>;

// Input types — what the content files are authored as. Fields with a
// schema `.default([])` are optional here (e.g. a project with no
// challenges/beforeAfter yet).
export type ProjectInput = z.input<typeof projectSchema>;
export type ExperienceInput = z.input<typeof experienceSchema>;
export type SkillCategoryInput = z.input<typeof skillCategorySchema>;

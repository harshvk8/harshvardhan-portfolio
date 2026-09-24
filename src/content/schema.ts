import { z } from "zod";

/**
 * Content schemas. Every entry in `projects.ts`, `experience.ts`, and
 * `skills.ts` is parsed against these at module load (see `index.ts`), so a
 * malformed or incomplete case study fails the build rather than shipping.
 *
 * Case studies keep the overview, contributions, decisions, and lessons short.
 * Architecture and code examples are optional details readers can expand.
 */

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be kebab-case");

export const codeDecisionSchema = z.object({
  title: z.string(),
  language: z.string().default("ts"),
  snippet: z.string(),
  why: z.string(),
});

export const caseStudySchema = z.object({
  overview: z.string().min(1),
  contributions: z.array(z.string().min(1)).min(1),
  decisions: z.array(z.string().min(1)).min(1),
  architecture: z.string().optional(),
  codeDecisions: z.array(codeDecisionSchema).default([]),
  learned: z.array(z.string().min(1)).min(1),
});

export const projectSchema = z.object({
  slug,
  name: z.string(),
  /** One-sentence summary of what the project does. */
  tagline: z.string(),
  year: z.string(),
  featured: z.boolean().default(false),
  stack: z.array(z.string()).min(1),
  repo: z.string().url().optional(),
  demo: z.string().url().optional(),
  /**
   * When set, the case-study page embeds the live app in an iframe so a
   * visitor can try it in place. Must be the same origin as `demo` (or
   * `demo` itself). Use only for apps that allow being framed.
   */
  embedDemo: z.string().url().optional(),
  /** Path under /public, e.g. "/images/projects/foo.png". */
  cover: z.string().optional(),
  caseStudy: caseStudySchema,
});

/**
 * A stage in the experience "journey" — a place that changed how I work,
 * not just a résumé row. `kind: "projects"` is the builder stage (no job
 * title); everything else is a real role.
 */
export const experienceSchema = z.object({
  org: z.string(),
  role: z.string().optional(),
  period: z.string(),
  kind: z.enum(["work", "projects"]).default("work"),
  /** one- or two-word theme, e.g. "People + operations" */
  theme: z.string(),
  /** what I developed there */
  developed: z.array(z.string()).min(1),
  /** the story, first person */
  story: z.string(),
  /** project slugs, for the builder stage */
  projects: z.array(z.string()).default([]),
});

// --- Skills: five constellations, evidence not percentages ---

export const skillSize = z.enum(["xl", "lg", "md", "sm"]);

export const skillSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string(),
  size: skillSize,
  /** constellation anchor star */
  anchor: z.boolean().default(false),
  /** "Used in / for" lines — concrete, not proficiency claims */
  evidence: z.array(z.string()).min(1),
  /** project slugs to link from the detail card */
  projects: z.array(z.string()).default([]),
});

export const constellationSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string(),
  /** the largest / central constellation */
  primary: z.boolean().default(false),
  /** relative visual scale (C5 is smaller) */
  scale: z.number().default(1),
  description: z.string(),
  skills: z.array(skillSchema).min(1),
});

/** cross-constellation connecting paths, by skill id */
export const skillConnectionSchema = z.tuple([z.string(), z.string()]);

// Parsed / output types — what components consume.
export type Project = z.infer<typeof projectSchema>;
export type CaseStudy = z.infer<typeof caseStudySchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Skill = z.infer<typeof skillSchema>;
export type Constellation = z.infer<typeof constellationSchema>;
export type SkillConnection = z.infer<typeof skillConnectionSchema>;

// Input types — what the content files are authored as.
export type ProjectInput = z.input<typeof projectSchema>;
export type ExperienceInput = z.input<typeof experienceSchema>;
export type ConstellationInput = z.input<typeof constellationSchema>;

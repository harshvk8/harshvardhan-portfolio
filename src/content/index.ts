import { z } from "zod";
import { experienceSchema, projectSchema, skillCategorySchema } from "./schema";
import { projectsData } from "./projects";
import { experienceData } from "./experience";
import { skillsData } from "./skills";

/**
 * Parse content once, at module load. Any schema violation throws here and
 * fails `next build` — the structure is enforced, not merely encouraged.
 */
export const projects = z.array(projectSchema).parse(projectsData);
export const experience = z.array(experienceSchema).parse(experienceData);
export const skills = z.array(skillCategorySchema).parse(skillsData);

export const featuredProjects = projects.filter((p) => p.featured);

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

/** Previous / next project in list order, wrapping around, for case-study nav. */
export function getAdjacentProjects(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  if (i === -1) return { prev: undefined, next: undefined };
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];
  return {
    prev: prev.slug === slug ? undefined : prev,
    next: next.slug === slug ? undefined : next,
  };
}

/** Projects that list `skillName` in their stack, for the Skills screen. */
export function projectsForSkill(slugs: readonly string[]) {
  return projects.filter((p) => slugs.includes(p.slug));
}

export type { Project, CaseStudy, Challenge, Experience, SkillCategory, Skill } from "./schema";

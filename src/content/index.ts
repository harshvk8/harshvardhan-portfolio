import { z } from "zod";
import { constellationSchema, experienceSchema, projectSchema } from "./schema";
import { projectsData } from "./projects";
import { experienceData } from "./experience";
import { constellationsData, skillConnections } from "./skills";

/**
 * Parse content once, at module load. Any schema violation throws here and
 * fails `next build` — the structure is enforced, not merely encouraged.
 */
export const projects = z.array(projectSchema).parse(projectsData);
export const experience = z.array(experienceSchema).parse(experienceData);
export const constellations = z.array(constellationSchema).parse(constellationsData);

export { skillConnections };

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

// --- skills helpers ---

export const allSkills = constellations.flatMap((c) =>
  c.skills.map((s) => ({ ...s, constellationId: c.id, constellationName: c.name })),
);

export function getSkill(id: string) {
  return allSkills.find((s) => s.id === id);
}

export { certificates } from "./certificates";
export type { Certificate } from "./certificates";

export type {
  Project,
  CaseStudy,
  Challenge,
  Experience,
  Skill,
  Constellation,
  SkillConnection,
} from "./schema";

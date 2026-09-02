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

export type { Project, Experience, SkillCategory, Skill } from "./schema";

import type { SkillCategoryInput } from "./schema";

/**
 * PLACEHOLDER CONTENT — replace in Phase 1 (Screen 12).
 * `projects` holds slugs from `projects.ts` so each skill links to evidence.
 */
export const skillsData: SkillCategoryInput[] = [
  {
    category: "Languages",
    skills: [
      { name: "Dart", level: "strong", projects: ["example-project"] },
      { name: "TypeScript", level: "proficient", projects: ["second-example"] },
      { name: "Python", level: "proficient", projects: [] },
    ],
  },
  {
    category: "Mobile Development",
    skills: [{ name: "Flutter", level: "strong", projects: ["example-project"] }],
  },
  {
    category: "Frontend",
    skills: [
      { name: "React", level: "proficient", projects: ["second-example"] },
      { name: "Next.js", level: "proficient", projects: ["second-example"] },
    ],
  },
  {
    category: "Backend / Cloud",
    skills: [
      { name: "Firebase", level: "proficient", projects: ["example-project"] },
      { name: "PostgreSQL", level: "learning", projects: ["second-example"] },
    ],
  },
  {
    category: "Development Tools",
    skills: [
      { name: "Git", level: "proficient", projects: [] },
      { name: "Vercel", level: "proficient", projects: [] },
    ],
  },
];

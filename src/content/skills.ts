import type { SkillCategoryInput } from "./schema";

/**
 * PLACEHOLDER CONTENT — replace in Phase 1 (Screen 12).
 * `projects` holds slugs from `projects.ts`, so each skill links to the
 * projects where it was actually used.
 */
export const skillsData: SkillCategoryInput[] = [
  {
    category: "Languages",
    skills: [
      { name: "Dart", level: "strong", projects: ["campus-marketplace", "budget-lens"] },
      { name: "TypeScript", level: "strong", projects: ["shift-swap", "readfast"] },
      { name: "JavaScript", level: "strong", projects: ["shift-swap", "readfast"] },
      { name: "Python", level: "proficient", projects: [] },
      { name: "SQL", level: "proficient", projects: ["shift-swap", "budget-lens"] },
    ],
  },
  {
    category: "Mobile Development",
    skills: [
      { name: "Flutter", level: "strong", projects: ["campus-marketplace", "budget-lens"] },
      { name: "SQLite", level: "proficient", projects: ["budget-lens"] },
    ],
  },
  {
    category: "Frontend",
    skills: [
      { name: "React", level: "strong", projects: ["shift-swap", "readfast"] },
      { name: "Next.js", level: "proficient", projects: ["shift-swap"] },
      { name: "Tailwind CSS", level: "proficient", projects: ["shift-swap"] },
      { name: "IndexedDB", level: "proficient", projects: ["readfast"] },
    ],
  },
  {
    category: "Backend / Cloud",
    skills: [
      { name: "Firebase", level: "strong", projects: ["campus-marketplace"] },
      { name: "Cloud Functions", level: "proficient", projects: ["campus-marketplace"] },
      { name: "PostgreSQL", level: "proficient", projects: ["shift-swap"] },
      { name: "Prisma", level: "proficient", projects: ["shift-swap"] },
    ],
  },
  {
    category: "Development Tools",
    skills: [
      { name: "Git", level: "strong", projects: [] },
      { name: "Vercel", level: "proficient", projects: ["shift-swap"] },
      { name: "Vite", level: "proficient", projects: ["readfast"] },
    ],
  },
];

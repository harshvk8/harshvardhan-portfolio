import type { SkillCategoryInput } from "./schema";

/**
 * From the résumé's skills list + the project stacks. `projects` holds slugs
 * from projects.ts so each skill links to where it was actually used.
 * Levels are a guess — adjust to what's true for you.
 */
export const skillsData: SkillCategoryInput[] = [
  {
    category: "Languages",
    skills: [
      {
        name: "Kotlin",
        level: "strong",
        projects: ["red-hawk-wallet-android", "today-only-todo"],
      },
      { name: "TypeScript", level: "strong", projects: ["scheduleai"] },
      { name: "JavaScript", level: "strong", projects: ["scheduleai"] },
      { name: "Java", level: "proficient", projects: [] },
      { name: "Dart", level: "learning", projects: ["red-hawk-wallet-flutter"] },
      { name: "Python", level: "proficient", projects: [] },
      { name: "C", level: "proficient", projects: [] },
      { name: "Go", level: "learning", projects: ["goplus-research"] },
      { name: "PHP", level: "learning", projects: [] },
      { name: "SQL", level: "proficient", projects: [] },
      { name: "HTML", level: "strong", projects: ["scheduleai"] },
      { name: "CSS / SCSS", level: "strong", projects: ["scheduleai"] },
    ],
  },
  {
    category: "Mobile Development",
    skills: [
      {
        name: "Jetpack Compose",
        level: "strong",
        projects: ["red-hawk-wallet-android", "today-only-todo"],
      },
      {
        name: "Android SDK",
        level: "proficient",
        projects: ["red-hawk-wallet-android", "today-only-todo"],
      },
      { name: "Flutter", level: "learning", projects: ["red-hawk-wallet-flutter"] },
      { name: "React Native", level: "proficient", projects: [] },
      { name: "Expo", level: "proficient", projects: [] },
    ],
  },
  {
    category: "Frontend",
    skills: [
      { name: "React", level: "strong", projects: ["scheduleai"] },
      { name: "Next.js", level: "proficient", projects: ["scheduleai"] },
      { name: "Tailwind CSS", level: "proficient", projects: ["scheduleai"] },
      { name: "NativeWind", level: "proficient", projects: [] },
    ],
  },
  {
    category: "Backend / Cloud",
    skills: [
      {
        name: "Firebase",
        level: "strong",
        projects: ["red-hawk-wallet-android", "red-hawk-wallet-flutter"],
      },
      {
        name: "Firestore",
        level: "strong",
        projects: ["red-hawk-wallet-android", "red-hawk-wallet-flutter"],
      },
      {
        name: "Firebase Auth",
        level: "proficient",
        projects: ["red-hawk-wallet-android", "red-hawk-wallet-flutter"],
      },
      { name: "Node.js", level: "proficient", projects: ["scheduleai"] },
      { name: "Flask", level: "proficient", projects: [] },
      { name: "MySQL", level: "proficient", projects: [] },
      { name: "AWS", level: "learning", projects: [] },
    ],
  },
  {
    category: "Tools",
    skills: [
      {
        name: "Git & GitHub",
        level: "strong",
        projects: ["red-hawk-wallet-android", "scheduleai"],
      },
      {
        name: "Android Studio",
        level: "strong",
        projects: ["red-hawk-wallet-android", "today-only-todo"],
      },
      { name: "VS Code", level: "strong", projects: ["scheduleai"] },
      { name: "Vercel", level: "proficient", projects: ["scheduleai"] },
      { name: "Linux terminal", level: "proficient", projects: [] },
      { name: "Jupyter Notebook", level: "proficient", projects: [] },
      { name: "cPanel", level: "proficient", projects: [] },
    ],
  },
];

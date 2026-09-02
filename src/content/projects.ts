import type { ProjectInput } from "./schema";

/**
 * PLACEHOLDER CONTENT — replace in Phase 1 (Screens 4–10).
 * Keep the structure; every project must fill the full case study.
 * The array is validated against `projectSchema` in `index.ts` at load time.
 */
export const projectsData: ProjectInput[] = [
  {
    slug: "example-project",
    name: "Example Project",
    tagline: "People kept losing track of X, and the existing tools ignored Y.",
    year: "2025",
    featured: true,
    stack: ["Flutter", "Dart", "Firebase"],
    repo: "https://github.com/harshvk8/example-project",
    caseStudy: {
      problem:
        "Describe the real-world problem that made this project worth building — start with the reason it exists, not the tech.",
      observation: "What did I actually notice happening?",
      question: "What question made me think a software solution might help?",
      userNeed: "Who has this problem and what do they actually need?",
      constraints: [
        "Small team and limited development time",
        "Needs role-based access (e.g. student vs admin)",
        "Low/zero hosting budget for the MVP",
      ],
      options: [
        {
          option: "Build a custom backend with Node + Postgres",
          tradeoff: "Full control, but slow to stand up auth/storage for an MVP",
        },
        {
          option: "Use Firebase (auth + Firestore + storage)",
          tradeoff: "Fast to integrate, but vendor lock-in and query limits",
        },
      ],
      decision:
        "I chose Firebase for the MVP because auth, database, and storage integrate quickly while keeping the architecture manageable for a small team.",
      architecture:
        "Auth -> User -> role (Student | Vendor | Administrator) -> role-specific features and permissions. Replace with a real diagram in Phase 3.",
      challenges: [
        {
          challenge: "Something that did not work immediately",
          initialApproach: "What I tried first",
          problem: "Why that approach broke down",
          decision: "What I decided to change",
          finalSolution: "What I ended up doing",
          result: "What became better as a result",
        },
      ],
      codeDecisions: [
        {
          title: "Why the data layer is wrapped in a repository",
          language: "ts",
          snippet: "// small, meaningful snippet only — link to the full repo for the rest",
          why: "Explain the engineering reason for this shape and the tradeoff it makes.",
        },
      ],
      beforeAfter: [
        {
          aspect: "Onboarding flow",
          before: "Initial version behaviour",
          after: "Current version behaviour",
          reason: "What feedback or problem caused the change",
        },
      ],
      learned: ["What changed in how I think about building software after this project."],
    },
  },
  {
    slug: "second-example",
    name: "Second Example",
    tagline: "A one-line description of the problem this one solves.",
    year: "2024",
    featured: true,
    stack: ["Next.js", "TypeScript", "PostgreSQL"],
    caseStudy: {
      problem: "The reason this project exists.",
      observation: "What I noticed.",
      question: "The question that started it.",
      userNeed: "Who needs this and why.",
      constraints: ["Constraint one", "Constraint two"],
      options: [
        { option: "Option A", tradeoff: "Tradeoff A" },
        { option: "Option B", tradeoff: "Tradeoff B" },
      ],
      decision: "What I chose and why.",
      architecture: "How the pieces relate.",
      learned: ["What this project taught me."],
    },
  },
];

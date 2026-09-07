import type { ExperienceInput } from "./schema";

/**
 * Experience as a journey through environments that changed how I work —
 * ordered thematically toward "builder", not as a strict résumé timeline.
 */
export const experienceData: ExperienceInput[] = [
  {
    org: "ShopRite",
    role: "CGO Coordinator",
    period: "Oct 2024 – Present",
    kind: "work",
    theme: "People + operations",
    developed: [
      "Communication",
      "Customer service",
      "Team collaboration",
      "Problem solving",
      "Attention to operational detail",
    ],
    story:
      "Working in a fast-moving retail environment taught me how to communicate with different people, handle multiple priorities, and solve problems while operations continue around me.",
  },
  {
    org: "Handshake AI — Project Hedgehog",
    role: "Annotator",
    period: "Jan 2026 – Present",
    kind: "work",
    theme: "Evaluation + precision",
    developed: [
      "AI model evaluation",
      "Quality assurance",
      "Data annotation",
      "Analytical thinking",
      "Attention to detail",
    ],
    story:
      "Evaluating model responses made me more systematic about correctness, consistency, and edge cases — using defined criteria instead of assuming an output is correct because it looks plausible.",
  },
  {
    org: "Montclair State University",
    role: "IT Support Analyst",
    period: "2025 – Present",
    kind: "work",
    theme: "Systems + troubleshooting",
    developed: [
      "Troubleshooting",
      "Technical support",
      "Information technology",
      "Networking",
      "Problem solving",
      "Communication",
    ],
    story:
      "IT support taught me to diagnose problems from incomplete information, communicate technical steps to non-technical users, and tell symptoms apart from the actual cause of a problem.",
  },
  {
    org: "Software & Research Projects",
    period: "2024 – Present",
    kind: "projects",
    theme: "Builder",
    developed: [
      "System design",
      "Architectural decisions",
      "Full-stack and mobile development",
      "Working from a problem, not a spec",
    ],
    story:
      "Moving from solving individual technical problems to designing complete systems — choosing the data model, the trust boundary, the platform — and living with those decisions as the projects grew.",
    projects: [
      "red-hawk-wallet-flutter",
      "red-hawk-wallet-android",
      "scheduleai",
      "goplus-research",
    ],
  },
];

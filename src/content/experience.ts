import type { ExperienceInput } from "./schema";

/** PLACEHOLDER CONTENT — replace with real roles in Phase 1 (Screen 11). */
export const experienceData: ExperienceInput[] = [
  {
    role: "IT Support (part-time)",
    org: "Organisation name", // TODO
    start: "2023",
    end: "Present",
    summary:
      "First line of support for staff across hardware, accounts, and everyday software issues.",
    responsibilities: [
      "Triaged and resolved day-to-day tickets, escalating the ones that needed it",
      "Wrote short self-serve guides for the three or four issues that came up most",
      "Set up and handed over new machines for incoming staff",
    ],
    learned:
      "A fix only counts if the person can understand and repeat it. Explaining the 'why' in plain language cut repeat tickets more than any tooling change.",
  },
  {
    role: "Freelance app development",
    org: "Independent", // TODO
    start: "2023",
    end: "2024",
    summary:
      "Built small Flutter apps for local clients, from first conversation to store listing.",
    responsibilities: [
      "Scoped requirements with non-technical clients and turned them into a short build plan",
      "Shipped and maintained two apps, including one revision cycle after user feedback",
      "Handled the Play Store submission and basic analytics setup",
    ],
    learned:
      "The first spec is always wrong in a useful way — shipping something small and watching it get used surfaced the real requirements faster than more planning would have.",
  },
];

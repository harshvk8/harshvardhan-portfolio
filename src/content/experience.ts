import type { ExperienceInput } from "./schema";

/** Real roles. */
export const experienceData: ExperienceInput[] = [
  {
    role: "Annotator — Project Hedgehog",
    org: "Handshake AI",
    start: "Jan 2026",
    end: "Present",
    summary: "Remote. Evaluating model responses and annotating datasets used to train ML models.",
    responsibilities: [
      "Evaluated AI model responses and annotated datasets used for machine learning model training",
      "Identified inconsistencies in model outputs to improve dataset quality and system reliability",
      "Applied structured evaluation methods to support model performance improvement",
    ],
    learned:
      "Evaluating AI responses changed the way I look at software output. I became more deliberate about edge cases, consistency, and whether a result is actually correct rather than just looking correct — and it reinforced the value of clear evaluation criteria over intuition.",
  },
  {
    role: "CGO Coordinator",
    org: "ShopRite",
    start: "Oct 2024",
    end: "Present",
    summary:
      "Managing inventory accuracy, product availability, and day-to-day store operations in a fast-paced environment.",
    responsibilities: [
      "Help manage inventory accuracy, product availability, and day-to-day store operations",
      "Investigate inventory and stocking discrepancies and coordinate with team members to keep product information accurate",
      "Balance operational responsibilities with customer-facing problem solving and shifting priorities",
    ],
    learned:
      "It taught me to catch small inconsistencies before they become larger problems, communicate with different kinds of people, and stay organized when several things need attention at once.",
  },
];

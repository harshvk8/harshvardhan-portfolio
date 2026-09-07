import type { ExperienceInput } from "./schema";

/**
 * Handshake AI is real (résumé). The second entry is a STUB — you said you
 * have another current job that isn't on the résumé. Fill in title, company,
 * dates, bullets, and the "learned" line, or delete it.
 * The "learned" line on Handshake AI is a DRAFT — make it yours.
 */
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
      "Draft: seeing where models fail up close changed how I read AI output in my own projects — the useful move is deciding what 'correct' means first and applying it the same way every time, not judging case by case.",
  },
  {
    role: "TODO: job title",
    org: "TODO: company",
    start: "TODO",
    end: "Present",
    summary: "TODO: one or two sentences on what the role involves.",
    responsibilities: ["TODO: a concrete responsibility", "TODO: another one"],
    learned: "TODO: what this role has taught you.",
  },
];

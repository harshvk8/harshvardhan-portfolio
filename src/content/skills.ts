import type { ConstellationInput, SkillConnection } from "./schema";

/**
 * Skills as five constellations. The page answers: "What can Harshvardhan
 * build with, and what evidence is there that he's actually used it?"
 * Evidence is concrete ("Used in / for …") — never a made-up percentage.
 * Software Engineering is the primary constellation; "Real-world" is
 * deliberately smaller — it supports the developer identity, not replaces it.
 */
export const constellationsData: ConstellationInput[] = [
  {
    id: "software-engineering",
    name: "Software Engineering",
    primary: true,
    scale: 1.25,
    description:
      "How I approach building software — breaking problems down, designing maintainable systems, working iteratively, and using version control throughout development.",
    skills: [
      {
        id: "software-development",
        name: "Software Development",
        size: "xl",
        anchor: true,
        evidence: [
          "End-to-end builds: Red Hawk Wallet (Android + Flutter), ScheduleAI, TodayOnlyToDo",
          "From first problem statement to shipped, iterated app",
        ],
        projects: ["red-hawk-wallet-android", "red-hawk-wallet-flutter", "scheduleai"],
      },
      {
        id: "oop",
        name: "Object-Oriented Programming",
        size: "md",
        evidence: [
          "Used in: Java and Kotlin coursework and the Red Hawk Wallet builds",
          "ScheduleAI: reusable constraint / validator types across three modes",
        ],
        projects: ["scheduleai", "red-hawk-wallet-android"],
      },
      {
        id: "problem-solving",
        name: "Problem Solving",
        size: "md",
        evidence: [
          "Choosing the money model for Red Hawk Wallet (client-side → server-side)",
          "Scoping ScheduleAI so the rules stay deterministic and the chat stays loose",
        ],
        projects: ["red-hawk-wallet-flutter", "scheduleai"],
      },
      {
        id: "analytical-thinking",
        name: "Analytical Thinking",
        size: "md",
        evidence: [
          "Go vs Go+ research: comparing language features on defined criteria",
          "Handshake AI: evaluating model output against explicit rules, not gut feel",
        ],
        projects: ["goplus-research"],
      },
      {
        id: "git",
        name: "Git",
        size: "lg",
        evidence: [
          "Feature branches, pull requests, code review, team development workflows",
          "Red Hawk Wallet: branch per feature (auth, UI, DB, QR, NFC) merged through dev + staging",
        ],
        projects: ["red-hawk-wallet-android"],
      },
      {
        id: "project-management",
        name: "Project Management",
        size: "sm",
        evidence: [
          "Led a six-person Agile team on Red Hawk Wallet: work split by feature, coordination, docs",
        ],
        projects: ["red-hawk-wallet-android"],
      },
    ],
  },

  {
    id: "languages",
    name: "Languages",
    scale: 1.1,
    description: "The languages I build in — strongest first, not all at the same depth.",
    skills: [
      {
        id: "java",
        name: "Java",
        size: "lg",
        anchor: true,
        evidence: ["OOP coursework and data-structures work", "Foundation for Kotlin / Android"],
      },
      {
        id: "kotlin",
        name: "Kotlin",
        size: "lg",
        evidence: [
          "Used in: native Android Red Hawk Wallet",
          "Jetpack Compose application development",
        ],
        projects: ["red-hawk-wallet-android"],
      },
      {
        id: "python",
        name: "Python",
        size: "lg",
        evidence: ["Scripting, data work in Jupyter / Anaconda", "Coursework and small tools"],
      },
      {
        id: "javascript",
        name: "JavaScript",
        size: "md",
        evidence: ["ScheduleAI (Next.js / React)", "This portfolio"],
        projects: ["scheduleai"],
      },
      {
        id: "typescript",
        name: "TypeScript",
        size: "md",
        evidence: [
          "ScheduleAI: typed constraint and validator model",
          "This portfolio, end to end",
        ],
        projects: ["scheduleai"],
      },
      {
        id: "sql",
        name: "SQL",
        size: "md",
        evidence: ["Relational modelling and queries in coursework", "MySQL exercises"],
      },
      { id: "c", name: "C", size: "sm", evidence: ["Systems-level coursework"] },
      {
        id: "php",
        name: "PHP",
        size: "sm",
        evidence: ["Small server-side scripts; cPanel hosting"],
      },
      {
        id: "html",
        name: "HTML",
        size: "sm",
        evidence: ["ScheduleAI and this portfolio; semantic structure"],
        projects: ["scheduleai"],
      },
      {
        id: "css-scss",
        name: "CSS / SCSS",
        size: "sm",
        evidence: ["Tailwind + custom CSS on ScheduleAI and this site"],
        projects: ["scheduleai"],
      },
    ],
  },

  {
    id: "mobile-fullstack",
    name: "Mobile & Full-Stack",
    scale: 1.1,
    description:
      "Technologies I use to take applications from UI to data, authentication, backend logic, and deployment.",
    skills: [
      {
        id: "flutter",
        name: "Flutter",
        size: "lg",
        anchor: true,
        evidence: [
          "Used in: Red Hawk Wallet (Flutter) — cross-platform iOS + Android, at MVP",
          "Mobile application development",
        ],
        projects: ["red-hawk-wallet-flutter"],
      },
      {
        id: "firebase",
        name: "Firebase",
        size: "lg",
        anchor: true,
        evidence: [
          "Used for: authentication, Firestore, Storage, role-based application data",
          "Both Red Hawk Wallet builds; Cloud Functions for the server-side money path (Flutter)",
        ],
        projects: ["red-hawk-wallet-android", "red-hawk-wallet-flutter"],
      },
      {
        id: "react",
        name: "React",
        size: "md",
        anchor: true,
        evidence: ["ScheduleAI (Next.js) and this portfolio"],
        projects: ["scheduleai"],
      },
      {
        id: "react-native",
        name: "React Native",
        size: "md",
        anchor: true,
        evidence: ["Cross-platform mobile UI work with Expo"],
      },
      { id: "expo", name: "Expo", size: "sm", evidence: ["React Native tooling and builds"] },
      {
        id: "firestore",
        name: "Firestore",
        size: "sm",
        evidence: [
          "Data model for both Red Hawk Wallet builds (users, wallets, transactions)",
          "Security rules to block client-side balance writes (Flutter)",
        ],
        projects: ["red-hawk-wallet-android", "red-hawk-wallet-flutter"],
      },
      {
        id: "nosql",
        name: "NoSQL",
        size: "sm",
        evidence: ["Document modelling shaped around the queries the UI needs (Firestore)"],
        projects: ["red-hawk-wallet-android"],
      },
      { id: "mysql", name: "MySQL", size: "sm", evidence: ["Relational database coursework"] },
      { id: "flask", name: "Flask", size: "sm", evidence: ["Small Python web services"] },
      {
        id: "tailwind",
        name: "Tailwind CSS",
        size: "sm",
        evidence: ["ScheduleAI and this portfolio's design system"],
        projects: ["scheduleai"],
      },
      {
        id: "nativewind",
        name: "NativeWind",
        size: "sm",
        evidence: ["Tailwind-style styling in React Native"],
      },
      {
        id: "aws",
        name: "AWS",
        size: "sm",
        evidence: ["Basic cloud hosting and services; learning"],
      },
    ],
  },

  {
    id: "tools-systems",
    name: "Development Tools & Systems",
    scale: 1,
    description:
      "The environments and tools I use to build, debug, version, test, and deploy software.",
    skills: [
      {
        id: "github",
        name: "GitHub",
        size: "md",
        anchor: true,
        evidence: [
          "Pull requests, reviews, Actions, Pages",
          "Every project repo — Red Hawk Wallet, ScheduleAI, this site",
        ],
        projects: ["red-hawk-wallet-android", "scheduleai"],
      },
      {
        id: "vs-code",
        name: "VS Code",
        size: "sm",
        evidence: ["Primary editor for web and Flutter work"],
      },
      {
        id: "android-studio",
        name: "Android Studio",
        size: "sm",
        evidence: ["Native Android build, emulator, profiling for Red Hawk Wallet"],
        projects: ["red-hawk-wallet-android"],
      },
      { id: "eclipse", name: "Eclipse", size: "sm", evidence: ["Java coursework"] },
      { id: "linux", name: "Linux", size: "sm", evidence: ["Terminal, shell, server basics"] },
      {
        id: "windows",
        name: "Windows",
        size: "sm",
        evidence: ["Support and administration at MSU IT"],
      },
      {
        id: "github-pages",
        name: "GitHub Pages",
        size: "sm",
        evidence: ["Static site hosting for small projects"],
      },
      {
        id: "jupyter",
        name: "Jupyter Notebook",
        size: "sm",
        evidence: ["Data exploration and Python experiments"],
      },
      {
        id: "anaconda",
        name: "Anaconda",
        size: "sm",
        evidence: ["Python environment management for data work"],
      },
      {
        id: "networking",
        name: "Networking",
        size: "sm",
        evidence: ["Computer Networks coursework", "Diagnosing connectivity issues at MSU IT"],
      },
    ],
  },

  {
    id: "real-world",
    name: "Engineering in the Real World",
    scale: 0.8,
    description:
      "Skills from real work — how I operate on a team, diagnose problems, communicate with users, evaluate systems, and work under constraints. They support the developer, not replace it.",
    skills: [
      {
        id: "troubleshooting",
        name: "Troubleshooting",
        size: "md",
        anchor: true,
        evidence: [
          "MSU IT Support: diagnosing from incomplete information, separating symptom from cause",
          "Inventory discrepancies at ShopRite",
        ],
      },
      {
        id: "technical-support",
        name: "Technical Support",
        size: "sm",
        evidence: ["MSU IT Support Analyst: first-line support for staff and students"],
      },
      {
        id: "information-technology",
        name: "Information Technology",
        size: "sm",
        evidence: ["Accounts, hardware, everyday software support at MSU"],
      },
      {
        id: "quality-assurance",
        name: "Quality Assurance",
        size: "sm",
        evidence: [
          "Handshake AI: structured evaluation of model responses against defined criteria",
        ],
      },
      {
        id: "ai-model-evaluation",
        name: "AI Model Evaluation",
        size: "sm",
        evidence: [
          "Handshake AI / Project Hedgehog: rating responses, flagging inconsistencies to improve dataset quality",
        ],
      },
      {
        id: "data-annotation",
        name: "Data Annotation",
        size: "sm",
        evidence: ["Annotating datasets used for model training (Handshake AI)"],
      },
      {
        id: "attention-to-detail",
        name: "Attention to Detail",
        size: "sm",
        evidence: ["Catching small inconsistencies before they compound — inventory, model output"],
      },
      {
        id: "team-collaboration",
        name: "Team Collaboration",
        size: "sm",
        evidence: ["Six-person Agile team on Red Hawk Wallet; cross-team coordination at ShopRite"],
        projects: ["red-hawk-wallet-android"],
      },
      {
        id: "communication",
        name: "Communication",
        size: "sm",
        evidence: ["Explaining technical steps to non-technical users at MSU IT"],
      },
      {
        id: "customer-service",
        name: "Customer Service",
        size: "sm",
        evidence: ["Customer-facing problem solving at ShopRite"],
      },
      {
        id: "leadership",
        name: "Leadership",
        size: "sm",
        evidence: ["Team lead on Red Hawk Wallet: slicing work, reviews, keeping people unblocked"],
        projects: ["red-hawk-wallet-android"],
      },
      {
        id: "time-management",
        name: "Time Management",
        size: "sm",
        evidence: ["Balancing coursework, IT support, AI evaluation, and project work"],
      },
    ],
  },
];

/**
 * Meaningful cross-constellation paths only — not everything to everything.
 */
export const skillConnections: SkillConnection[] = [
  ["flutter", "firebase"],
  ["kotlin", "firebase"],
  ["javascript", "react"],
  ["react-native", "javascript"],
  ["git", "software-development"],
  ["github", "git"],
  ["oop", "java"],
  ["oop", "kotlin"],
  ["sql", "mysql"],
  ["troubleshooting", "technical-support"],
  ["quality-assurance", "ai-model-evaluation"],
  ["problem-solving", "troubleshooting"],
];

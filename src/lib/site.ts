/**
 * Single source of truth for identity, links, navigation, and the short
 * prose used on the About / Resume / Home screens.
 *
 * TODO(phase-1): replace every value marked below with real content:
 *  - email, links.linkedin
 *  - production `url` / NEXT_PUBLIC_SITE_URL
 *  - about.*, education, currently
 *  - drop a real resume.pdf into /public
 */
export const siteConfig = {
  name: "Harshvardhan Kumar",
  role: "Software Developer",
  shortName: "HK",
  tagline: "Computer Science student who turns real-world problems into software solutions.",
  description:
    "Portfolio of Harshvardhan Kumar — a Computer Science student and software developer. See how I notice problems, reason through them, make engineering decisions, and build.",
  // Overridden per-environment by NEXT_PUBLIC_SITE_URL; this is the fallback.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://harshvardhan-portfolio.vercel.app",
  locale: "en_US",

  email: "harshvk824@gmail.com",
  links: {
    github: "https://github.com/harshvk8",
    linkedin: "https://www.linkedin.com/in/harshvardhan-nimesh",
    resume: "/resume.pdf",
  },

  keywords: [
    "Harshvardhan Kumar",
    "software developer",
    "computer science student",
    "portfolio",
    "Flutter",
    "React",
    "Next.js",
    "Firebase",
  ],

  // --- About screen (placeholder prose) ---
  about: {
    intro:
      "I'm a Computer Science student and software developer. I like starting from a real problem someone actually has, understanding why the existing options fall short, and then building — and iterating on — something that fits.",
    interests:
      "Mobile and web application development, backend and cloud architecture, and the product decisions that sit between a user's need and the code that serves it.",
    direction:
      "I'm working toward a software engineering role where I can own features end to end: talk to users, weigh trade-offs, ship, measure, and improve.",
  },
  education: {
    degree: "BS, Computer Science", // TODO: confirm major/minor
    institution: "University name", // TODO
    period: "2022 – 2026", // TODO
  },
  currently: "Building this portfolio in the open and deepening my project case studies.",

  nav: [
    { title: "Home", href: "/" },
    { title: "About", href: "/about" },
    { title: "Projects", href: "/projects" },
    { title: "Experience", href: "/experience" },
    { title: "Skills", href: "/skills" },
    { title: "Resume", href: "/resume" },
    { title: "Contact", href: "/contact" },
  ],
} as const;

export type NavItem = (typeof siteConfig.nav)[number];

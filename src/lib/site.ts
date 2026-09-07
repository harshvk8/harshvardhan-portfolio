/**
 * Single source of truth for identity, links, navigation, and the short
 * prose on the About / Resume / Home screens.
 *
 * Facts here come from the résumé + GitHub. Still to confirm before deploy:
 *  - email (résumé shows harshvk8240@gmail.com; the value below is what you
 *    gave directly — pick one)
 *  - production `url` / NEXT_PUBLIC_SITE_URL
 *  - about.* prose is a draft — make it yours
 *  - drop public/resume.pdf and public/harshvardhan.jpg
 */
export const siteConfig = {
  name: "Harshvardhan Kumar Nimesh",
  role: "Software Developer",
  shortName: "HK",
  tagline: "Computer Science student who turns real campus problems into working software.",
  description:
    "Portfolio of Harshvardhan Kumar Nimesh — a Computer Science student at Montclair State University and software developer. See how I notice problems, reason through them, make engineering decisions, and build.",
  // Overridden per-environment by NEXT_PUBLIC_SITE_URL; this is the fallback.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://harshvardhan-portfolio.vercel.app",
  locale: "en_US",

  email: "harshvk824@gmail.com",
  phone: "(201) 952-5168", // not shown on the site by default
  links: {
    github: "https://github.com/harshvk8",
    linkedin: "https://www.linkedin.com/in/harshvardhan-nimesh",
    resume: "/resume.pdf",
  },

  keywords: [
    "Harshvardhan Kumar Nimesh",
    "software developer",
    "computer science student",
    "Montclair State University",
    "Android",
    "Kotlin",
    "Jetpack Compose",
    "Next.js",
    "TypeScript",
    "Firebase",
  ],

  // --- About screen (draft prose — rewrite in your own voice) ---
  about: {
    intro:
      "I'm a Computer Science student at Montclair State University and a software developer. I like starting from a problem people on campus actually have, understanding why the current options fall short, and building — then iterating on — something that fits. Right now I'm also annotating and evaluating AI model outputs at Handshake AI.",
    interests:
      "Android development with Kotlin and Jetpack Compose, full-stack web with Next.js and TypeScript, and applied AI — both evaluating model output and building conversational features on top of it.",
    direction:
      "I'm working toward a software engineering role where I can own features end to end: talk to users, weigh trade-offs, ship, measure, and improve.",
  },
  education: {
    degree: "B.S., Computer Science",
    institution: "Montclair State University",
    location: "Montclair, NJ",
    period: "Expected May 2027",
    coursework: [
      "Data Structures and Algorithms",
      "Software Engineering I & II",
      "Computer Networks",
      "Discrete Mathematics",
      "Fundamentals of Programming",
    ],
  },
  currently:
    "Evaluating AI model outputs at Handshake AI, and rebuilding Red Hawk Wallet in Flutter toward a cross-platform MVP.",

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

/**
 * Single source of truth for identity, links, navigation, and the short
 * prose on the About / Resume / Home screens.
 *
 * Open: set NEXT_PUBLIC_SITE_URL once there's a production deployment.
 */
export const siteConfig = {
  name: "Harshvardhan Kumar Nimesh",
  role: "Software Developer",
  shortName: "HK",
  tagline:
    "Computer Science student who turns everyday problems into systems I can test, simplify, and improve.",
  description:
    "Portfolio of Harshvardhan Kumar Nimesh — a Computer Science student at Montclair State University and software developer. See how I notice problems, reason through them, make engineering decisions, and build.",
  // Overridden per-environment by NEXT_PUBLIC_SITE_URL; `||` so an empty
  // value (e.g. a blank Vercel env var) still falls back instead of
  // producing `new URL("")`.
  url: process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://harshvardhan-portfolio.vercel.app",
  locale: "en_US",

  email: "harshvk8240@gmail.com",
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
    "Flutter",
    "Next.js",
    "Firebase",
  ],

  about: {
    intro:
      "I'm a Computer Science student and software developer who likes turning everyday problems into systems I can test, simplify, and improve. I usually start by understanding the problem and its constraints, then make technical decisions based on what the product actually needs instead of choosing complexity for its own sake. I care about building software that is useful, understandable, and reliable.",
    interests:
      "Mobile and full-stack applications, practical automation, AI-assisted tools, and products where architecture, user experience, security, and data flow all matter.",
    direction:
      "I'm looking for software engineering opportunities where I can build features end-to-end, especially in mobile or full-stack development, while continuing to grow in system design and product-oriented engineering.",
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
    "Finishing my B.S. in Computer Science at Montclair State University while working in IT support and AI evaluation, and continuing to build and improve my software projects.",

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

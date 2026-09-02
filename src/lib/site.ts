/**
 * Single source of truth for identity, links, and navigation.
 * TODO(phase-1): confirm the public email, LinkedIn URL, and production domain.
 */
export const siteConfig = {
  name: "Harshvardhan Kumar",
  role: "Software Developer",
  shortName: "HK",
  tagline: "Computer Science student who turns real-world problems into software solutions.",
  description:
    "Portfolio of Harshvardhan Kumar — a Computer Science student and software developer. Explore how I notice problems, reason through them, make engineering decisions, and build.",
  // Overridden per-environment by NEXT_PUBLIC_SITE_URL; this is the fallback.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://harshvardhan-portfolio.vercel.app",
  email: "hello@example.com",
  links: {
    github: "https://github.com/harshvk8",
    linkedin: "https://www.linkedin.com/in/harshvardhan-kumar",
    resume: "/resume.pdf",
  },
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

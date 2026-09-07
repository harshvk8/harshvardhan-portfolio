import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { Container } from "@/components/container";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${siteConfig.name} by email, LinkedIn, or GitHub.`,
};

const methods = [
  {
    label: "Email",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
    Icon: Mail,
  },
  {
    label: "LinkedIn",
    value: "in/harshvardhan-nimesh",
    href: siteConfig.links.linkedin,
    Icon: LinkedInIcon,
  },
  {
    label: "GitHub",
    value: "harshvk8",
    href: siteConfig.links.github,
    Icon: GitHubIcon,
  },
];

export default function ContactPage() {
  return (
    <Container width="prose" className="py-16">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Contact</h1>
      <p className="text-muted mt-3">The quickest way to reach me is email. I read everything.</p>

      <ul className="divide-border border-border mt-8 divide-y rounded-xl border">
        {methods.map(({ label, value, href, Icon }) => {
          const external = href.startsWith("http");
          return (
            <li key={label}>
              <a
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer" : undefined}
                className="hover:bg-surface flex items-center gap-4 px-4 py-4"
              >
                <Icon className="text-muted h-5 w-5" />
                <span className="flex-1">
                  <span className="block text-sm font-medium">{label}</span>
                  <span className="text-muted block font-mono text-xs">{value}</span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>

      <p className="border-border text-muted mt-8 rounded-lg border border-dashed p-4 text-sm">
        <span className="text-accent font-mono text-xs">Coming in Phase 3 — </span>
        an AI scheduling assistant here, so you can find a meeting slot in a short back-and-forth
        instead of an email thread. It will always say up front what it needs to confirm a meeting.
      </p>
    </Container>
  );
}

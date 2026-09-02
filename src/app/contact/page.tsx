import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = { title: "Contact" };

const methods = [
  { label: "Email", href: `mailto:${siteConfig.email}`, Icon: Mail },
  { label: "LinkedIn", href: siteConfig.links.linkedin, Icon: LinkedInIcon },
  { label: "GitHub", href: siteConfig.links.github, Icon: GitHubIcon },
];

export default function ContactPage() {
  return (
    <PageShell
      title="Contact"
      intro="Normal contact methods now; the AI scheduling assistant lands here in Phase 3. — Phase 1, Screen 14."
    >
      <ul className="space-y-3">
        {methods.map(({ label, href, Icon }) => (
          <li key={label}>
            <a
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noreferrer" : undefined}
              className="hover:text-accent inline-flex items-center gap-2 text-sm"
            >
              <Icon className="h-4 w-4" /> {label}
            </a>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}

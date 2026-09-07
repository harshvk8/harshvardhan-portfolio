import Link from "next/link";
import { Mail } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-border/60 border-t">
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <nav aria-label="Footer" className="flex flex-wrap gap-x-4 gap-y-1">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-muted hover:text-foreground text-sm"
              >
                {item.title}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="text-muted hover:text-foreground transition-colors"
            >
              <GitHubIcon className="h-5 w-5" />
            </a>
            <a
              href={siteConfig.links.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="text-muted hover:text-foreground transition-colors"
            >
              <LinkedInIcon className="h-5 w-5" />
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              aria-label="Email"
              className="text-muted hover:text-foreground transition-colors"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>

        <p className="text-muted mt-8 text-xs">
          &copy; {new Date().getFullYear()} {siteConfig.name}. Built with Next.js, Tailwind, and
          Motion.
        </p>
      </div>
    </footer>
  );
}

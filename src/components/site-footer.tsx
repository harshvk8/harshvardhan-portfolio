import { Mail } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-border/60 border-t">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-muted text-sm">
          &copy; {new Date().getFullYear()} {siteConfig.name}
        </p>
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
    </footer>
  );
}

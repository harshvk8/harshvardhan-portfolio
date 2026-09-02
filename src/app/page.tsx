import Link from "next/link";
import { ArrowRight, FileText, Mail } from "lucide-react";
import { GitHubIcon } from "@/components/icons";
import { siteConfig } from "@/lib/site";

const thinking = ["Observe", "Question", "Design", "Build", "Test", "Improve"];

export default function HomePage() {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col px-4 py-24 sm:px-6">
      <p className="text-accent font-mono text-sm">{siteConfig.role}</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{siteConfig.name}</h1>
      <p className="text-muted mt-5 max-w-2xl text-lg">{siteConfig.tagline}</p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/projects"
          className="bg-accent text-accent-foreground inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium"
        >
          Explore my work <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/resume"
          className="border-border text-foreground hover:bg-surface inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium"
        >
          <FileText className="h-4 w-4" /> Resume
        </Link>
        <a
          href={siteConfig.links.github}
          target="_blank"
          rel="noreferrer"
          className="border-border text-foreground hover:bg-surface inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium"
        >
          <GitHubIcon className="h-4 w-4" /> GitHub
        </a>
        <Link
          href="/contact"
          className="border-border text-foreground hover:bg-surface inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium"
        >
          <Mail className="h-4 w-4" /> Contact
        </Link>
      </div>

      <div className="border-border/60 mt-16 border-t pt-8">
        <h2 className="text-muted text-sm font-medium">How I think</h2>
        <ol className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-sm">
          {thinking.map((step, i) => (
            <li key={step} className="flex items-center gap-2">
              <span>{step}</span>
              {i < thinking.length - 1 ? <span className="text-muted">&rarr;</span> : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

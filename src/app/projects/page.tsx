import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { projects } from "@/content";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <PageShell
      title="Projects"
      intro="Selected for what they demonstrate, not the count of technologies. — Phase 1, Screens 4–10."
    >
      <ul className="grid gap-4 sm:grid-cols-2">
        {projects.map((project) => (
          <li key={project.slug} className="border-border bg-surface rounded-lg border p-5">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="font-medium">{project.name}</h2>
              <span className="text-muted font-mono text-xs">{project.year}</span>
            </div>
            <p className="text-muted mt-2 text-sm">{project.tagline}</p>
            <p className="text-muted mt-3 font-mono text-xs">{project.stack.join(" · ")}</p>
            <Link
              href={`/projects/${project.slug}`}
              className="text-accent mt-4 inline-flex items-center gap-1.5 text-sm"
            >
              Explore project <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}

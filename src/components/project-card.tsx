import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/content";
import { Badge } from "@/components/badge";
import { GitHubIcon } from "@/components/icons";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group border-border bg-surface hover:border-accent/50 relative flex flex-col rounded-xl border p-5 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-base font-medium">
          <Link href={`/projects/${project.slug}`} className="after:absolute after:inset-0">
            {project.name}
          </Link>
        </h3>
        <span className="text-muted font-mono text-xs">{project.year}</span>
      </div>

      <p className="text-muted mt-2 text-sm">{project.tagline}</p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.stack.slice(0, 5).map((tech) => (
          <Badge key={tech}>{tech}</Badge>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-4 pt-1 text-sm">
        <span className="text-accent inline-flex items-center gap-1">
          Explore <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
        {project.repo ? (
          <a
            href={project.repo}
            target="_blank"
            rel="noreferrer"
            className="text-muted hover:text-foreground relative z-10 inline-flex items-center gap-1"
            aria-label={`${project.name} on GitHub`}
          >
            <GitHubIcon className="h-3.5 w-3.5" /> Code
          </a>
        ) : null}
      </div>
    </article>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/container";
import { Reveal } from "@/components/reveal";
import { experience, getProject } from "@/content";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Experience",
  description: `A journey through the environments that changed how ${siteConfig.name} works — retail operations, AI evaluation, IT support, and building software.`,
};

export default function ExperiencePage() {
  return (
    <Container className="py-16">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Experience</h1>
      <p className="text-muted mt-3 max-w-2xl">
        Less a résumé timeline, more a journey through environments that each changed how I work —
        ending at the one I&apos;m headed toward.
      </p>

      <ol className="border-border mt-12 space-y-12 border-l pl-6">
        {experience.map((stage, i) => (
          <li key={stage.org} className="relative">
            <span
              aria-hidden
              className="border-background bg-accent absolute top-1 -left-[1.68rem] grid h-3 w-3 place-items-center rounded-full border-2"
            />
            <Reveal>
              <p className="text-accent font-mono text-xs tracking-widest uppercase">
                Stage {i + 1} — {stage.theme}
              </p>
              <div className="mt-1.5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h2 className="text-lg font-medium">
                  {stage.org}
                  {stage.role ? <span className="text-muted"> · {stage.role}</span> : null}
                </h2>
                <span className="text-muted font-mono text-xs">{stage.period}</span>
              </div>

              <p className="text-foreground/90 mt-3 max-w-2xl text-sm leading-relaxed">
                {stage.story}
              </p>

              <div className="mt-4">
                <p className="text-muted font-mono text-[10px] tracking-widest uppercase">
                  What I developed
                </p>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {stage.developed.map((d) => (
                    <li
                      key={d}
                      className="border-border text-muted rounded-md border px-2 py-0.5 text-xs"
                    >
                      {d}
                    </li>
                  ))}
                </ul>
              </div>

              {stage.projects.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {stage.projects.map((slug) => {
                    const project = getProject(slug);
                    if (!project) return null;
                    return (
                      <Link
                        key={slug}
                        href={`/projects/${slug}`}
                        className="border-border bg-surface hover:border-accent/50 hover:text-accent inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs"
                      >
                        {project.name} <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    );
                  })}
                </div>
              ) : null}
            </Reveal>
          </li>
        ))}
      </ol>
    </Container>
  );
}

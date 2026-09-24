import type { Metadata } from "next";
import { Container } from "@/components/container";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { projects } from "@/content";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Projects",
  description: `Software projects by ${siteConfig.name}: what I built, key engineering decisions, and lessons learned.`,
};

export default function ProjectsPage() {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <Container className="py-16">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Projects</h1>
      <p className="text-muted mt-3 max-w-2xl">
        A closer look at what I built, the decisions behind it, and what I learned.
      </p>

      {featured.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-accent font-mono text-xs tracking-widest uppercase">Featured</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {featured.map((project, i) => (
              <Reveal key={project.slug} delay={i * 0.05}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      {rest.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-muted font-mono text-xs tracking-widest uppercase">More</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {rest.map((project, i) => (
              <Reveal key={project.slug} delay={i * 0.05}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}
    </Container>
  );
}

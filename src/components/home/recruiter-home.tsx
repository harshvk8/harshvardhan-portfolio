import Link from "next/link";
import { ArrowRight, ArrowUpRight, FileText } from "lucide-react";
import { Container } from "@/components/container";
import { Starfield } from "@/components/starfield";
import { ButtonAnchor, ButtonLink } from "@/components/button-link";
import { ThinkingFlow } from "@/components/thinking-flow";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { GitHubIcon } from "@/components/icons";
import { featuredProjects } from "@/content";
import { siteConfig } from "@/lib/site";

/** The fast, low-animation home. Also the Recruiter Mode view. */
export function RecruiterHome() {
  return (
    <>
      <section className="border-border/60 relative isolate overflow-hidden border-b">
        <Starfield />
        <Container className="relative py-24 sm:py-32">
          <p className="text-accent font-mono text-sm">{siteConfig.role}</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">
            {siteConfig.name}
          </h1>
          <p className="text-muted mt-5 max-w-2xl text-lg">{siteConfig.tagline}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/projects">
              Explore my work <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="/resume" variant="secondary">
              <FileText className="h-4 w-4" /> Resume
            </ButtonLink>
            <ButtonAnchor href={siteConfig.links.github} variant="secondary">
              <GitHubIcon className="h-4 w-4" /> GitHub
            </ButtonAnchor>
            <ButtonLink href="/contact" variant="ghost">
              Contact
            </ButtonLink>
          </div>
        </Container>
      </section>

      <Container>
        <section className="border-border/60 border-b py-14">
          <h2 className="text-accent font-mono text-xs tracking-widest uppercase">How I think</h2>
          <p className="text-muted mt-3 max-w-2xl">
            This site isn&apos;t a list of finished things. Each project shows what I noticed, how I
            reasoned, why I chose an approach, what broke, and what I&apos;d do differently.
          </p>
          <div className="mt-6">
            <ThinkingFlow />
          </div>
        </section>

        <section className="py-14">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-accent font-mono text-xs tracking-widest uppercase">
                Featured projects
              </h2>
              <p className="text-muted mt-2">Chosen for what they demonstrate.</p>
            </div>
            <Link
              href="/projects"
              className="text-accent inline-flex shrink-0 items-center gap-1 text-sm"
            >
              All projects <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {featuredProjects.map((project, i) => (
              <Reveal key={project.slug} delay={i * 0.05}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        </section>
      </Container>
    </>
  );
}

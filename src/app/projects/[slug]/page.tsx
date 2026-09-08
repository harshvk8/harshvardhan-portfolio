import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { Container } from "@/components/container";
import { Badge } from "@/components/badge";
import { ButtonAnchor } from "@/components/button-link";
import { CaseStudyBody } from "@/components/case-study";
import { CaseStudyBackLink } from "@/components/case-study-back-link";
import { ProjectEmbed } from "@/components/project-embed";
import { GitHubIcon } from "@/components/icons";
import { getAdjacentProjects, getProject, projects } from "@/content";
import { siteConfig } from "@/lib/site";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.tagline,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: `${project.name} — ${siteConfig.name}`,
      description: project.tagline,
      url: `/projects/${project.slug}`,
    },
  };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const { prev, next } = getAdjacentProjects(project.slug);

  return (
    <Container width="prose" className="py-16">
      <Suspense
        fallback={
          <span className="text-muted inline-flex items-center gap-1.5 text-sm">
            <ArrowLeft className="h-3.5 w-3.5" /> All projects
          </span>
        }
      >
        <CaseStudyBackLink />
      </Suspense>

      <header className="mt-6">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{project.name}</h1>
        <p className="text-muted mt-2 text-lg">{project.tagline}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          <Badge>{project.year}</Badge>
          {project.stack.map((tech) => (
            <Badge key={tech}>{tech}</Badge>
          ))}
        </div>

        {(project.repo || project.demo) && (
          <div className="mt-5 flex flex-wrap gap-3">
            {project.repo ? (
              <ButtonAnchor href={project.repo} variant="secondary">
                <GitHubIcon className="h-4 w-4" /> View repository
              </ButtonAnchor>
            ) : null}
            {project.demo ? (
              <ButtonAnchor href={project.demo} variant="secondary">
                <ExternalLink className="h-4 w-4" /> Live demo
              </ButtonAnchor>
            ) : null}
          </div>
        )}
      </header>

      <div className="mt-8">
        <CaseStudyBody cs={project.caseStudy} />
      </div>

      {project.embedDemo ? (
        <ProjectEmbed
          src={project.embedDemo}
          title={`${project.name} — live app`}
          blurb="The deployed app, running here. Talk to the assistant and build a timetable — no sign-in to look around."
        />
      ) : null}

      {project.repo ? (
        <div className="border-border bg-surface mt-10 rounded-lg border p-5">
          <p className="text-foreground/90 text-sm">
            This page explains the <em>why</em>. GitHub has the proof of what was built.
          </p>
          <ButtonAnchor href={project.repo} className="mt-3">
            <GitHubIcon className="h-4 w-4" /> View full repository
          </ButtonAnchor>
        </div>
      ) : null}

      <nav className="border-border mt-12 flex items-stretch justify-between gap-4 border-t pt-6">
        {prev ? (
          <Link href={`/projects/${prev.slug}`} className="group max-w-[45%]">
            <span className="text-muted inline-flex items-center gap-1 text-xs">
              <ArrowLeft className="h-3 w-3" /> Previous
            </span>
            <span className="group-hover:text-accent mt-1 block text-sm font-medium">
              {prev.name}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/projects/${next.slug}`} className="group max-w-[45%] text-right">
            <span className="text-muted inline-flex items-center gap-1 text-xs">
              Next <ArrowRight className="h-3 w-3" />
            </span>
            <span className="group-hover:text-accent mt-1 block text-sm font-medium">
              {next.name}
            </span>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </Container>
  );
}

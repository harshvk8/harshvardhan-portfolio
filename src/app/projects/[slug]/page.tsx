import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getProject, projects } from "@/content";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return { title: project.name, description: project.tagline };
}

/** Ordered case-study sections, mirroring the portfolio plan. */
const sections: { key: string; label: string }[] = [
  { key: "problem", label: "The problem" },
  { key: "observation", label: "Observation" },
  { key: "question", label: "Question" },
  { key: "userNeed", label: "User need" },
  { key: "decision", label: "Technical decision" },
  { key: "architecture", label: "Architecture" },
];

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const cs = project.caseStudy;

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
      <Link
        href="/projects"
        className="text-muted hover:text-foreground inline-flex items-center gap-1.5 text-sm"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> All projects
      </Link>

      <h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">{project.name}</h1>
      <p className="text-muted mt-2">{project.tagline}</p>
      <p className="text-muted mt-3 font-mono text-xs">
        {project.year} · {project.stack.join(" · ")}
      </p>

      <div className="mt-10 space-y-8">
        {sections.map(({ key, label }) => (
          <section key={key}>
            <h2 className="text-accent text-sm font-medium">{label}</h2>
            <p className="text-foreground/90 mt-2 text-sm leading-relaxed">
              {cs[key as keyof typeof cs] as string}
            </p>
          </section>
        ))}

        <section>
          <h2 className="text-accent text-sm font-medium">Constraints</h2>
          <ul className="text-foreground/90 mt-2 list-disc space-y-1 pl-5 text-sm">
            {cs.constraints.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-accent text-sm font-medium">Options considered</h2>
          <ul className="text-foreground/90 mt-2 space-y-2 text-sm">
            {cs.options.map((o) => (
              <li key={o.option}>
                <span className="font-medium">{o.option}</span> — {o.tradeoff}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-accent text-sm font-medium">What this taught me</h2>
          <ul className="text-foreground/90 mt-2 list-disc space-y-1 pl-5 text-sm">
            {cs.learned.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </section>
      </div>

      <p className="text-muted mt-12 text-xs">
        Scaffold rendering of the case-study schema. Challenges, code decisions, before/after,
        diagrams, and screenshots come in Phase 1 / Phase 3.
      </p>
    </article>
  );
}

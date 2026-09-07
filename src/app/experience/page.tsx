import type { Metadata } from "next";
import { Container } from "@/components/container";
import { Reveal } from "@/components/reveal";
import { experience } from "@/content";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Experience",
  description: `Work experience for ${siteConfig.name}, with what each role taught me about building software people can use.`,
};

export default function ExperiencePage() {
  return (
    <Container className="py-16">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Experience</h1>
      <p className="text-muted mt-3 max-w-2xl">
        Roles, responsibilities, and — the part that matters most — what each one changed about how
        I work.
      </p>

      <ol className="border-border mt-12 space-y-10 border-l pl-6">
        {experience.map((item) => (
          <li key={`${item.org}-${item.role}`} className="relative">
            <span
              aria-hidden="true"
              className="border-background bg-accent absolute top-1.5 -left-[1.6rem] h-2.5 w-2.5 rounded-full border-2"
            />
            <Reveal>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h2 className="text-lg font-medium">
                  {item.role} <span className="text-muted">· {item.org}</span>
                </h2>
                <span className="text-muted font-mono text-xs">
                  {item.start} – {item.end}
                </span>
              </div>
              <p className="text-muted mt-2 text-sm">{item.summary}</p>
              <ul className="text-foreground/90 marker:text-border mt-3 list-disc space-y-1 pl-5 text-sm">
                {item.responsibilities.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
              <p className="border-border bg-surface text-foreground/90 mt-4 rounded-lg border p-3 text-sm">
                <span className="text-accent font-mono text-xs">What it taught me — </span>
                {item.learned}
              </p>
            </Reveal>
          </li>
        ))}
      </ol>
    </Container>
  );
}

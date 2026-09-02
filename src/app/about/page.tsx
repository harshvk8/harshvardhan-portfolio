import type { Metadata } from "next";
import { User } from "lucide-react";
import { Container } from "@/components/container";
import { ThinkingFlow } from "@/components/thinking-flow";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `About ${siteConfig.name} — background, interests, and how I approach building software.`,
};

const thinkingCopy: Record<string, string> = {
  Observe: "Notice the friction people actually live with, not the feature I want to build.",
  Question: "Ask what would have to be true for software to genuinely help here.",
  Design: "Weigh a few real options and their trade-offs before committing.",
  Build: "Ship the smallest version that puts the idea in front of a user.",
  Test: "Watch it get used; let reality correct the plan.",
  Improve: "Change one thing at a time based on what the use revealed.",
};

export default function AboutPage() {
  return (
    <Container className="py-16">
      <div className="grid gap-10 md:grid-cols-[200px_1fr]">
        <div>
          <div className="border-border bg-surface text-muted flex aspect-square w-full items-center justify-center rounded-xl border">
            <User className="h-10 w-10" aria-hidden="true" />
            <span className="sr-only">Photo of {siteConfig.name}</span>
          </div>
          <p className="text-muted mt-3 text-xs">{/* TODO: add /public photo */}Photo coming</p>
        </div>

        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{siteConfig.name}</h1>
          <p className="text-accent mt-1 font-mono text-sm">
            {siteConfig.role} · {siteConfig.education.degree}
          </p>
          <p className="text-muted mt-5 max-w-2xl">{siteConfig.about.intro}</p>

          <dl className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2">
            <div>
              <dt className="text-muted font-mono text-xs tracking-widest uppercase">Interests</dt>
              <dd className="text-foreground/90 mt-1 text-sm">{siteConfig.about.interests}</dd>
            </div>
            <div>
              <dt className="text-muted font-mono text-xs tracking-widest uppercase">Direction</dt>
              <dd className="text-foreground/90 mt-1 text-sm">{siteConfig.about.direction}</dd>
            </div>
            <div>
              <dt className="text-muted font-mono text-xs tracking-widest uppercase">Education</dt>
              <dd className="text-foreground/90 mt-1 text-sm">
                {siteConfig.education.degree}
                <br />
                {siteConfig.education.institution} · {siteConfig.education.period}
              </dd>
            </div>
            <div>
              <dt className="text-muted font-mono text-xs tracking-widest uppercase">Currently</dt>
              <dd className="text-foreground/90 mt-1 text-sm">{siteConfig.currently}</dd>
            </div>
          </dl>
        </div>
      </div>

      <section className="border-border mt-16 border-t pt-10">
        <h2 className="text-accent font-mono text-xs tracking-widest uppercase">How I think</h2>
        <p className="text-muted mt-3 max-w-2xl">
          The same loop runs through every project on this site.
        </p>
        <div className="mt-6">
          <ThinkingFlow />
        </div>
        <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(thinkingCopy).map(([step, copy]) => (
            <div key={step} className="border-border bg-surface rounded-lg border p-4">
              <dt className="text-accent font-mono text-sm">{step}</dt>
              <dd className="text-foreground/90 mt-1 text-sm">{copy}</dd>
            </div>
          ))}
        </dl>
      </section>
    </Container>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import { User } from "lucide-react";
import { Container } from "@/components/container";
import { ThinkingFlow } from "@/components/thinking-flow";
import { publicFileExists } from "@/lib/assets";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `About ${siteConfig.name} — background, interests, and how I approach building software.`,
};

const PHOTO = "harshvardhan.jpg";

const thinkingCopy: Record<string, string> = {
  Observe:
    "I focus on the problems people actually experience, not just the features I want to build.",
  Question: "I ask what needs to be true for software to genuinely help.",
  Design: "I compare practical options and their trade-offs before choosing an approach.",
  Build: "I build the smallest useful version and put it in front of real users.",
  Test: "I watch how people use it and let real feedback challenge my assumptions.",
  Improve: "I make one change at a time based on what I learn.",
};

export default function AboutPage() {
  const hasPhoto = publicFileExists(PHOTO);

  return (
    <Container className="py-16">
      <div className="grid gap-10 md:grid-cols-[200px_1fr]">
        <div>
          <div className="border-border bg-surface relative aspect-square w-full overflow-hidden rounded-xl border">
            {hasPhoto ? (
              <Image
                src={`/${PHOTO}`}
                alt={`Photo of ${siteConfig.name}`}
                fill
                sizes="200px"
                className="object-cover"
                priority
              />
            ) : (
              <div className="text-muted flex h-full w-full items-center justify-center">
                <User className="h-10 w-10" aria-hidden="true" />
                <span className="sr-only">Photo of {siteConfig.name}</span>
              </div>
            )}
          </div>
          {!hasPhoto ? (
            <p className="text-muted mt-3 text-xs">
              Add <code>public/{PHOTO}</code>
            </p>
          ) : null}
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
                {siteConfig.education.institution}, {siteConfig.education.location}
                <br />
                {siteConfig.education.period}
              </dd>
            </div>
            <div>
              <dt className="text-muted font-mono text-xs tracking-widest uppercase">Currently</dt>
              <dd className="text-foreground/90 mt-1 text-sm">{siteConfig.currently}</dd>
            </div>
          </dl>

          <div className="mt-6">
            <p className="text-muted font-mono text-xs tracking-widest uppercase">
              Relevant coursework
            </p>
            <p className="text-foreground/90 mt-1 text-sm">
              {siteConfig.education.coursework.join(" · ")}
            </p>
          </div>
        </div>
      </div>

      <section className="border-border mt-16 border-t pt-10">
        <h2 className="text-accent font-mono text-xs tracking-widest uppercase">How I think</h2>
        <p className="text-muted mt-3 max-w-2xl">
          I follow the same process for every project I build.
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

import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { experience } from "@/content";

export const metadata: Metadata = { title: "Experience" };

export default function ExperiencePage() {
  return (
    <PageShell
      title="Experience"
      intro="Roles, responsibilities, and — most importantly — what each one taught me. — Phase 1, Screen 11."
    >
      <ol className="border-border space-y-8 border-l pl-6">
        {experience.map((item) => (
          <li key={`${item.org}-${item.role}`} className="relative">
            <span className="bg-accent absolute top-1.5 -left-[1.6rem] h-2 w-2 rounded-full" />
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-medium">
                {item.role} · {item.org}
              </h2>
              <span className="text-muted font-mono text-xs">
                {item.start} – {item.end}
              </span>
            </div>
            <p className="text-muted mt-1 text-sm">{item.summary}</p>
            <p className="mt-2 text-sm">
              <span className="text-accent">What it taught me: </span>
              {item.learned}
            </p>
          </li>
        ))}
      </ol>
    </PageShell>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { projectsForSkill, skills } from "@/content";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Skills",
  description: `Skills used by ${siteConfig.name}, grouped by area and linked to the projects where each was actually applied.`,
};

const levelLabel: Record<string, string> = {
  strong: "Strong",
  proficient: "Proficient",
  learning: "Learning",
};

export default function SkillsPage() {
  return (
    <Container className="py-16">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Skills</h1>
      <p className="text-muted mt-3 max-w-2xl">
        Grouped by area. Each skill links to the projects where it did real work — the evidence
        lives in the case studies, not this list.
      </p>

      <div className="mt-12 space-y-10">
        {skills.map((group) => (
          <section key={group.category}>
            <h2 className="text-accent font-mono text-xs tracking-widest uppercase">
              {group.category}
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {group.skills.map((skill) => {
                const used = projectsForSkill(skill.projects);
                return (
                  <li key={skill.name} className="border-border bg-surface rounded-lg border p-4">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="font-medium">{skill.name}</span>
                      {skill.level ? (
                        <span className="text-muted font-mono text-xs">
                          {levelLabel[skill.level]}
                        </span>
                      ) : null}
                    </div>
                    {used.length > 0 ? (
                      <p className="text-muted mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs">
                        {used.map((p) => (
                          <Link
                            key={p.slug}
                            href={`/projects/${p.slug}`}
                            className="hover:text-accent"
                          >
                            {p.name}
                          </Link>
                        ))}
                      </p>
                    ) : (
                      <p className="text-muted mt-2 text-xs">Used outside these case studies.</p>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </Container>
  );
}

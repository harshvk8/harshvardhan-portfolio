import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { skills } from "@/content";

export const metadata: Metadata = { title: "Skills" };

export default function SkillsPage() {
  return (
    <PageShell
      title="Skills"
      intro="Grouped by category; each will link to the projects where it was actually used. — Phase 1, Screen 12."
    >
      <div className="grid gap-6 sm:grid-cols-2">
        {skills.map((group) => (
          <section key={group.category}>
            <h2 className="text-muted text-sm font-medium">{group.category}</h2>
            <ul className="mt-2 flex flex-wrap gap-2">
              {group.skills.map((skill) => (
                <li
                  key={skill.name}
                  className="border-border rounded-md border px-2.5 py-1 font-mono text-xs"
                >
                  {skill.name}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </PageShell>
  );
}

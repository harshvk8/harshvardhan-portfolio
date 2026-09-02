import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = { title: "About" };

const process = ["Observe", "Question", "Design", "Build", "Test", "Improve"];

export default function AboutPage() {
  return (
    <PageShell
      title="About"
      intro="Photo, degree, development interests, and where I'm headed. — Phase 1, Screen 3."
    >
      <section>
        <h2 className="text-muted text-sm font-medium">How I think</h2>
        <p className="mt-2 font-mono text-sm">{process.join("  →  ")}</p>
      </section>
    </PageShell>
  );
}

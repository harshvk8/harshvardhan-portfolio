import type { Metadata } from "next";
import { Download, FileText } from "lucide-react";
import { Container } from "@/components/container";
import { ButtonAnchor } from "@/components/button-link";
import { experience, skills } from "@/content";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Resume",
  description: `Resume for ${siteConfig.name} — ${siteConfig.role}. View or download the PDF.`,
};

export default function ResumePage() {
  const topSkills = skills.flatMap((g) => g.skills).filter((s) => s.level === "strong");

  return (
    <Container width="prose" className="py-16">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Resume</h1>
      <p className="text-muted mt-3">
        Prefer the traditional one-page version? Here it is. The rest of this site is the longer
        answer.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <ButtonAnchor href={siteConfig.links.resume}>
          <FileText className="h-4 w-4" /> View resume
        </ButtonAnchor>
        <ButtonAnchor href={siteConfig.links.resume} variant="secondary" download>
          <Download className="h-4 w-4" /> Download PDF
        </ButtonAnchor>
      </div>
      <p className="text-muted mt-2 text-xs">
        {/* TODO(phase-1): add public/resume.pdf */}Add <code>public/resume.pdf</code> to enable
        these.
      </p>

      <section className="border-border mt-12 border-t pt-8">
        <h2 className="text-accent font-mono text-xs tracking-widest uppercase">At a glance</h2>
        <dl className="mt-4 space-y-4 text-sm">
          <div className="grid gap-1 sm:grid-cols-[8rem_1fr]">
            <dt className="text-muted">Role</dt>
            <dd>{siteConfig.role}</dd>
          </div>
          <div className="grid gap-1 sm:grid-cols-[8rem_1fr]">
            <dt className="text-muted">Education</dt>
            <dd>
              {siteConfig.education.degree}, {siteConfig.education.institution} (
              {siteConfig.education.period})
            </dd>
          </div>
          <div className="grid gap-1 sm:grid-cols-[8rem_1fr]">
            <dt className="text-muted">Recent roles</dt>
            <dd>{experience.map((e) => `${e.role} — ${e.org}`).join("; ")}</dd>
          </div>
          <div className="grid gap-1 sm:grid-cols-[8rem_1fr]">
            <dt className="text-muted">Core skills</dt>
            <dd>{topSkills.map((s) => s.name).join(", ")}</dd>
          </div>
          <div className="grid gap-1 sm:grid-cols-[8rem_1fr]">
            <dt className="text-muted">Contact</dt>
            <dd>
              <a href={`mailto:${siteConfig.email}`} className="hover:text-accent">
                {siteConfig.email}
              </a>
            </dd>
          </div>
        </dl>
      </section>
    </Container>
  );
}

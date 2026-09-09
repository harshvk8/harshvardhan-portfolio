import type { Metadata } from "next";
import { Download, FileText } from "lucide-react";
import { Container } from "@/components/container";
import { ButtonAnchor } from "@/components/button-link";
import { publicFileExists } from "@/lib/assets";
import { constellations, experience } from "@/content";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Resume",
  description: `Resume for ${siteConfig.name} — ${siteConfig.role}. View or download the PDF.`,
};

export default function ResumePage() {
  const hasResume = publicFileExists("resume.pdf");
  const topSkills = constellations
    .flatMap((c) => c.skills)
    .filter((s) => s.size === "xl" || s.size === "lg");
  const realRoles = experience.filter((e) => e.kind === "work");

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
        <ButtonAnchor
          href={siteConfig.links.resume}
          variant="secondary"
          download="Harshvardhan-Nimesh-Resume.pdf"
        >
          <Download className="h-4 w-4" /> Download PDF
        </ButtonAnchor>
      </div>
      {!hasResume ? (
        <p className="text-muted mt-2 text-xs">
          Add <code>public/resume.pdf</code> to enable these.
        </p>
      ) : null}

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
              {siteConfig.education.degree} — {siteConfig.education.institution},{" "}
              {siteConfig.education.location} ({siteConfig.education.period})
            </dd>
          </div>
          <div className="grid gap-1 sm:grid-cols-[8rem_1fr]">
            <dt className="text-muted">Coursework</dt>
            <dd>{siteConfig.education.coursework.join(", ")}</dd>
          </div>
          {realRoles.length > 0 ? (
            <div className="grid gap-1 sm:grid-cols-[8rem_1fr]">
              <dt className="text-muted">Experience</dt>
              <dd>{realRoles.map((e) => `${e.role} — ${e.org}`).join("; ")}</dd>
            </div>
          ) : null}
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

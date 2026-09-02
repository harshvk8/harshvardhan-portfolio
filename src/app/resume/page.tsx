import type { Metadata } from "next";
import { Download, FileText } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = { title: "Resume" };

export default function ResumePage() {
  return (
    <PageShell
      title="Resume"
      intro="Want the traditional version? — Phase 1, Screen 13. Drop resume.pdf into /public."
    >
      <div className="flex flex-wrap gap-3">
        <a
          href={siteConfig.links.resume}
          target="_blank"
          rel="noreferrer"
          className="border-border hover:bg-surface inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium"
        >
          <FileText className="h-4 w-4" /> View resume
        </a>
        <a
          href={siteConfig.links.resume}
          download
          className="border-border hover:bg-surface inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium"
        >
          <Download className="h-4 w-4" /> Download resume
        </a>
      </div>
    </PageShell>
  );
}

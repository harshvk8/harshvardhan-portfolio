import type { Metadata } from "next";
import { Container } from "@/components/container";
import { SkillsExplorer } from "@/components/skills/skills-explorer";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Skills",
  description: `What ${siteConfig.name} builds with — five skill constellations, each backed by evidence from real projects and roles rather than proficiency percentages.`,
};

export default function SkillsPage() {
  return (
    <Container className="py-16">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Skills</h1>
      <p className="text-muted mt-3 max-w-2xl">
        What I can build with, and the evidence that I&apos;ve actually used it. Five constellations
        with Software Engineering at the centre — no proficiency percentages; every star links to a
        project or a role.
      </p>
      <SkillsExplorer />
    </Container>
  );
}

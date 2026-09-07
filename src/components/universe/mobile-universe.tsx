"use client";

import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { motion } from "motion/react";
import { Container } from "@/components/container";
import { ButtonLink, ButtonAnchor } from "@/components/button-link";
import { ProjectCard } from "@/components/project-card";
import { GitHubIcon } from "@/components/icons";
import { projects } from "@/content";
import { siteConfig } from "@/lib/site";
import { usePrefersReducedMotion } from "@/lib/use-media";

/** The universe on small screens: the Sun first, then the planets as a
 *  vertical stack. No 3D canvas. */
export function MobileUniverse() {
  const reduced = usePrefersReducedMotion();
  const ordered = [...projects].sort((a, b) => Number(b.featured) - Number(a.featured));

  return (
    <Container className="py-12">
      <div className="border-border bg-surface relative overflow-hidden rounded-2xl border p-6 text-center">
        <div className="starfield absolute inset-0 opacity-30" />
        <div
          className="absolute top-0 left-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{ background: "radial-gradient(closest-side, #6d5cff, transparent)" }}
        />
        <div className="relative">
          <p className="text-accent font-mono text-[10px] tracking-[0.2em] uppercase">
            {siteConfig.role}
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">{siteConfig.name}</h1>
          <p className="text-muted mx-auto mt-3 max-w-xs text-sm">{siteConfig.tagline}</p>
        </div>
      </div>

      <p className="text-muted mt-8 text-center font-mono text-xs tracking-widest uppercase">
        Projects in orbit
      </p>

      <div className="mt-4 space-y-4">
        {ordered.map((project, i) => (
          <motion.div
            key={project.slug}
            initial={reduced ? false : { opacity: 0, y: 16 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.05 }}
          >
            <ProjectCard project={project} />
          </motion.div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/resume" variant="secondary">
          <FileText className="h-4 w-4" /> Resume
        </ButtonLink>
        <ButtonAnchor href={siteConfig.links.github} variant="secondary">
          <GitHubIcon className="h-4 w-4" /> GitHub
        </ButtonAnchor>
        <Link href="/contact" className="text-accent inline-flex items-center gap-1 text-sm">
          Contact <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </Container>
  );
}

"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { projects } from "@/content";
import { siteConfig } from "@/lib/site";
import { planetLayout } from "@/lib/universe";
import { useIsMobile, usePrefersReducedMotion } from "@/lib/use-media";
import { MobileUniverse } from "./mobile-universe";
import { OpeningSequence } from "./opening-sequence";
import { UniverseLoader } from "./universe-loader";

const UniverseScene = dynamic(() => import("./universe-scene"), {
  ssr: false,
  loading: () => <UniverseLoader />,
});

/** Target of an "entering" transition: a project slug, or "about" (the Sun). */
type EnterTarget = { kind: "project"; slug: string } | { kind: "about" };

export function UniverseHome() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();
  const [entering, setEntering] = useState<EnterTarget | null>(null);

  const planets = useMemo(() => planetLayout(projects), []);

  function enter(target: EnterTarget) {
    if (entering) return;
    setEntering(target);
    if (target.kind === "about") {
      window.setTimeout(() => router.push("/about"), reducedMotion ? 150 : 900);
    } else {
      const { slug } = target;
      window.setTimeout(
        () => router.push(`/projects/${slug}?from=universe`),
        reducedMotion ? 150 : 1300,
      );
    }
  }

  if (isMobile) return <MobileUniverse />;

  const enteringSlug = entering?.kind === "project" ? entering.slug : null;

  return (
    <section className="relative h-[calc(100svh-3.5rem)] w-full overflow-hidden">
      {/* Accessible, non-visual routes */}
      <h1 className="sr-only">
        {siteConfig.name} — {siteConfig.role}. Explore my projects as an interactive solar system,
        or switch to Recruiter Mode from the header.
      </h1>
      <nav aria-label="Explore" className="sr-only">
        <ul>
          <li>
            <Link href="/about">About {siteConfig.name}</Link>
          </li>
          {projects.map((project) => (
            <li key={project.slug}>
              <Link href={`/projects/${project.slug}`}>
                {project.name} — {project.tagline}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <UniverseScene
        planets={planets}
        reducedMotion={reducedMotion}
        enteringSlug={enteringSlug}
        entering={entering != null}
        onEnter={(slug) => enter({ kind: "project", slug })}
        onOpenAbout={() => enter({ kind: "about" })}
      />

      <OpeningSequence reducedMotion={reducedMotion} />

      <AnimatePresence>
        {entering ? (
          <motion.div
            key="enter-fade"
            className="bg-background pointer-events-none absolute inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reducedMotion ? 0.12 : 1.05, ease: "easeIn" }}
          />
        ) : null}
      </AnimatePresence>

      {!entering ? (
        <p className="text-muted pointer-events-none absolute bottom-4 left-4 font-mono text-[11px]">
          drag to look · scroll to zoom · tap the Sun for About · tap a planet for a project
        </p>
      ) : null}
    </section>
  );
}

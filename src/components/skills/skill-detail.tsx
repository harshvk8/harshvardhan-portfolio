"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { getProject } from "@/content";
import type { Skill } from "@/content";

type ActiveSkill = Skill & { constellationName: string };

export function SkillDetail({
  skill,
  onClose,
}: {
  skill: ActiveSkill | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {skill ? (
        <motion.div
          key={skill.id}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 14 }}
          transition={{ duration: 0.22 }}
          className="border-border bg-surface/95 fixed inset-x-4 bottom-4 z-20 rounded-xl border p-4 shadow-xl backdrop-blur sm:absolute sm:inset-x-auto sm:top-4 sm:right-4 sm:bottom-auto sm:w-72"
          role="dialog"
          aria-label={`${skill.name} — where I used it`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-accent font-mono text-[10px] tracking-widest uppercase">
                {skill.constellationName}
              </p>
              <p className="mt-0.5 text-base font-semibold">{skill.name}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="text-muted hover:text-foreground -m-1 rounded p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <ul className="text-foreground/90 mt-3 space-y-1.5 text-sm">
            {skill.evidence.map((line) => (
              <li key={line} className="flex gap-2">
                <span aria-hidden className="text-accent">
                  ·
                </span>
                {line}
              </li>
            ))}
          </ul>

          {skill.projects.length > 0 ? (
            <div className="border-border/60 mt-3 flex flex-wrap gap-1.5 border-t pt-3">
              {skill.projects.map((slug) => {
                const project = getProject(slug);
                if (!project) return null;
                return (
                  <Link
                    key={slug}
                    href={`/projects/${slug}`}
                    className="border-border text-muted hover:text-accent rounded-md border px-2 py-0.5 text-xs"
                  >
                    {project.name}
                  </Link>
                );
              })}
            </div>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { Project } from "@/content";

/** Corner notification for the hovered planet — stays put (sticky, dismissed
 *  via the close button) rather than vanishing the instant the cursor drifts
 *  off the sphere, since it no longer sits next to the cursor. */
export function PlanetNotification({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!project) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project ? (
        <motion.div
          key={project.slug}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.22 }}
          className="border-border bg-surface/95 pointer-events-auto absolute top-4 right-4 z-30 w-64 rounded-xl border p-3 text-left shadow-xl backdrop-blur sm:w-72"
          role="status"
          aria-label={`${project.name}: project preview`}
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-medium">{project.name}</p>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="text-muted hover:text-foreground -m-1 shrink-0 rounded p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-muted mt-1 line-clamp-2 text-xs">{project.tagline}</p>
          <p className="text-muted mt-2 font-mono text-[10px]">
            {project.stack.slice(0, 3).join(" · ")}
          </p>
          <p className="text-accent mt-2 text-xs">Explore project →</p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

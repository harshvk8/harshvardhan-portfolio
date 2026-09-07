"use client";

import { useMemo, useState } from "react";
import { getSkill } from "@/content";
import { usePrefersReducedMotion } from "@/lib/use-media";
import { ConstellationMap } from "./constellation-map";
import { ConstellationList } from "./constellation-list";
import { SkillDetail } from "./skill-detail";

/** Desktop = the constellation SVG; below `md` = a tap-to-expand list.
 *  Both render (CSS picks) so there's no hydration flash. */
export function SkillsExplorer() {
  const reducedMotion = usePrefersReducedMotion();
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = useMemo(() => (activeId ? (getSkill(activeId) ?? null) : null), [activeId]);

  return (
    <div className="relative mt-6">
      <div className="md:hidden">
        <ConstellationList onSelect={setActiveId} />
      </div>

      <div className="hidden md:block">
        <p className="text-muted mb-2 font-mono text-[11px]">
          hover a star for its name · hover a constellation to trace it · click a star for its
          evidence
        </p>
        <div className="border-border bg-surface/40 overflow-hidden rounded-xl border">
          <ConstellationMap
            activeSkillId={activeId}
            onSelect={setActiveId}
            reducedMotion={reducedMotion}
          />
        </div>
      </div>

      <SkillDetail skill={active} onClose={() => setActiveId(null)} />
    </div>
  );
}

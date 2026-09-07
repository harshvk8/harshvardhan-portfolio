"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { constellations } from "@/content";

/** Mobile / no-hover view: tap a constellation to expand it, tap a skill for its evidence. */
export function ConstellationList({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <div className="mt-8 space-y-3">
      {constellations.map((c) => (
        <details
          key={c.id}
          open={c.primary}
          className="group border-border bg-surface rounded-xl border"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
            <span>
              <span className="text-sm font-medium">{c.name}</span>
              <span className="text-muted ml-2 font-mono text-[10px]">{c.skills.length}</span>
            </span>
            <ChevronDown className="text-muted h-4 w-4 shrink-0 transition-transform group-open:rotate-180" />
          </summary>
          <div className="border-border/60 border-t px-4 py-3">
            <p className="text-muted text-xs">{c.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {c.skills.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onSelect(s.id)}
                  className={cn(
                    "border-border hover:border-accent/60 hover:text-accent rounded-md border px-2.5 py-1 text-xs transition-colors",
                    s.anchor || s.size === "xl" || s.size === "lg"
                      ? "text-foreground font-medium"
                      : "text-muted",
                  )}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}

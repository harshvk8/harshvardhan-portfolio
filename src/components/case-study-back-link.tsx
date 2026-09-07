"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

/** "All projects", or "Return to Universe" when the visitor came from the
 *  3D home (`?from=universe`). */
export function CaseStudyBackLink() {
  const fromUniverse = useSearchParams().get("from") === "universe";
  return (
    <Link
      href={fromUniverse ? "/" : "/projects"}
      className="text-muted hover:text-foreground inline-flex items-center gap-1.5 text-sm"
    >
      <ArrowLeft className="h-3.5 w-3.5" />
      {fromUniverse ? "Return to Universe" : "All projects"}
    </Link>
  );
}

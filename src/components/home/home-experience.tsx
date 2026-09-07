"use client";

import { useMode } from "@/components/mode/mode-provider";
import { RecruiterHome } from "@/components/home/recruiter-home";
import { UniverseHome } from "@/components/universe/universe-home";

/** Picks the home experience from the persisted mode. Renders nothing for the
 *  single frame before the stored preference is read, to avoid a swap. */
export function HomeExperience() {
  const { mode, ready } = useMode();
  if (!ready) return null;
  return mode === "recruiter" ? <RecruiterHome /> : <UniverseHome />;
}

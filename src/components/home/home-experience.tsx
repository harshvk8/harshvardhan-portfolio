"use client";

import { useMode } from "@/components/mode/mode-provider";
import { RecruiterHome } from "@/components/home/recruiter-home";
import { UniverseHome } from "@/components/universe/universe-home";

/**
 * Picks the home experience from the persisted mode. RecruiterHome is the
 * default for the server render and the first client frame — it needs no
 * client state, so the initial HTML always has a real introduction and
 * project links (crawlers, no-JS visitors, and slow connections never see
 * a blank homepage). Once the stored preference is read, a visitor whose
 * mode is Explore swaps to the 3D universe.
 */
export function HomeExperience() {
  const { mode, ready } = useMode();
  if (ready && mode === "explore") return <UniverseHome />;
  return <RecruiterHome />;
}

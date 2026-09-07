"use client";

import { useEffect, useState } from "react";

/** SSR-safe `matchMedia` hook. Returns false until mounted. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);

  return matches;
}

/** True on viewports below the `md` breakpoint. */
export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 767px)");
}

/** True when the visitor asked for reduced motion. */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

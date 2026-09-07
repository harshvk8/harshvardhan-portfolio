"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type Mode = "explore" | "recruiter";

const STORAGE_KEY = "portfolio-mode";

type ModeContextValue = {
  mode: Mode;
  setMode: (mode: Mode) => void;
  toggle: () => void;
  /** false until the stored preference has been read on the client */
  ready: boolean;
};

const ModeContext = createContext<ModeContextValue | null>(null);

/**
 * Explore (the 3D universe) vs Recruiter (the plain, fast layout).
 * Persisted to localStorage. Defaults to Recruiter when the visitor has
 * `prefers-reduced-motion` set and no stored choice.
 */
export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<Mode>("explore");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let initial: Mode = "explore";
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "explore" || stored === "recruiter") {
        initial = stored;
      } else if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        initial = "recruiter";
      }
    } catch {
      /* storage unavailable — keep default */
    }
    setModeState(initial);
    setReady(true);
  }, []);

  const setMode = useCallback((next: Mode) => {
    setModeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback(() => {
    setModeState((current) => {
      const next: Mode = current === "explore" ? "recruiter" : "explore";
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  return (
    <ModeContext.Provider value={{ mode, setMode, toggle, ready }}>{children}</ModeContext.Provider>
  );
}

export function useMode() {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error("useMode must be used within <ModeProvider>");
  return ctx;
}

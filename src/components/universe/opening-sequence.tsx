"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const SESSION_KEY = "universe-intro-seen";

function alreadySeen() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return true;
  }
}

/**
 * ~2.5s dark-space intro over the universe, once per session, skippable.
 * Auto-skipped for reduced-motion visitors.
 */
export function OpeningSequence({ reducedMotion }: { reducedMotion: boolean }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reducedMotion || alreadySeen()) return;
    setVisible(true);
    const done = window.setTimeout(finish, 2600);
    return () => window.clearTimeout(done);
  }, [reducedMotion]);

  function finish() {
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* ignore */
    }
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="bg-background absolute inset-0 z-30 grid place-items-center overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="starfield absolute inset-0 opacity-60" />

          <div className="relative text-center">
            <motion.p
              className="text-muted font-mono text-sm tracking-[0.25em] uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ duration: 1.6, times: [0, 0.2, 0.8, 1] }}
            >
              Initializing Harshvardhan&apos;s universe
            </motion.p>
            <motion.p
              className="text-accent mt-3 font-mono text-xs tracking-[0.3em] uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 1] }}
              transition={{ duration: 2.4, times: [0, 0.55, 1] }}
            >
              Ideas → Problems → Solutions
            </motion.p>
          </div>

          <button
            type="button"
            onClick={finish}
            className="border-border text-muted hover:text-foreground absolute right-4 bottom-4 rounded-md border px-3 py-1.5 text-xs"
          >
            Skip
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

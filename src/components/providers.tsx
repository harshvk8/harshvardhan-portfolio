"use client";

import { MotionConfig } from "motion/react";
import { ModeProvider } from "@/components/mode/mode-provider";

/** App-wide client providers. `reducedMotion="user"` makes every Motion
 * animation respect the visitor's `prefers-reduced-motion` setting. */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ModeProvider>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ModeProvider>
  );
}

import type { Variants } from "motion/react";

/**
 * Shared animation variants. Motion honours `prefers-reduced-motion`
 * automatically via <MotionConfig reducedMotion="user"> in providers.tsx,
 * so these can be used freely.
 */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

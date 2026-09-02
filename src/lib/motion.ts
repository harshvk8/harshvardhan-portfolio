import type { Variants } from "motion/react";

/**
 * Shared animation variants. Motion honours `prefers-reduced-motion`
 * automatically via <MotionConfig reducedMotion="user"> in providers.tsx,
 * so these can be used freely.
 */
const easeOut = [0.22, 1, 0.36, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeOut } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.3, ease: easeOut } },
};

export const staggerChildren: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

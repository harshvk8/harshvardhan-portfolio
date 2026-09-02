"use client";

import { motion } from "motion/react";
import { fadeUp } from "@/lib/motion";

/**
 * Fades its children up as they scroll into view, once. Respects
 * `prefers-reduced-motion` (via <MotionConfig reducedMotion="user">).
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

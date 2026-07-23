"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { EASE, VIEWPORT } from "@/src/lib/motion";

interface SectionDividerProps {
  /** The bare label, e.g. "About Nidham" — the parentheses are added here. */
  label: string;
  /** Extra classes on the wrapper (spacing overrides for a given section). */
  className?: string;
}

/**
 * The site's section divider — a hairline rule that opens from both edges to a
 * centred label: ─────── ( LABEL ) ───────.
 *
 * This is the single source of the motif. It is deliberately self-contained —
 * it runs its own `whileInView` reveal rather than being driven by the host
 * section's timeline — so every section gets identical spacing, typography and
 * motion no matter whether that section otherwise animates with Framer or GSAP.
 * Drop it in as the first child of a section's container and let the section's
 * heading follow; do not re-implement the rule inline (that is how the events
 * section and the eyebrows drifted into three different treatments before this).
 *
 * The two lines are separate nodes so each can grow from its own edge —
 * `origin-left` / `origin-right` scaleX — which a single centred line cannot do.
 * The label is padding-compensated for its own trailing letter-spacing: 0.4em
 * of tracking adds 0.4em of space after the final glyph, which would otherwise
 * shove the text left of centre, so an equal `ps-[0.4em]` restores it.
 *
 * Reduced motion: lines render already full-width and the label already in
 * place (no transform), matching the SSR / no-JS output.
 */
export default function SectionDivider({
  label,
  className = "",
}: SectionDividerProps) {
  const reduce = useReducedMotion() ?? false;

  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : 0.05 },
    },
  };

  // One variant for both lines; each edge is set by `origin-left`/`origin-right`
  // on the element, so the same scaleX grows outward from opposite sides.
  const grow: Variants = {
    hidden: { scaleX: reduce ? 1 : 0 },
    show: {
      scaleX: 1,
      transition: { duration: 0.8, ease: EASE },
    },
  };

  const labelV: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: EASE, delay: reduce ? 0 : 0.15 },
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      className={`flex items-center gap-5 sm:gap-8 ${className}`}
    >
      <motion.span
        aria-hidden="true"
        variants={grow}
        className="h-px flex-1 origin-left bg-white/[0.12]"
      />
      <motion.span
        variants={labelV}
        className="shrink-0 whitespace-nowrap ps-[0.4em] text-[12px] font-medium uppercase tracking-[0.4em] text-white/55"
      >
        ( {label} )
      </motion.span>
      <motion.span
        aria-hidden="true"
        variants={grow}
        className="h-px flex-1 origin-right bg-white/[0.12]"
      />
    </motion.div>
  );
}

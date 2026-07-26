"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { EASE } from "@/src/lib/motion";

interface PlayButtonProps {
  /** Opens the cinematic lightbox. */
  onClick: () => void;
  /** Accessible name — say what plays, not just "play". */
  label: string;
}

/**
 * The event card's play affordance — the whole thumbnail is the target.
 *
 * It is deliberately one full-bleed `<button>` with a disc drawn at its centre,
 * rather than a small disc floating over a clickable div: that way "click
 * anywhere on the image" and "click the play button" are the same element, so
 * there is exactly one focus stop, one accessible name and one hit area to
 * reason about.
 *
 * Colour is the site's primary-button language (see lib/button) — Nidham amber
 * face, plum mark. Motion is Framer Motion: `whileHover`/`whileFocus` on the
 * button propagate to the two children through variant names, so hovering
 * anywhere on the thumbnail grows the disc and blooms its glow on one shared
 * 300ms curve. `useReducedMotion` collapses the movement while keeping the
 * colour and glow changes, which are not motion.
 */
export default function PlayButton({ onClick, label }: PlayButtonProps) {
  const reduce = useReducedMotion() ?? false;
  const transition = { duration: 0.3, ease: EASE };

  const disc: Variants = {
    rest: {
      scale: 1,
      boxShadow:
        "0 0 0 1px rgba(255,255,255,0.18), 0 14px 40px -14px rgba(0,0,0,0.75)",
    },
    hover: {
      scale: reduce ? 1 : 1.08,
      boxShadow:
        "0 0 0 1px rgba(255,216,61,0.6), 0 0 58px -6px rgba(255,216,61,0.62), 0 20px 54px -16px rgba(0,0,0,0.8)",
    },
  };

  /** A halo that only exists on hover — the "increase the glow" cue. */
  const halo: Variants = {
    rest: { scale: 1, opacity: 0 },
    hover: { scale: reduce ? 1.12 : 1.38, opacity: 1 },
  };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      data-cursor="button"
      aria-label={label}
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileFocus="hover"
      whileTap={reduce ? undefined : { scale: 0.98 }}
      transition={transition}
      // Matches the media block's radius so the focus ring traces the artwork.
      className="absolute inset-0 z-10 grid place-items-center rounded-[22px] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#FFD83D]"
    >
      <span className="relative grid h-[66px] w-[66px] place-items-center sm:h-[76px] sm:w-[76px] lg:h-[88px] lg:w-[88px]">
        <motion.span
          aria-hidden="true"
          variants={halo}
          transition={transition}
          className="absolute inset-0 rounded-full border border-[#FFD83D]/45"
        />
        <motion.span
          aria-hidden="true"
          variants={disc}
          transition={transition}
          className="absolute inset-0 rounded-full bg-[#FFD83D]"
        />
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="relative h-6 w-6 translate-x-[1px] fill-[#6E1B45] sm:h-7 sm:w-7 lg:h-8 lg:w-8"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
    </motion.button>
  );
}

"use client";

import { motion, type Variants } from "framer-motion";
import LogoCard from "./LogoCard";
import type { Partner } from "./types";

interface MarqueeProps {
  partners: readonly Partner[];
  /** Seconds per full loop — slow/premium by default. */
  durationSeconds?: number;
  /** Per-card entrance variant (staggered by the parent section). */
  cardVariants?: Variants;
}

/**
 * Seamless right-to-left infinite marquee. The list is duplicated once so the
 * CSS `marquee` keyframe can translate the track by -50% with no visible jump.
 * Scrolling pauses on hover (CSS `animation-play-state`) and resumes from the
 * exact same position — no restart.
 */
export default function Marquee({
  partners,
  durationSeconds = 30,
  cardVariants,
}: MarqueeProps) {
  const loop = [...partners, ...partners];

  return (
    <div className="group relative w-full overflow-hidden">
      <div
        className="animate-marquee flex w-max flex-nowrap items-center py-8 group-hover:[animation-play-state:paused]"
        style={{ "--marquee-duration": `${durationSeconds}s` } as React.CSSProperties}
      >
        {loop.map((partner, i) => (
          <motion.div
            key={`${partner.id}-${i}`}
            variants={cardVariants}
            aria-hidden={i >= partners.length}
            className="shrink-0 px-3 sm:px-4"
          >
            <LogoCard partner={partner} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

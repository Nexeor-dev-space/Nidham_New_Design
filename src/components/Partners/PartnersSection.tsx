"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import Marquee from "./Marquee";
import { PARTNERS } from "./constants";
import type { Partner } from "./types";

/** Shared premium easing. */
const EASE = [0.22, 1, 0.36, 1] as const;

interface PartnersSectionProps {
  /** Partner logos — accepts any number of entries. */
  partners?: readonly Partner[];
  /** Small uppercase eyebrow above the heading. */
  label?: string;
  /** Section heading. */
  title?: string;
  /** Seconds per marquee loop. */
  durationSeconds?: number;
}

export default function PartnersSection({
  partners = PARTNERS,
  label = "Our Partners",
  title = "For brands that create experiences people never forget.",
  durationSeconds = 30,
}: PartnersSectionProps) {
  const reduce = useReducedMotion();

  // Once-only entrance orchestration for the whole block.
  const viewport = { once: true, margin: "-12% 0px -12% 0px" } as const;

  const dividerV: Variants = {
    hidden: { scaleX: reduce ? 1 : 0, opacity: 0 },
    show: {
      scaleX: 1,
      opacity: 1,
      transition: { duration: 1, ease: EASE },
    },
  };

  const labelV: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE, delay: 0.15 } },
  };

  const headingV: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 26 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE, delay: 0.28 } },
  };

  // Carousel container: fades in + slides up, then staggers its cards in.
  const carouselV: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 34 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.9,
        ease: EASE,
        delay: 0.42,
        staggerChildren: reduce ? 0 : 0.05,
        delayChildren: 0.55,
      },
    },
  };

  const cardV: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.5, ease: EASE } },
  };

  return (
    <section
      aria-labelledby="partners-heading"
      className="w-full bg-[#f1efec] section-y font-[family-name:var(--font-dm-sans)]"
    >
      <div className="container-page">
        {/* Thin divider that expands horizontally on enter. */}
        <motion.div
          aria-hidden="true"
          variants={dividerV}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="h-px w-full origin-center bg-neutral-300"
        />

        <motion.p
          variants={labelV}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="mt-8 text-center text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-500"
        >
          ({" "}
          {label}
          {" "})
        </motion.p>

        <motion.h2
          id="partners-heading"
          variants={headingV}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="mx-auto mt-6 max-w-4xl text-center text-[clamp(1.85rem,4.6vw,3.5rem)] font-normal leading-[1.12] tracking-[-0.02em] text-neutral-900"
        >
          {title}
        </motion.h2>
      </div>

      {/* Full-bleed marquee. Fades/slides up as a unit, cards stagger in. */}
      <motion.div
        variants={carouselV}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="mt-14 sm:mt-16 lg:mt-20"
      >
        <Marquee
          partners={partners}
          durationSeconds={durationSeconds}
          cardVariants={cardV}
        />
      </motion.div>
    </section>
  );
}

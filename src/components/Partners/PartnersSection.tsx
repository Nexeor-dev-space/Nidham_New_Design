"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { PARTNERS } from "./constants";
import type { Partner } from "./types";
import { SECTION_HEADING, SECTION_HEADING_GAP } from "@/src/lib/typography";
import { EASE, VIEWPORT } from "@/src/lib/motion";

interface PartnersSectionProps {
  /** Partner logos — accepts any number of entries. */
  partners?: readonly Partner[];
  /** Small uppercase eyebrow above the heading. */
  label?: string;
  /** Section heading. */
  title?: string;
  /** Supporting copy under the heading. */
  description?: string;
}

/**
 * Editorial logo wall — the logos sit directly on the section background with
 * no card, border or panel of their own; the grid gap is the only thing
 * separating them, which is what makes it read as a gallery rather than UI.
 *
 * Sizing fits every mark inside one shared *box* (`object-contain`) rather than
 * normalising height. Height normalisation is the nicer trick, but it only
 * holds for a set of similarly-proportioned wordmarks: this set spans 3.9:1
 * (Lensman) to 0.47:1 (Media Factory, a stacked lockup), and at equal heights
 * the stacked marks carry roughly eight times the optical mass and swamp the
 * row. A shared box makes wide marks width-limited and tall marks
 * height-limited, which lands them all at a comparable visual weight.
 *
 * The box keeps a ~2.7:1 ratio across the whole viewport range so that balance
 * does not drift: both dimensions are `clamp()`ed with slopes that hit their
 * floors and ceilings together (52–84px tall against 140–226px wide). Change
 * one bound and change its partner, or the ratio skews and one axis starts
 * doing all the limiting.
 *
 * Five columns: it divides the 10 logos evenly (5+5 desktop, 5×2 mobile) with
 * no partial row to place. The old 4-column limit came from the height-
 * normalising ceiling and no longer applies.
 *
 * The assets are already white-on-transparent (see constants.ts), so the wall
 * applies no colour treatment of its own — only the resting opacity that makes
 * hover read as a lift in brightness.
 */
export default function PartnersSection({
  partners = PARTNERS,
  label = "Our Partners",
  title = "Trusted by Leading Brands",
  description = "We collaborate with brands, artists, institutions, and global partners to create meaningful experiences across entertainment, media, and culture.",
}: PartnersSectionProps) {
  const reduce = useReducedMotion() ?? false;

  const fade = (delay: number): Variants => ({
    hidden: { opacity: 0, y: reduce ? 0 : 22 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE, delay } },
  });

  /** Parent of the wall — hands each logo a 50ms-staggered entrance. */
  const wall: Variants = {
    hidden: {},
    show: {
      transition: {
        delayChildren: reduce ? 0 : 0.3,
        staggerChildren: reduce ? 0 : 0.05,
      },
    },
  };

  const logo: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: EASE },
    },
  };

  return (
    <section
      aria-labelledby="partners-heading"
      className="relative w-full overflow-hidden bg-[#1F1F1F] section-y"
    >
      {/* Ambient light — three very soft radial washes in the brand purple,
          magenta and champagne at 5–7%. Painted as gradients rather than
          blurred elements: no filter, no layer, no circular edge to catch. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(65%_55%_at_12%_18%,rgba(110,27,69,0.07),transparent_72%),radial-gradient(55%_50%_at_88%_38%,rgba(199,154,46,0.05),transparent_70%),radial-gradient(50%_45%_at_45%_105%,rgba(93,1,57,0.06),transparent_72%)]"
      />

      <div className="container-page relative">
        <motion.p
          variants={fade(0)}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="text-center text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-400"
        >
          ( {label} )
        </motion.p>

        <motion.h2
          id="partners-heading"
          variants={fade(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className={`${SECTION_HEADING_GAP} ${SECTION_HEADING}`}
        >
          {title}
        </motion.h2>

        <motion.p
          variants={fade(0.22)}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mx-auto mt-6 max-w-2xl text-center text-[20px] leading-[1.7] text-neutral-400"
        >
          {description}
        </motion.p>

        {/* The wall. Gap alone carries the spacing — no cell padding, no panels. */}
        <motion.ul
          variants={wall}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mt-16 grid grid-cols-2 gap-x-10 gap-y-14 sm:gap-x-12 sm:gap-y-16 md:grid-cols-5 lg:gap-x-14 lg:gap-y-20"
        >
          {partners.map((partner) => (
            <motion.li
              key={partner.id}
              variants={logo}
              className="flex items-center justify-center"
            >
              {/* The shared fit box. `object-contain` is what lets a 3.9:1
                  wordmark and a 0.47:1 stacked lockup share it without either
                  being cropped or stretched — see the note above the component. */}
              <Image
                src={partner.logo}
                alt={partner.name}
                width={partner.width}
                height={partner.height}
                unoptimized
                loading="lazy"
                className="h-[clamp(52px,4.6vw,84px)] w-full max-w-[clamp(140px,12.4vw,226px)] object-contain opacity-70 transition-[opacity,scale,translate] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:opacity-100 motion-safe:hover:-translate-y-[3px] motion-safe:hover:scale-105"
              />
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

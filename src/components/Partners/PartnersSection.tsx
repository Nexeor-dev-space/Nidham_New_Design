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
 * Sizing normalises *optical height*, not width: every logo renders at the same
 * height and takes whatever width its aspect ratio implies (a wide wordmark is
 * wide). That only works because each asset's viewBox is cropped tight to its
 * artwork — see constants.ts.
 *
 * The height is fluid rather than stepped, and that is load-bearing. A logo can
 * only be as tall as `column width ÷ its aspect ratio`; past that it hits
 * `max-w-full`, letterboxes inside its box, and silently renders shorter than
 * its neighbours — the wall goes uneven with no error anywhere. Column width
 * changes continuously with the viewport but the column *count* jumps, so
 * stepped heights cannot track that ceiling (they would have to run 24→46→30→40
 * as 2 columns become 4). `clamp()` tracks it continuously and keeps every logo
 * the same height at every width.
 *
 * Each slope is bounded by the widest asset (~4.63:1) at the *narrowest* width
 * in its range, since that is where cells are tightest: 3.85vw is set by 768px
 * (ceiling ~30px) and 4.15vw by 1280px (ceiling ~54px). One slope across both
 * would be dragged down to the 768px limit and cost ~5px at 1440px, hence the
 * split at xl. Raise either and the widest logo silently letterboxes — it goes
 * short while its neighbours do not, and nothing errors.
 *
 * The same ceiling is why the wall tops out at 4 columns: a 5th tightens every
 * cell and forces the slope back to ~3.1vw (46px at 1440 instead of 60px).
 * Four also divides the 8 logos evenly (4+4 desktop, 2×4 mobile), so there is
 * no partial row to place.
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
          className="mt-16 grid grid-cols-2 gap-x-10 gap-y-14 sm:gap-x-12 sm:gap-y-16 md:grid-cols-4 lg:gap-x-16 lg:gap-y-20"
        >
          {partners.map((partner) => (
            <motion.li
              key={partner.id}
              variants={logo}
              className="flex items-center justify-center"
            >
              {/* Placeholder artwork is near-black: `brightness-0 invert` flattens
                  any colour to pure white, so mixed-colour brand SVGs normalise
                  to the same monochrome treatment. Resting at 70% opacity is
                  what makes the hover read as a lift in brightness — a
                  brightness filter would be a no-op on already-white pixels. */}
              <Image
                src={partner.logo}
                alt={partner.name}
                width={partner.width}
                height={partner.height}
                unoptimized
                loading="lazy"
                className="h-[clamp(24px,3.85vw,68px)] w-auto max-w-full object-contain opacity-70 brightness-0 invert transition-[opacity,scale,translate] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:opacity-100 motion-safe:hover:-translate-y-[3px] motion-safe:hover:scale-105 xl:h-[clamp(24px,4.15vw,68px)]"
              />
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

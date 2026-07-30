"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import TestimonialCarousel from "./TestimonialCarousel";
import {
  SOCIAL_PROOF_LABEL,
  SOCIAL_PROOF_SUBTITLE,
  SOCIAL_PROOF_TITLE,
  TESTIMONIALS,
} from "./constants";
import SectionDivider from "@/src/components/ui/SectionDivider";
import { SECTION_HEADING, SECTION_HEADING_GAP } from "@/src/lib/typography";
import { EASE, VIEWPORT } from "@/src/lib/motion";

/**
 * Social-proof section — client testimonials in a premium editorial beat.
 *
 * It plugs into the site's shared systems rather than inventing its own:
 * `SectionDivider` for the eyebrow, `SECTION_HEADING` typography, the
 * `.container-page` / `.section-y` rhythm, and the `motion.ts` EASE/VIEWPORT
 * grammar. Scroll choreography runs top-down — divider → heading → subtitle →
 * testimonials — each block revealing on its own `whileInView` with
 * `once: true`, matching every other homepage section.
 *
 * The backdrop is never flat: three static brand radial washes (champagne gold
 * + purple, mirroring PartnersSection) plus two very soft blurred orbs that
 * drift with the shared `.chapter-float` keyframe. All ambient motion is
 * transform/opacity only and stops under reduced motion.
 */
export default function SocialProofSection() {
  const reduce = useReducedMotion() ?? false;

  const fade = (delay: number): Variants => ({
    hidden: { opacity: 0, y: reduce ? 0 : 22 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE, delay } },
  });

  return (
    <section
      id="testimonials"
      aria-labelledby="social-proof-heading"
      className="relative w-full overflow-hidden bg-[#1F1F1F] section-y"
    >
      {/* Ambient light — static brand radial washes (no layer, no edge). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_15%_10%,rgba(224,0,104,0.07),transparent_70%),radial-gradient(55%_50%_at_85%_30%,rgba(110,27,69,0.08),transparent_72%),radial-gradient(60%_55%_at_50%_108%,rgba(93,1,57,0.07),transparent_72%)]"
      />
      {/* Two soft floating orbs — gentle depth; drift via shared chapter-float. */}
      <div
        aria-hidden
        className="chapter-float pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(224,0,104,0.12),transparent_70%)] blur-3xl"
      />
      <div
        aria-hidden
        style={{ animationDelay: "-4.5s" }}
        className="chapter-float pointer-events-none absolute -right-24 bottom-24 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(110,27,69,0.14),transparent_70%)] blur-3xl"
      />

      <div className="container-page relative">
        <SectionDivider label={SOCIAL_PROOF_LABEL} />

        <motion.h2
          id="social-proof-heading"
          variants={fade(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className={`${SECTION_HEADING_GAP} ${SECTION_HEADING}`}
        >
          {SOCIAL_PROOF_TITLE}
        </motion.h2>

        <motion.p
          variants={fade(0.22)}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mx-auto mt-6 max-w-2xl text-center text-[20px] leading-[1.7] text-neutral-400"
        >
          {SOCIAL_PROOF_SUBTITLE}
        </motion.p>

        {/* Testimonials. */}
        <div className="mt-14 sm:mt-16 lg:mt-20">
          <TestimonialCarousel testimonials={TESTIMONIALS} />
        </div>
      </div>
    </section>
  );
}

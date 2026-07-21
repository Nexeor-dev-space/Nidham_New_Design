"use client";

import Image from "next/image";
import Link from "next/link";
import Magnetic from "@/src/components/CustomCursor/Magnetic";
import {
  SECTION_CONTENT_GAP,
  SECTION_HEADING,
  SECTION_HEADING_GAP,
} from "@/src/lib/typography";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  ABOUT_BUTTON_LINK,
  ABOUT_BUTTON_TEXT,
  ABOUT_DESCRIPTION,
  ABOUT_IMAGE,
  ABOUT_SUBTITLE,
  ABOUT_TITLE,
} from "./constants";
import type { AboutSectionProps } from "./types";
import { EASE, VIEWPORT } from "@/src/lib/motion";

export default function AboutSection({
  subtitle = ABOUT_SUBTITLE,
  title = ABOUT_TITLE,
  description = ABOUT_DESCRIPTION,
  buttonText = ABOUT_BUTTON_TEXT,
  buttonLink = ABOUT_BUTTON_LINK,
  image = ABOUT_IMAGE,
}: AboutSectionProps) {
  const reduce = useReducedMotion();

  // ----- entrance variants -----
  // Phase 1: a soft mask wipe + scale-down + rise + fade for the image.
  const imageV: Variants = {
    hidden: {
      opacity: 0,
      y: reduce ? 0 : 26,
      scale: reduce ? 1 : 1.05,
      clipPath: reduce ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)",
    },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      clipPath: "inset(0% 0% 0% 0%)",
      transition: { duration: 1.1, ease: EASE },
    },
  };

  const eyebrowV: Variants = {
    hidden: {
      opacity: 0,
      y: reduce ? 0 : 12,
      filter: reduce ? "blur(0px)" : "blur(6px)",
    },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.7, ease: EASE, delay: 0 },
    },
  };

  // Heading: fade up as a single block (unified section-heading motion).
  const headingV: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 26 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: EASE, delay: 0.15 },
    },
  };

  const paragraphV: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 22 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: EASE, delay: 0.3 },
    },
  };

  const buttonV: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 22, scale: reduce ? 1 : 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.7, ease: EASE, delay: 0.45 },
    },
  };

  return (
    <section
      aria-labelledby="about-heading"
      data-particles="about"
      className="w-full bg-[#F1F0EE] section-y"
    >
      {/* Near full-bleed divider. */}
      <div className="container-page">
        <div className="h-px w-full bg-[#d8d6d1]" />
      </div>

      <div className="container-page">
        {/* Eyebrow */}
        <motion.p
          variants={eyebrowV}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mt-8 text-center text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-500"
        >
          ({" "}
          {subtitle}
          {" "})
        </motion.p>

        {/* Heading */}
        <motion.h2
          id="about-heading"
          variants={headingV}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className={`${SECTION_HEADING_GAP} ${SECTION_HEADING}`}
        >
          {title}
        </motion.h2>

        {/* Two-column layout */}
        <div
          className={`${SECTION_CONTENT_GAP} grid grid-cols-1 gap-10 lg:grid-cols-[1.12fr_0.88fr] lg:items-center lg:gap-16 xl:gap-20`}
        >
          {/* Left column — image. Layering keeps Framer (entrance, on .reveal)
              and GSAP (scroll, on .frame + .image) on separate transforms. */}
          <figure className="relative m-0">
            <motion.div
              variants={imageV}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              className="relative will-change-transform"
            >
              <div
                data-cursor="image"
                className="group relative aspect-[986/842] w-full overflow-hidden rounded-[8px]"
              >
                <div className="absolute inset-0">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-cover contrast-[1.04] saturate-[1.03]"
                  />
                </div>
                {/* Very subtle vignette for depth. */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 [box-shadow:inset_0_0_130px_rgba(0,0,0,0.18)]"
                />
                {/* Gentle hover lighting. */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(255,255,255,0.16),transparent_60%)] opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
                />
              </div>
            </motion.div>
          </figure>

          {/* Right column — text */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <motion.p
              variants={paragraphV}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              className="max-w-xl text-[clamp(1.15rem,1.7vw,1.75rem)] font-normal leading-[1.5] text-neutral-700"
            >
              {description}
            </motion.p>

            <motion.div
              variants={buttonV}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              className="mt-10 w-full sm:w-auto lg:mt-14"
            >
              <Magnetic className="block w-full sm:inline-block sm:w-auto">
              <Link
                href={buttonLink}
                data-cursor="button"
                className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#5D0139] px-8 py-4 text-[13px] font-medium uppercase tracking-[0.14em] text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#6E1B45] hover:shadow-lg hover:shadow-black/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5D0139] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F1F0EE] active:translate-y-0 active:scale-[0.99] sm:w-auto sm:px-10 sm:py-5"
              >
                {buttonText}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1"
                >
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
              </Magnetic>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

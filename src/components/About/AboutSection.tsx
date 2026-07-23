"use client";

import { useEffect, useRef, useState } from "react";
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
  ABOUT_MEDIA,
  ABOUT_SUBTITLE,
  ABOUT_TITLE,
} from "./constants";
import type { AboutSectionProps } from "./types";
import { EASE, VIEWPORT } from "@/src/lib/motion";
import { BUTTON_SKIN } from "@/src/lib/button";

export default function AboutSection({
  subtitle = ABOUT_SUBTITLE,
  title = ABOUT_TITLE,
  description = ABOUT_DESCRIPTION,
  buttonText = ABOUT_BUTTON_TEXT,
  buttonLink = ABOUT_BUTTON_LINK,
  media = ABOUT_MEDIA,
}: AboutSectionProps) {
  const reduce = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  // Latches true the first time the section nears the viewport; gates `src`.
  const [near, setNear] = useState(false);

  /**
   * Stand-in for the `loading="lazy"` the <Image> used to carry — this is a
   * multi-MB file sitting well below a hero that already ships its own video, so
   * it must not compete for bandwidth on first paint.
   *
   * The `src` is withheld until the section is near, rather than relying on
   * `preload="metadata"`: preload is only a hint, and Chrome was observed
   * buffering the whole file at page load regardless. Withholding `src` is the
   * only thing that reliably defers the fetch. `rootMargin` starts it a screen
   * early so it is ready by the time it is actually on screen.
   *
   * Playback then follows visibility, and never starts under reduced motion —
   * there the first decoded frame just stands in as a still.
   */
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setNear(true);
        else el.pause();
      },
      { rootMargin: "100% 0px", threshold: 0 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Play once `src` is actually attached (the observer can fire a render early).
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !near || reduce) return;
    // Rejects if the browser blocks autoplay; the first frame remains.
    void el.play().catch(() => {});
  }, [near, reduce]);

  // ----- entrance variants -----
  // Phase 1: a soft mask wipe + scale-down + rise + fade for the media.
  const mediaV: Variants = {
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
      className="w-full bg-[#1F1F1F] section-y"
    >
      {/* Near full-bleed divider. */}
      <div className="container-page">
        <div className="h-px w-full bg-white/10" />
      </div>

      <div className="container-page">
        {/* Eyebrow */}
        <motion.p
          variants={eyebrowV}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mt-8 text-center text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-400"
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
          {/* Left column — showreel. The container owns the design's aspect
              ratio and the video is object-cover'd into it, so the footage's own
              dimensions never affect layout. */}
          <figure className="relative m-0">
            <motion.div
              variants={mediaV}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              className="relative will-change-transform"
            >
              <div
                data-cursor="video"
                className="group relative aspect-[986/842] w-full overflow-hidden rounded-[8px] bg-neutral-900"
              >
                <div className="absolute inset-0">
                  <video
                    ref={videoRef}
                    // Withheld until near — see the IntersectionObserver above.
                    src={near ? media.src : undefined}
                    aria-label={media.alt}
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-cover contrast-[1.04] saturate-[1.03]"
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
              className="max-w-xl text-[20px] font-normal leading-[1.5] text-neutral-200"
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
                className={`group inline-flex w-full items-center justify-center gap-3 rounded-[16px] px-8 py-4 text-[13px] font-medium uppercase tracking-[0.14em] outline-none active:translate-y-0 active:scale-[0.99] motion-safe:hover:-translate-y-0.5 sm:w-auto sm:px-10 sm:py-5 ${BUTTON_SKIN}`}
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

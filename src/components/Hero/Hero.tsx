"use client";

import { useRef } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import AnnouncementBar from "./AnnouncementBar";
import Navbar from "./Navbar";
import { useHeroScroll } from "@/src/hooks/useHeroScroll";

/** Shared premium easing — a soft, expensive-feeling ease-out. */
const EASE = [0.22, 1, 0.36, 1] as const;

const HEADING_WORDS = ["Creative", "Vision"] as const;

export default function Hero() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // GSAP ScrollTrigger owns the scroll-driven parallax (see useHeroScroll).
  // These wrappers are deliberately *not* Framer-controlled so the two motion
  // systems never fight over the same node's transform — Framer runs the
  // entrance reveal on the inner elements, GSAP scrubs these layers on scroll.
  const contentRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const decorRef = useRef<HTMLDivElement>(null);

  useHeroScroll({
    section: sectionRef,
    video: videoRef,
    content: contentRef,
    decor: decorRef,
  });

  // Entrance orchestration.
  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.11, delayChildren: 0.15 },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: EASE },
    },
  };

  // Masked, per-word rise for the headline.
  const word: Variants = {
    hidden: { y: reduce ? "0%" : "110%" },
    show: {
      y: "0%",
      transition: { duration: 0.9, ease: EASE },
    },
  };

  const media: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 32, scale: reduce ? 1 : 0.985 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 1, ease: EASE },
    },
  };

  return (
    <header
      ref={sectionRef}
      id="top"
      className="relative w-full overflow-hidden bg-[#f1efec] font-[family-name:var(--font-dm-sans)] text-neutral-900"
    >
      {/* Ambient floating glow (Layer 2) — decorative, purely atmospheric.
          The wrapper gets the scroll parallax; the inner glows keep their own
          idle float, so parent-translate and child-float compose cleanly. */}
      {!reduce && (
        <div
          ref={decorRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 will-change-transform"
        >
          <motion.div
            className="absolute -left-24 top-24 h-[26rem] w-[26rem] rounded-full bg-[#6E1B45]/[0.07] blur-3xl"
            animate={{ y: [0, -28, 0], x: [0, 12, 0], opacity: [0.5, 0.85, 0.5] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -right-32 top-64 h-[30rem] w-[30rem] rounded-full bg-amber-300/[0.10] blur-3xl"
            animate={{ y: [0, 26, 0], x: [0, -16, 0], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          />
        </div>
      )}

      <AnnouncementBar />
      <Navbar />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto max-w-[1600px] px-6 pb-14 pt-12 sm:pt-14 lg:px-10"
      >
        {/* Content layer (Layer 3) — GSAP scrubs this wrapper's transform on
            scroll; Framer drives the entrance reveal on the children inside. */}
        <div ref={contentRef} className="origin-left will-change-transform">
          <motion.p
            variants={item}
            className="text-xl font-normal tracking-tight text-neutral-900 will-change-transform sm:text-2xl lg:text-3xl"
          >
            Vision. Impact. Excellence.
          </motion.p>

          {/* Masked per-word reveal. Each word rises out of a clipped row. */}
          <motion.h1
            variants={container}
            className="mt-2 flex flex-wrap font-[family-name:Arial,Helvetica,sans-serif] text-[clamp(3rem,12vw,4rem)] font-normal uppercase leading-[0.95] tracking-[-0.03em] text-neutral-900 will-change-transform sm:flex-nowrap sm:text-[clamp(2rem,11.5vw,11.6rem)] sm:leading-[0.92] lg:mt-3"
          >
            {HEADING_WORDS.map((w, i) => (
              <span
                key={w}
                className={`inline-block overflow-hidden pb-[0.08em] ${
                  i < HEADING_WORDS.length - 1 ? "mr-[0.28em]" : ""
                }`}
              >
                <motion.span variants={word} className="inline-block will-change-transform">
                  {w}
                </motion.span>
              </span>
            ))}
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-4 max-w-2xl text-lg text-neutral-500 will-change-transform sm:text-xl lg:text-2xl"
          >
            A Strategic Studio for Technology, Entertainment &amp; Media.
          </motion.p>
        </div>

        {/* Cinematic background video (Layer 1). Framer runs the entrance;
            GSAP scrubs the inner <video> transform (slow drift + 1.08→1.00
            scale) for the parallax. The card sits still so the media parallaxes
            within its fixed frame. */}
        <motion.div variants={media} className="mt-12 lg:mt-14">
          <div
            data-cursor="video"
            className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-neutral-900 shadow-[0_40px_80px_-32px_rgba(0,0,0,0.45)] ring-1 ring-black/5 sm:aspect-[16/9] lg:aspect-[1280/672]"
          >
            <video
              ref={videoRef}
              className="absolute inset-0 h-[124%] w-full object-cover will-change-transform"
              src="/video/hero-banner-video.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              aria-label="Nidham event highlights"
            />
            {/* Cinematic overlay for depth + text contrast. */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-black/15"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_0%,transparent_55%,rgba(0,0,0,0.25)_100%)]"
            />
          </div>
        </motion.div>
      </motion.div>
    </header>
  );
}

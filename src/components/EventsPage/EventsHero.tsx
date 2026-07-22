"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import AnnouncementBar from "@/src/components/Hero/AnnouncementBar";
import Navbar from "@/src/components/Hero/Navbar";
import { HERO_HEADING } from "@/src/lib/typography";
import { EASE } from "@/src/lib/motion";
import {
  EVENTS_EYEBROW,
  EVENTS_HEADLINE_LINES,
  EVENTS_HERO_POSTER,
  EVENTS_HERO_VIDEO,
  EVENTS_INTRO,
} from "./constants";

/**
 * Cinematic Events hero — a minimal, editorial title page for the portfolio.
 * Its animated background is a looping event video (its point of difference from
 * the Services hero's animated gradient), darkened so the light nav + copy read.
 * A huge masked headline anchors the bottom-left, with only a small supporting
 * paragraph and a quiet scroll indicator. Ambient dust comes from the global
 * ParticleField via `data-particles="hero"`; the nav chrome + `#hero-nav-sentinel`
 * keep the global FloatingNav handoff working. All copy is verbatim.
 */
export default function EventsHero() {
  const reduce = useReducedMotion() ?? false;

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 22 },
    show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
  };
  const word: Variants = {
    hidden: { y: reduce ? "0%" : "115%" },
    show: { y: "0%", transition: { duration: 1, ease: EASE } },
  };

  return (
    <header
      id="events-top"
      data-particles="hero"
      className="relative flex min-h-[100svh] w-full flex-col overflow-hidden bg-[#141414] text-neutral-100"
    >
      {/* Layer 0 — cinematic looping video backdrop + darkening scrims. */}
      <div aria-hidden="true" className="absolute inset-0 z-0 overflow-hidden">
        <video
          className="h-full w-full object-cover"
          src={EVENTS_HERO_VIDEO}
          poster={EVENTS_HERO_POSTER}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/45 to-black/90" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_0%,transparent_45%,rgba(0,0,0,0.55)_100%)]" />
        {/* A single soft brand glow so the surface is never flat. */}
        {!reduce && (
          <motion.div
            className="absolute -left-24 top-1/3 h-[30rem] w-[30rem] rounded-full bg-[#6E1B45]/[0.18] blur-3xl"
            animate={{ y: [0, -26, 0], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </div>

      {/* Very subtle grain. */}
      <div
        aria-hidden="true"
        className="hero-grain pointer-events-none absolute inset-0 z-0 opacity-[0.05] mix-blend-soft-light"
      />

      {/* Navigation block — shared site chrome, incl. FloatingNav handoff. */}
      <div className="relative z-30">
        <AnnouncementBar />
        <Navbar />
        <div id="hero-nav-sentinel" aria-hidden="true" className="h-0 w-full" />
      </div>

      {/* Copy — bottom-anchored editorial composition; headline dominates. */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="container-page relative z-20 flex flex-1 flex-col justify-end pb-28 pt-16 sm:pb-32 lg:pb-36"
      >
        <motion.p
          variants={item}
          className="flex items-center gap-4 font-[family-name:var(--font-urbanist)] text-xs font-medium uppercase tracking-[0.32em] text-neutral-300 sm:text-sm"
        >
          <span aria-hidden="true" className="h-px w-10 bg-[#A6386B]/80" />
          {EVENTS_EYEBROW}
        </motion.p>

        <motion.h1 variants={container} className={`mt-7 ${HERO_HEADING}`}>
          {EVENTS_HEADLINE_LINES.map((line) => (
            <span key={line} className="block overflow-hidden pb-[0.12em]">
              <motion.span variants={word} className="block will-change-transform">
                {line}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-10 max-w-md font-[family-name:var(--font-urbanist)] text-[15px] font-light leading-[1.7] text-neutral-300 sm:text-base lg:ml-auto lg:text-right"
        >
          {EVENTS_INTRO}
        </motion.p>
      </motion.div>

      {/* Quiet scroll indicator — a pill with a falling dot. */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, ease: EASE, delay: 1.2 }}
        className="pointer-events-none absolute inset-x-0 bottom-7 z-20 flex justify-center"
      >
        <span className="relative flex h-11 w-[26px] justify-center overflow-hidden rounded-full border border-white/20">
          <motion.span
            className="mt-2 h-2 w-[3px] rounded-full bg-[#A6386B]"
            animate={reduce ? {} : { y: [0, 14, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </header>
  );
}

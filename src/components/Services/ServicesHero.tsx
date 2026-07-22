"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import AnnouncementBar from "@/src/components/Hero/AnnouncementBar";
import Navbar from "@/src/components/Hero/Navbar";
import { HERO_HEADING } from "@/src/lib/typography";
import { EASE } from "@/src/lib/motion";
import {
  SERVICES_EYEBROW,
  SERVICES_HEADLINE_LINES,
  SERVICES_INTRO,
} from "./constants";

/**
 * Services hero — mirrors the homepage hero's chrome and motion language exactly
 * so the page reads as the same site: the same AnnouncementBar + Navbar block
 * (with the `#hero-nav-sentinel` that hands off to the global FloatingNav), the
 * same dark surface, the same ambient magenta/amber glows and faint film grain,
 * the same signature `EASE`, and the same masked per-line headline cascade used
 * on the home hero.
 *
 * Content is presentation-only: the eyebrow, the site tagline as the headline,
 * and the verbatim intro paragraph — all from src/components/Services/constants.
 */
export default function ServicesHero() {
  const reduce = useReducedMotion() ?? false;

  // Entrance orchestration — same grammar as the home hero.
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.11, delayChildren: 0.15 } },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
  };

  const word: Variants = {
    hidden: { y: reduce ? "0%" : "110%" },
    show: { y: "0%", transition: { duration: 0.9, ease: EASE } },
  };

  return (
    <header
      id="services-top"
      data-particles="hero"
      className="relative flex min-h-[100svh] w-full flex-col overflow-hidden bg-[#1F1F1F] text-neutral-100"
    >
      {/* Ambient floating glow — the same decorative magenta + amber blobs as the
          home hero (purely atmospheric, pointer-none, backmost). */}
      {!reduce && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
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
          <motion.div
            className="absolute bottom-[-6rem] left-1/3 h-[24rem] w-[24rem] rounded-full bg-[#6E1B45]/[0.06] blur-3xl"
            animate={{ y: [0, -20, 0], opacity: [0.35, 0.6, 0.35] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          />
        </div>
      )}

      {/* Faint film grain — same texture the home hero uses over empty areas. */}
      <div
        aria-hidden="true"
        className="hero-grain pointer-events-none absolute inset-0 z-0 opacity-[0.04] mix-blend-soft-light"
      />

      {/* Navigation block — identical structure to the home hero, including the
          handoff sentinel the global FloatingNav watches. */}
      <div className="relative z-30">
        <AnnouncementBar />
        <Navbar />
        <div id="hero-nav-sentinel" aria-hidden="true" className="h-0 w-full" />
      </div>

      {/* Copy — left-aligned editorial composition. */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="container-page relative z-20 flex flex-1 flex-col justify-center pb-28 pt-16 sm:pt-20 lg:pb-32"
      >
        <motion.p
          variants={item}
          className="text-xs font-medium uppercase tracking-[0.28em] text-neutral-400 sm:text-sm"
        >
          {SERVICES_EYEBROW}
        </motion.p>

        <motion.h1
          variants={container}
          className={`mt-6 ${HERO_HEADING}`}
        >
          {SERVICES_HEADLINE_LINES.map((line) => (
            <span key={line} className="block overflow-hidden pb-[0.12em]">
              <motion.span variants={word} className="block will-change-transform">
                {line}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-10 max-w-2xl text-[18px] leading-[1.65] text-neutral-300 sm:text-[20px] lg:mt-12 lg:text-[22px]"
        >
          {SERVICES_INTRO}
        </motion.p>
      </motion.div>

      {/* Smooth scroll indicator — anchored to the bottom of the hero. */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE, delay: 1.1 }}
        className="pointer-events-none absolute inset-x-0 bottom-7 z-20 flex flex-col items-center gap-3"
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-neutral-500">
          Scroll
        </span>
        <span className="relative flex h-11 w-[26px] justify-center overflow-hidden rounded-full border border-white/15">
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

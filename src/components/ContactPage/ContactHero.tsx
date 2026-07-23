"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import AnnouncementBar from "@/src/components/Hero/AnnouncementBar";
import Navbar from "@/src/components/Hero/Navbar";
import HeroShape from "@/src/components/Hero/HeroShape";
import BrandButton from "@/src/components/ui/BrandButton";
import { HERO_HEADING } from "@/src/lib/typography";
import { EASE } from "@/src/lib/motion";
import { scrollToId } from "@/src/lib/nav";
import {
  CONTACT_EYEBROW,
  CONTACT_HEADLINE_LINES,
  CONTACT_INTRO,
  FORM_TARGET_ID,
} from "./constants";

/**
 * Contact hero — the same chrome and motion language as the homepage hero
 * (AnnouncementBar + Navbar + `#hero-nav-sentinel` handoff, dark surface, signature
 * `EASE`, masked per-line headline cascade), on the same animated gradient aurora
 * as the Services and Events heroes (shared `.svc-aurora*` primitives), faint
 * grain, and the global ParticleField dust (`data-particles="hero"`). Lots of
 * whitespace; a clear primary action that glides to the form; a scroll indicator.
 */
export default function ContactHero() {
  const reduce = useReducedMotion() ?? false;

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
      id="contact-top"
      data-particles="hero"
      className="relative flex min-h-[100svh] w-full flex-col overflow-hidden bg-[#141414] text-neutral-100"
    >
      {/* Layer 0 — animated gradient aurora, shared with the Services and Events
          heroes via the `.svc-aurora*` primitives (see globals.css): large, soft,
          overlapping washes slowly drifting on a near-black base so the surface
          is always alive, never flat. Paused under reduced motion. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(130%_100%_at_50%_-10%,#241019_0%,#141414_55%,#0E0E0E_100%)]" />
        <div
          className={`svc-aurora svc-aurora-a left-[-14%] top-[-12%] h-[46rem] w-[46rem] ${
            reduce ? "!animate-none" : ""
          }`}
        />
        <div
          className={`svc-aurora svc-aurora-b right-[-16%] top-[6%] h-[42rem] w-[42rem] ${
            reduce ? "!animate-none" : ""
          }`}
        />
        <div
          className={`svc-aurora svc-aurora-c bottom-[-18%] left-[28%] h-[40rem] w-[40rem] ${
            reduce ? "!animate-none" : ""
          }`}
        />
        {/* Gentle vignette to seat the copy. */}
        <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_40%,transparent_50%,rgba(0,0,0,0.55)_100%)]" />
      </div>

      {/* Extremely light grain over the empty areas. */}
      <div
        aria-hidden="true"
        className="hero-grain pointer-events-none absolute inset-0 z-0 opacity-[0.04] mix-blend-soft-light"
      />

      {/* Navigation block — identical to the home hero, incl. handoff sentinel. */}
      <div className="relative z-30">
        <AnnouncementBar />
        <Navbar />
        <div id="hero-nav-sentinel" aria-hidden="true" className="h-0 w-full" />
      </div>

      {/* Copy — centred editorial composition with generous whitespace. */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="container-page relative z-20 flex flex-1 flex-col justify-center py-24 pt-20 sm:py-28"
      >
        <motion.p
          variants={item}
          className="text-xs font-medium uppercase tracking-[0.28em] text-neutral-400 sm:text-sm"
        >
          {CONTACT_EYEBROW}
        </motion.p>

        {/* Balanced two-column composition: the headline holds the left, the
            supporting block (shape + description + CTA) sits to its right and
            bottom-aligns with it, so the whole hero reads within the first
            viewport. Stacks to a single column below lg. */}
        <div className="mt-6 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <motion.h1
            variants={container}
            className={`lg:min-w-0 lg:flex-1 ${HERO_HEADING}`}
          >
            {CONTACT_HEADLINE_LINES.map((line) => (
              <span key={line} className="block overflow-hidden pb-[0.12em]">
                <motion.span variants={word} className="block will-change-transform">
                  {line}
                </motion.span>
              </span>
            ))}
          </motion.h1>

          {/* Right column — shape above the description, with the primary action
              beneath. Aligned right on desktop / left on mobile. */}
          <motion.div
            variants={item}
            className="flex flex-col items-start gap-8 lg:w-[17rem] lg:shrink-0 lg:items-end lg:pb-2 lg:text-right xl:w-[24rem]"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none h-20 w-20 sm:h-24 sm:w-24 lg:h-24 lg:w-24"
            >
              <HeroShape />
            </div>
            <p className="text-[18px] font-light leading-[1.65] text-neutral-300">
              {CONTACT_INTRO}
            </p>
            <div className="shrink-0">
              <BrandButton
                label="Start Your Project"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId(FORM_TARGET_ID, reduce);
                }}
              />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Smooth scroll indicator. */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE, delay: 1.1 }}
        className="pointer-events-none absolute inset-x-0 bottom-7 z-20 flex justify-center"
      >
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

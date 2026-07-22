"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import AnnouncementBar from "@/src/components/Hero/AnnouncementBar";
import Navbar from "@/src/components/Hero/Navbar";
import BrandButton from "@/src/components/ui/BrandButton";
import { HERO_HEADING } from "@/src/lib/typography";
import { EASE } from "@/src/lib/motion";
import { scrollToId } from "@/src/lib/nav";
import {
  CONTACT_TARGET_ID,
  EVENTS_EYEBROW,
  EVENTS_HEADLINE_LINES,
  EVENTS_HERO_POSTER,
  EVENTS_HERO_VIDEO,
  EVENTS_INTRO,
} from "./constants";

/**
 * Cinematic fullscreen events hero. Same chrome + motion language as the home
 * hero (AnnouncementBar + Navbar + `#hero-nav-sentinel` handoff, dark surface,
 * ambient magenta/amber glows, film grain, signature `EASE`, masked per-line
 * headline cascade), but with a looping event video as the backdrop — darkened
 * for contrast so the light nav and copy stay readable. Ambient dust is supplied
 * by the global ParticleField via `data-particles="hero"`.
 */
export default function EventsHero() {
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
      id="events-top"
      data-particles="hero"
      className="relative flex min-h-[100svh] w-full flex-col overflow-hidden bg-[#1F1F1F] text-neutral-100"
    >
      {/* Layer 0 — cinematic looping video backdrop + darkening overlays. */}
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
        {/* Vertical scrim — darkest under the nav (top) and along the bottom so
            copy reads over any frame. */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/45 to-black/85" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_0%,transparent_45%,rgba(0,0,0,0.5)_100%)]" />
      </div>

      {/* Ambient floating glow — same decorative blobs as the homepage hero. */}
      {!reduce && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
          <motion.div
            className="absolute -left-24 top-32 h-[26rem] w-[26rem] rounded-full bg-[#6E1B45]/[0.16] blur-3xl"
            animate={{ y: [0, -28, 0], x: [0, 12, 0], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -right-28 bottom-28 h-[30rem] w-[30rem] rounded-full bg-amber-300/[0.10] blur-3xl"
            animate={{ y: [0, 24, 0], x: [0, -16, 0], opacity: [0.35, 0.6, 0.35] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          />
        </div>
      )}

      {/* Faint grain over the empty areas. */}
      <div
        aria-hidden="true"
        className="hero-grain pointer-events-none absolute inset-0 z-0 opacity-[0.05] mix-blend-soft-light"
      />

      {/* Navigation block — identical to the home hero, incl. handoff sentinel. */}
      <div className="relative z-30">
        <AnnouncementBar />
        <Navbar />
        <div id="hero-nav-sentinel" aria-hidden="true" className="h-0 w-full" />
      </div>

      {/* Copy — bottom-anchored editorial composition with generous whitespace. */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="container-page relative z-20 flex flex-1 flex-col justify-end pb-28 pt-16 sm:pb-32 lg:pb-36"
      >
        <motion.p
          variants={item}
          className="text-xs font-medium uppercase tracking-[0.28em] text-neutral-300 sm:text-sm"
        >
          {EVENTS_EYEBROW}
        </motion.p>

        <motion.h1 variants={container} className={`mt-6 ${HERO_HEADING}`}>
          {EVENTS_HEADLINE_LINES.map((line) => (
            <span key={line} className="block overflow-hidden pb-[0.12em]">
              <motion.span variants={word} className="block will-change-transform">
                {line}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        <motion.div
          variants={item}
          className="mt-10 flex flex-col gap-8 lg:mt-12 lg:flex-row lg:items-end lg:justify-between lg:gap-12"
        >
          <p className="max-w-2xl text-[18px] leading-[1.65] text-neutral-200 sm:text-[20px] lg:text-[22px]">
            {EVENTS_INTRO}
          </p>
          <div className="shrink-0">
            <BrandButton
              label="Start Your Project"
              onClick={(e) => {
                e.preventDefault();
                scrollToId(CONTACT_TARGET_ID, reduce);
              }}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Smooth scroll indicator. */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE, delay: 1.1 }}
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

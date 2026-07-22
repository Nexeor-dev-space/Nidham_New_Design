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
 * Services hero — deliberately its own thing, not the Events hero. Where the
 * Events hero uses a looping video and discrete floating blobs, this one is a
 * quiet, luxury, editorial title page: a subtle animated gradient "aurora"
 * (transform-driven, 60fps — see `.svc-aurora*` in globals.css), a huge masked
 * headline that dominates the screen, and only a small, restrained line of
 * supporting copy set off to the side. Ambient dust comes from the global
 * ParticleField via `data-particles="hero"`.
 *
 * The nav chrome (AnnouncementBar + Navbar + `#hero-nav-sentinel`) is shared
 * site furniture and stays, so the global FloatingNav handoff keeps working.
 * All copy is verbatim from src/components/Services/constants.
 */
export default function ServicesHero() {
  const reduce = useReducedMotion() ?? false;

  // Entrance orchestration — headline dominates; supporting copy lands quietly.
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
      id="services-top"
      data-particles="hero"
      className="relative flex min-h-[100svh] w-full flex-col overflow-hidden bg-[#141414] text-neutral-100"
    >
      {/* Layer 0 — animated gradient aurora. Large, soft, overlapping washes on
          a near-black base so the surface is always alive, never flat. */}
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

      {/* Very subtle film grain over the empty areas. */}
      <div
        aria-hidden="true"
        className="hero-grain pointer-events-none absolute inset-0 z-0 opacity-[0.04] mix-blend-soft-light"
      />

      {/* Navigation block — shared site chrome, incl. the FloatingNav handoff. */}
      <div className="relative z-30">
        <AnnouncementBar />
        <Navbar />
        <div id="hero-nav-sentinel" aria-hidden="true" className="h-0 w-full" />
      </div>

      {/* Copy — a centred editorial title page. The headline dominates; the
          intro is a small, restrained supporting line offset to the right. */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="container-page relative z-20 flex flex-1 flex-col justify-center pb-32 pt-16 sm:pt-20 lg:pb-40"
      >
        <motion.p
          variants={item}
          className="flex items-center gap-4 font-[family-name:var(--font-urbanist)] text-xs font-medium uppercase tracking-[0.32em] text-neutral-400 sm:text-sm"
        >
          <span aria-hidden="true" className="h-px w-10 bg-[#A6386B]/70" />
          {SERVICES_EYEBROW}
        </motion.p>

        <motion.h1 variants={container} className={`mt-8 ${HERO_HEADING}`}>
          {SERVICES_HEADLINE_LINES.map((line) => (
            <span key={line} className="block overflow-hidden pb-[0.12em]">
              <motion.span variants={word} className="block will-change-transform">
                {line}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        {/* Small supporting copy — restrained, muted, set to the right on
            desktop so the title keeps the stage. Wording is verbatim. */}
        <motion.p
          variants={item}
          className="mt-12 max-w-md self-start font-[family-name:var(--font-urbanist)] text-[15px] font-light leading-[1.7] text-neutral-400 sm:text-base lg:mt-14 lg:ml-auto lg:self-end lg:text-right"
        >
          {SERVICES_INTRO}
        </motion.p>
      </motion.div>

      {/* Minimal editorial scroll cue — a thin line that fills downward, with a
          quiet label. Distinct from the Events hero's centred pill dot. */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, ease: EASE, delay: 1.2 }}
        className="pointer-events-none absolute inset-x-0 bottom-8 z-20 flex flex-col items-center gap-4"
      >
        <span className="font-[family-name:var(--font-urbanist)] text-[10px] font-medium uppercase tracking-[0.4em] text-neutral-500">
          Scroll
        </span>
        <span className="relative block h-14 w-px overflow-hidden bg-white/12">
          <span
            className="svc-scroll-line absolute inset-x-0 top-0 block h-full bg-[linear-gradient(180deg,transparent,#A6386B)]"
            style={
              reduce
                ? undefined
                : { animation: "svcScrollLine 2.4s cubic-bezier(0.65,0,0.35,1) infinite" }
            }
          />
        </span>
      </motion.div>
    </header>
  );
}

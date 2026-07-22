"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import AnnouncementBar from "@/src/components/Hero/AnnouncementBar";
import Navbar from "@/src/components/Hero/Navbar";
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
 * `EASE`, masked per-line headline cascade), on a dark cinematic backdrop with
 * soft purple + champagne gradients, faint grain, and the global ParticleField
 * dust (`data-particles="hero"`). Lots of whitespace; a clear primary action
 * that glides to the form; a smooth scroll indicator.
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
      className="relative flex min-h-[100svh] w-full flex-col overflow-hidden bg-[#1F1F1F] text-neutral-100"
    >
      {/* Soft animated gradients — purple + warm champagne, plus a low glow. */}
      {!reduce && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
          <motion.div
            className="absolute -left-24 top-24 h-[28rem] w-[28rem] rounded-full bg-[#6E1B45]/[0.10] blur-3xl"
            animate={{ y: [0, -26, 0], x: [0, 12, 0], opacity: [0.45, 0.8, 0.45] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -right-28 top-56 h-[30rem] w-[30rem] rounded-full bg-amber-200/[0.09] blur-3xl"
            animate={{ y: [0, 24, 0], x: [0, -16, 0], opacity: [0.35, 0.6, 0.35] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          />
          <motion.div
            className="absolute bottom-[-8rem] left-1/2 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-[#6E1B45]/[0.07] blur-3xl"
            animate={{ opacity: [0.3, 0.55, 0.3], scale: [1, 1.05, 1] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          />
        </div>
      )}

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
        className="container-page relative z-20 flex flex-1 flex-col justify-center pb-28 pt-16 sm:pt-20 lg:pb-32"
      >
        <motion.p
          variants={item}
          className="text-xs font-medium uppercase tracking-[0.28em] text-neutral-400 sm:text-sm"
        >
          {CONTACT_EYEBROW}
        </motion.p>

        <motion.h1 variants={container} className={`mt-6 ${HERO_HEADING}`}>
          {CONTACT_HEADLINE_LINES.map((line) => (
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
          <p className="max-w-2xl text-[20px] font-light leading-[1.65] text-neutral-300">
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

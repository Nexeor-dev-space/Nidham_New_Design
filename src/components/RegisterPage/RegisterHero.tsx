"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import AnnouncementBar from "@/src/components/Hero/AnnouncementBar";
import Navbar from "@/src/components/Hero/Navbar";
import RegisterForm from "./RegisterForm";
import { EASE } from "@/src/lib/motion";
import {
  REGISTER_EYEBROW,
  REGISTER_HEADLINE_LINES,
  REGISTER_HIGHLIGHTS,
  REGISTER_INTRO,
} from "./constants";

/**
 * Register hero — a premium editorial split. The homepage chrome and motion
 * language are preserved exactly (AnnouncementBar + Navbar + `#hero-nav-sentinel`
 * handoff, dark surface, soft purple + champagne gradients, faint grain, global
 * ParticleField dust, signature `EASE`, masked per-line reveal). Left: large
 * typography, a short intro and elegant highlights. Right: the registration
 * form panel. Everything animates in on load.
 */
export default function RegisterHero() {
  const reduce = useReducedMotion() ?? false;

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.12 } },
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
      id="register-top"
      data-particles="hero"
      className="relative flex min-h-[100svh] w-full flex-col overflow-hidden bg-[#1F1F1F] text-neutral-100"
    >
      {/* Soft animated gradients — purple + warm champagne + low glow. */}
      {!reduce && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
          <motion.div
            className="absolute -left-24 top-28 h-[28rem] w-[28rem] rounded-full bg-[#6E1B45]/[0.10] blur-3xl"
            animate={{ y: [0, -26, 0], x: [0, 12, 0], opacity: [0.45, 0.8, 0.45] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute right-[-6rem] top-1/3 h-[32rem] w-[32rem] rounded-full bg-amber-200/[0.08] blur-3xl"
            animate={{ y: [0, 24, 0], x: [0, -16, 0], opacity: [0.3, 0.55, 0.3] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          />
        </div>
      )}

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

      {/* Editorial split. */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="container-page relative z-20 grid flex-1 grid-cols-1 items-center gap-14 py-16 sm:py-20 lg:grid-cols-2 lg:gap-20 lg:py-24"
      >
        {/* Left — typography + highlights. */}
        <div className="lg:pr-6">
          <motion.p
            variants={item}
            className="text-xs font-medium uppercase tracking-[0.28em] text-neutral-400 sm:text-sm"
          >
            {REGISTER_EYEBROW}
          </motion.p>

          <motion.h1
            variants={container}
            className="mt-6 font-[family-name:var(--font-cabinet)] text-[clamp(2.4rem,6vw,4.75rem)] font-normal leading-[0.98] tracking-[-0.03em] text-neutral-100"
          >
            {REGISTER_HEADLINE_LINES.map((line) => (
              <span key={line} className="block overflow-hidden pb-[0.1em]">
                <motion.span variants={word} className="block will-change-transform">
                  {line}
                </motion.span>
              </span>
            ))}
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-8 max-w-xl text-[17px] leading-[1.65] text-neutral-300 sm:text-[19px]"
          >
            {REGISTER_INTRO}
          </motion.p>

          {/* Highlights — editorial list, not cards. */}
          <motion.ul variants={container} className="mt-10 flex flex-col">
            {REGISTER_HIGHLIGHTS.map((h) => (
              <motion.li
                key={h.id}
                variants={item}
                className="group flex items-center gap-4 border-t border-white/10 py-4 last:border-b"
              >
                <span
                  aria-hidden="true"
                  className="h-px w-6 shrink-0 bg-[#A6386B] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-10"
                />
                <span className="font-[family-name:var(--font-cabinet)] text-[clamp(1.15rem,2.2vw,1.6rem)] font-normal tracking-[-0.01em] text-neutral-200 transition-colors duration-500 group-hover:text-white">
                  {h.title}
                </span>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        {/* Right — registration form. */}
        <motion.div variants={item} className="w-full">
          <RegisterForm />
        </motion.div>
      </motion.div>
    </header>
  );
}

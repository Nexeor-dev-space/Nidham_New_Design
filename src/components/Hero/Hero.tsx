"use client";

import { useRef } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import AnnouncementBar from "./AnnouncementBar";
import Navbar from "./Navbar";
import HeroAmbient from "./HeroAmbient";
import HeroShape from "./HeroShape";
import { useHeroScroll } from "@/src/hooks/useHeroScroll";
import { HERO_HEADING } from "@/src/lib/typography";

/** Shared premium easing — a soft, expensive-feeling ease-out. */
const EASE = [0.22, 1, 0.36, 1] as const;

/** Authored as balanced lines so the headline cascades like the reference.
    "entertainment" is the widest line and governs the fluid size ceiling. */
const HEADING_LINES = [
  "Creative",
  "experiences for",
  "every audience",
  
] as const;

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
      data-particles="hero"
      className="relative w-full overflow-hidden bg-[#f1efec] text-neutral-900"
    >
      {/* Ambient lighting (Layer 0) — three small, masked + blurred Aurora
          glows that fill only the empty cream areas (top-left / top-right /
          behind the headline) plus faint film grain. Backmost, pointer-none;
          never over the video, never touching the text. See HeroAmbient. */}
      <HeroAmbient />

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
      {/* Handoff marker: once this scrolls above the viewport top (i.e. the top
          nav has left), the global FloatingNav takes over. */}
      <div id="hero-nav-sentinel" aria-hidden="true" className="h-0 w-full" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative section-y-b pt-10 sm:pt-24 lg:pt-36"
      >
        {/* Content layer (Layer 3) — GSAP scrubs this wrapper's transform on
            scroll; Framer drives the entrance reveal on the children inside. */}
        <div
          ref={contentRef}
          className="container-page origin-left will-change-transform"
        >

          {/* Editorial headline left, supporting column bottom-aligned right. */}
          <div className="relative mt-6 flex flex-col gap-8 lg:mt-6 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
            {/* Decorative rotating gradient blob — on the right: above the
                supporting paragraph (desktop) / beside the last headline line
                (mobile). */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-6 top-[5.5rem] z-[5] h-14 w-14 animate-[spin_18s_linear_infinite] motion-reduce:animate-none sm:right-10 sm:top-[8rem] sm:h-20 sm:w-20 lg:right-4 lg:top-4 lg:h-[6.5rem] lg:w-[6.5rem]"
            >
              <HeroShape />
            </div>

            {/* Masked per-line reveal — each line rises out of a clipped row,
                giving a four-line editorial cascade in a clean, normal weight. */}
            <motion.h1
              variants={container}
              className={`${HERO_HEADING} will-change-transform lg:min-w-0 lg:flex-1`}
            >
              {HEADING_LINES.map((line) => (
                <span key={line} className="block overflow-hidden pb-[0.2em]">
                  <motion.span
                    variants={word}
                    className="block will-change-transform"
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </motion.h1>

            <motion.p
              variants={item}
              className="max-w-2xl font-[family-name:var(--font-helvetica-now-text)] text-[18px] leading-[1.65] text-neutral-600 will-change-transform sm:text-[20px] lg:w-[17rem] lg:shrink-0 lg:pb-2 lg:text-[23px] xl:w-[22rem] 2xl:w-[25rem]"
            >
              Nidham Consultancy is a multidisciplinary entertainment and media
              company delivering exceptional live events, artist collaborations,
              strategic consulting, and immersive experiences that connect
              audiences, brands, and communities across every stage.
            </motion.p>
          </div>
        </div>

        {/* Cinematic hero video (Layer 1) — full-bleed, edge-to-edge, tall and
            immersive so it reads as the dominant focal point directly beneath
            the headline. Framer runs the entrance; GSAP scrubs the inner <video>
            transform (slow drift + 1.08→1.00 scale) for the parallax. */}
        <motion.div
          variants={media}
          className="full-bleed mt-8 sm:mt-10 lg:mt-14"
        >
          <div
            data-cursor="video"
            className="relative h-[58vh] w-full overflow-hidden bg-neutral-900 sm:h-[70vh] lg:h-[82vh]"
          >
            <video
              ref={videoRef}
              className="absolute -top-[14%] left-0 h-[128%] w-full object-cover will-change-transform"
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

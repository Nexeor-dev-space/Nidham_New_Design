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

  // Two motion systems, strictly separated by element. Framer owns the entrance
  // and never touches a node GSAP scrubs; GSAP owns the scroll transition and
  // never touches a node Framer animates. Hence the plain wrapper divs around
  // the headline/description below — they are GSAP's handles, so the two can
  // never fight over the same transform. See useHeroScroll.
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const shapeRef = useRef<HTMLDivElement>(null);
  const decorRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);

  useHeroScroll({
    section: sectionRef,
    stage: stageRef,
    video: videoRef,
    headline: headlineRef,
    description: descriptionRef,
    shape: shapeRef,
    decor: decorRef,
    scrim: scrimRef,
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
    // From md up the hero is exactly one viewport tall and lays itself out as a
    // column: ribbon + nav + copy take their natural height and the video card
    // absorbs whatever is left (`flex-1` below). That's what lets the whole
    // composition fit the screen before the pin engages, at any viewport height,
    // without a single magic number. `overflow-hidden` is load-bearing: it clips
    // the video card once it scales past the viewport on the overshooting axis.
    <header
      ref={sectionRef}
      id="top"
      data-particles="hero"
      className="relative flex w-full flex-col overflow-hidden bg-[#1F1F1F] text-neutral-100 md:h-[100svh]"
    >
      {/* Ambient lighting (Layer 0) — three small, masked + blurred Aurora
          glows that fill only the empty cream areas (top-left / top-right /
          behind the headline) plus faint film grain. Backmost, pointer-none;
          never over the video, never touching the text. See HeroAmbient. */}
      <HeroAmbient />

      {/* Ambient floating glow (Layer 1) — decorative, purely atmospheric.
          The wrapper's opacity is scrubbed away on scroll; the inner glows keep
          their own idle float, so parent-fade and child-float compose cleanly. */}
      {!reduce && (
        <div
          ref={decorRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 will-change-[opacity]"
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

      {/* Nav scrim (Layer 3.5) — above the video, below the nav. Invisible at
          rest (the nav sits on the dark hero background) and scrubbed in only as
          the video climbs behind the nav, which is otherwise white-on-bright and
          unreadable. Never shown on mobile or under reduced motion, where the
          video stays in its card and never reaches the nav. */}
      <div
        ref={scrimRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-44 bg-gradient-to-b from-black/65 via-black/30 to-transparent opacity-0"
      />

      {/* Navigation (Layer 4) — the topmost layer, so it keeps floating over the
          video once that has taken the full screen. */}
      <div className="relative z-30">
        <AnnouncementBar />
        <Navbar />
        {/* Handoff marker: once this scrolls above the viewport top (i.e. the top
            nav has left), the global FloatingNav takes over. While the hero is
            pinned the marker stays on screen, so the pill appears exactly as the
            hero finally scrolls away. */}
        <div id="hero-nav-sentinel" aria-hidden="true" className="h-0 w-full" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative flex flex-1 flex-col pb-[var(--section-py)] pt-16 sm:pt-28 md:min-h-0 md:pb-[var(--container-px)] md:pt-12 lg:pt-16"
      >
        {/* Copy (Layer 3) — above the video, so it fades *over* the rising card
            rather than being covered by it. */}
        <div className="container-page relative z-20">
          {/* Editorial headline left, supporting column bottom-aligned right. */}
          <div className="relative mt-6 flex flex-col gap-8 lg:mt-6 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
            {/* Decorative rotating gradient blob — on the right: above the
                supporting paragraph (desktop) / beside the last headline line
                (mobile). The <svg> owns its own spin (see HeroShape); this
                wrapper only positions it and lets GSAP scrub its opacity, so the
                two never collide on `transform`. */}
            <div
              ref={shapeRef}
              aria-hidden="true"
              className="pointer-events-none absolute right-6 top-[5.5rem] z-[5] h-14 w-14 sm:right-10 sm:top-[8rem] sm:h-20 sm:w-20 lg:right-4 lg:top-4 lg:h-[6.5rem] lg:w-[6.5rem]"
            >
              <HeroShape />
            </div>

            {/* Masked per-line reveal — each line rises out of a clipped row,
                giving a four-line editorial cascade in a clean, normal weight. */}
            <div
              ref={headlineRef}
              className="will-change-[transform,opacity] lg:min-w-0 lg:flex-1"
            >
              <motion.h1 variants={container} className={HERO_HEADING}>
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
            </div>

            <div
              ref={descriptionRef}
              className="will-change-[transform,opacity] lg:w-[17rem] lg:shrink-0 lg:pb-2 xl:w-[22rem] 2xl:w-[25rem]"
            >
              <motion.p
                variants={item}
                className="max-w-2xl text-[18px] leading-[1.65] text-neutral-300 sm:text-[20px] lg:text-[23px]"
              >
                Nidham Consultancy is a multidisciplinary entertainment and media
                company delivering exceptional live events, artist collaborations,
                strategic consulting, and immersive experiences that connect
                audiences, brands, and communities across every stage.
              </motion.p>
            </div>
          </div>
        </div>

        {/* Cinematic hero video (Layer 2) — at rest a rounded card inset by the
            page gutter on all four sides, sitting directly beneath the headline.
            Framer runs the entrance on this wrapper; GSAP scrubs the card inside
            it from this box out to a full-screen cover. The card is uniformly
            scaled (never per-axis), so the footage cannot stretch — the
            overshooting axis is clipped by the header's overflow-hidden. */}
        <motion.div
          variants={media}
          className="container-page relative z-10 mt-8 flex sm:mt-10 md:mt-5 md:min-h-0 md:flex-1 lg:mt-6"
        >
          <div
            ref={stageRef}
            data-cursor="video"
            className="relative h-[58vh] w-full origin-center overflow-hidden rounded-[24px] bg-neutral-900 will-change-transform md:h-full"
          >
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover will-change-[filter]"
              src="/video/dubai-event-banner-1.mp4"
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

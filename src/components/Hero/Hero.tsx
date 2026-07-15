"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import AnnouncementBar from "./AnnouncementBar";
import Navbar from "./Navbar";

/** Shared premium easing — a soft, expensive-feeling ease-out. */
const EASE = [0.22, 1, 0.36, 1] as const;

const HEADING_WORDS = ["Creative", "Vision"] as const;

export default function Hero() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll-linked parallax: as the section leaves the viewport, the text
  // layers lift away at different speeds while the video sinks and scales,
  // creating cinematic depth. A spring smooths the raw scroll into a fluid,
  // premium feel instead of a rigid 1:1 mapping.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });
  const p = (v: number) => (reduce ? 0 : v);

  // Differential text parallax — heading travels fastest, description slowest.
  const eyebrowY = useTransform(smooth, [0, 1], [0, p(-40)]);
  const headingY = useTransform(smooth, [0, 1], [0, p(-90)]);
  const descY = useTransform(smooth, [0, 1], [0, p(-55)]);
  const textScale = useTransform(smooth, [0, 1], [1, reduce ? 1 : 0.96]);
  const textFade = useTransform(smooth, [0, 0.75], [1, reduce ? 1 : 0]);

  // Video: sinks downward (opposite the text) and scales, with the cinematic
  // overlay deepening as it exits for a fade-to-black feel.
  const videoY = useTransform(smooth, [0, 1], [0, p(120)]);
  const videoScale = useTransform(smooth, [0, 1], [1, reduce ? 1 : 1.16]);
  const cardScale = useTransform(smooth, [0, 1], [1, reduce ? 1 : 0.97]);
  const exitOverlay = useTransform(smooth, [0, 1], [0, reduce ? 0 : 0.5]);

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
      {/* Ambient floating glow — decorative, purely atmospheric. */}
      {!reduce && (
        <>
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -left-24 top-24 h-[26rem] w-[26rem] rounded-full bg-[#6E1B45]/[0.07] blur-3xl"
            animate={{ y: [0, -28, 0], x: [0, 12, 0], opacity: [0.5, 0.85, 0.5] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -right-32 top-64 h-[30rem] w-[30rem] rounded-full bg-amber-300/[0.10] blur-3xl"
            animate={{ y: [0, 26, 0], x: [0, -16, 0], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          />
        </>
      )}

      <AnnouncementBar />
      <Navbar />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto max-w-[1600px] px-6 pb-14 pt-12 sm:pt-14 lg:px-10"
      >
        <motion.div style={{ scale: textScale, opacity: textFade }} className="origin-left">
          <motion.p
            variants={item}
            style={{ y: eyebrowY }}
            className="text-xl font-normal tracking-tight text-neutral-900 will-change-transform sm:text-2xl lg:text-3xl"
          >
            Vision. Impact. Excellence.
          </motion.p>

          {/* Masked per-word reveal. Each word rises out of a clipped row. */}
          <motion.h1
            variants={container}
            style={{ y: headingY }}
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
            style={{ y: descY }}
            className="mt-4 max-w-2xl text-lg text-neutral-500 will-change-transform sm:text-xl lg:text-2xl"
          >
            A Strategic Studio for Technology, Entertainment &amp; Media.
          </motion.p>
        </motion.div>

        {/* Cinematic background video with scroll parallax + overlay. */}
        <motion.div variants={media} style={{ scale: cardScale }} className="mt-12 lg:mt-14">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-neutral-900 shadow-[0_40px_80px_-32px_rgba(0,0,0,0.45)] ring-1 ring-black/5 sm:aspect-[16/9] lg:aspect-[1280/672]">
            <motion.video
              style={{ y: videoY, scale: videoScale }}
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
            {/* Scroll-driven fade-to-black as the card exits the viewport. */}
            <motion.div
              aria-hidden="true"
              style={{ opacity: exitOverlay }}
              className="absolute inset-0 bg-black"
            />
          </div>
        </motion.div>
      </motion.div>
    </header>
  );
}

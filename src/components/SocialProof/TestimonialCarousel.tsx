"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import type { Testimonial } from "./types";
import { EASE } from "@/src/lib/motion";

const AUTOPLAY_MS = 6500;
const SWIPE_THRESHOLD = 70;

/** First-letter monogram from a full name, e.g. "Fatima Al Marri" → "FM". */
function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

/**
 * The testimonial experience — a single large editorial quote card that
 * cross-fades (fade + slight scale + blur, never a hard slide) between
 * clients.
 *
 * Behaviour: slow autoplay that pauses on hover/focus, prev/next controls,
 * clickable pagination, and horizontal swipe on touch (Framer drag with an
 * offset threshold). Reduced motion collapses the blur/scale to a plain fade
 * and disables both autoplay and drag.
 *
 * The card carries its own glass surface, an oversized gold quotation mark, and
 * a soft gold border-glow; the author block pairs a gradient monogram avatar
 * with the company's white wordmark.
 */
export default function TestimonialCarousel({
  testimonials,
}: {
  testimonials: readonly Testimonial[];
}) {
  const reduce = useReducedMotion() ?? false;
  const count = testimonials.length;

  // `page` is unbounded (so direction is always known); `index` wraps it.
  const [[page, direction], setPage] = useState<[number, number]>([0, 0]);
  const [paused, setPaused] = useState(false);
  const index = ((page % count) + count) % count;
  const active = testimonials[index];

  const paginate = useCallback((dir: number) => {
    setPage(([p]) => [p + dir, dir]);
  }, []);

  const goTo = useCallback(
    (target: number) => {
      setPage(([p]) => {
        const current = ((p % count) + count) % count;
        return [p + (target - current), target > current ? 1 : -1];
      });
    },
    [count],
  );

  // Slow autoplay — paused on hover/focus and under reduced motion.
  useEffect(() => {
    if (paused || reduce || count <= 1) return;
    const id = setInterval(() => paginate(1), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, reduce, count, page, paginate]);

  const variants: Variants = {
    enter: {
      opacity: 0,
      scale: reduce ? 1 : 0.96,
      filter: reduce ? "blur(0px)" : "blur(14px)",
    },
    center: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
    },
    exit: {
      opacity: 0,
      scale: reduce ? 1 : 0.98,
      filter: reduce ? "blur(0px)" : "blur(14px)",
    },
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* Stage. Fixed-ish min-height keeps controls from jumping as quotes of
          different lengths swap in. aria-live announces the active quote. */}
      <div
        className="relative mx-auto flex min-h-[380px] max-w-4xl items-stretch sm:min-h-[340px]"
        aria-live="polite"
        aria-atomic="true"
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.blockquote
            key={active.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: reduce ? 0.35 : 0.6, ease: EASE }}
            drag={reduce || count <= 1 ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.16}
            onDragEnd={(_, info) => {
              if (info.offset.x < -SWIPE_THRESHOLD) paginate(1);
              else if (info.offset.x > SWIPE_THRESHOLD) paginate(-1);
            }}
            className="relative w-full cursor-grab overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.025] p-8 backdrop-blur-md active:cursor-grabbing sm:p-12 lg:p-16"
          >
            {/* Soft gold border-glow. */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-[28px] bg-[radial-gradient(60%_60%_at_15%_0%,rgba(199,154,46,0.10),transparent_65%)]"
            />

            {/* Oversized editorial quotation mark. */}
            <span
              aria-hidden
              className="pointer-events-none absolute left-6 top-1 select-none font-[family-name:var(--font-cabinet)] text-[8rem] leading-none text-[#C79A2E]/20 sm:left-10 sm:text-[10rem]"
            >
              &ldquo;
            </span>

            <p className="relative mt-10 font-[family-name:var(--font-cabinet)] text-[clamp(1.3rem,2.5vw,2.05rem)] font-normal leading-[1.42] tracking-[-0.01em] text-neutral-100 sm:mt-12">
              {active.quote}
            </p>

            {/* Author row. */}
            <footer className="relative mt-9 flex items-center gap-4 sm:mt-11">
              {/* Gradient monogram avatar — no image asset needed. */}
              <span
                aria-hidden
                className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#C79A2E_0%,#6E1B45_100%)] text-[15px] font-semibold tracking-wide text-white shadow-[0_6px_20px_-6px_rgba(199,154,46,0.5)]"
              >
                {initialsOf(active.name)}
              </span>

              <div className="min-w-0">
                <div className="truncate text-[16px] font-semibold text-neutral-50">
                  {active.name}
                </div>
                <div className="truncate text-[13.5px] text-neutral-400">
                  {active.position ? `${active.position}, ` : ""}
                  <span className="text-[#C79A2E]/90">{active.company}</span>
                </div>
              </div>

              {active.logo && (
                <Image
                  src={active.logo}
                  alt={active.company}
                  width={active.logoWidth ?? 200}
                  height={active.logoHeight ?? 200}
                  unoptimized
                  loading="lazy"
                  className="ml-auto hidden h-7 w-auto max-w-[120px] object-contain opacity-60 sm:block"
                />
              )}
            </footer>
          </motion.blockquote>
        </AnimatePresence>
      </div>

      {/* Controls — prev · dots · next. Centred, touch-friendly (44px). */}
      <div className="mt-9 flex items-center justify-center gap-5">
        <button
          type="button"
          onClick={() => paginate(-1)}
          aria-label="Previous testimonial"
          className="grid h-11 w-11 place-items-center rounded-full border border-white/12 bg-white/[0.03] text-neutral-300 transition-colors duration-300 hover:border-[#C79A2E]/40 hover:text-[#C79A2E]"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>

        <div className="flex items-center gap-2.5" role="tablist" aria-label="Select testimonial">
          {testimonials.map((t, i) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Show testimonial from ${t.name}`}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                i === index
                  ? "w-7 bg-[#C79A2E]"
                  : "w-2 bg-white/25 hover:bg-white/40"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => paginate(1)}
          aria-label="Next testimonial"
          className="grid h-11 w-11 place-items-center rounded-full border border-white/12 bg-white/[0.03] text-neutral-300 transition-colors duration-300 hover:border-[#C79A2E]/40 hover:text-[#C79A2E]"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

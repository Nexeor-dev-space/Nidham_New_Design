"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useGsapReveal } from "@/src/hooks/useGsapReveal";
import { EASE } from "@/src/lib/motion";
import { TESTIMONIALS, TESTIMONIALS_TITLE } from "./constants";

/** How long each testimonial stays before auto-advancing (ms). */
const ROTATE_MS = 6500;

/**
 * Client testimonials as large editorial quotes — one visible at a time, cross-
 * fading smoothly. Auto-advances on a timer (paused for reduced-motion users,
 * who instead get dot controls) and can always be driven by the dots. The
 * heading/quote block fades up on scroll via the shared GSAP reveal; the quote
 * swap itself is a Framer cross-fade so the two motion systems never touch the
 * same node.
 */
export default function Testimonials() {
  const reduce = useReducedMotion() ?? false;
  const scopeRef = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);

  useGsapReveal(scopeRef);

  // Auto-rotate (skipped under reduced motion). Re-armed whenever `index`
  // changes so manual selection restarts the dwell.
  useEffect(() => {
    if (reduce) return;
    const t = setTimeout(
      () => setIndex((i) => (i + 1) % TESTIMONIALS.length),
      ROTATE_MS,
    );
    return () => clearTimeout(t);
  }, [index, reduce]);

  const current = TESTIMONIALS[index];

  return (
    <section
      ref={scopeRef}
      aria-label="Client testimonials"
      data-particles="services"
      className="relative w-full bg-[#1F1F1F] section-y"
    >
      <div className="container-page">
        <p
          data-reveal="up"
          className="text-center text-xs font-medium uppercase tracking-[0.28em] text-neutral-500 sm:text-sm"
        >
          {TESTIMONIALS_TITLE}
        </p>

        <div
          data-reveal="up"
          className="relative mx-auto mt-10 flex min-h-[16rem] max-w-4xl flex-col items-center justify-center text-center sm:mt-14 sm:min-h-[18rem]"
          aria-live="polite"
        >
          <span
            aria-hidden="true"
            className="font-[family-name:var(--font-cabinet)] text-6xl leading-none text-[#6E1B45]/60 sm:text-7xl"
          >
            &ldquo;
          </span>

          <AnimatePresence mode="wait">
            <motion.blockquote
              key={current.id}
              initial={{ opacity: 0, y: reduce ? 0 : 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduce ? 0 : -14 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="mt-2"
            >
              <p className="font-[family-name:var(--font-cabinet)] text-[clamp(1.5rem,3.4vw,2.75rem)] font-normal leading-[1.24] tracking-[-0.015em] text-neutral-100">
                {current.quote}
              </p>
              <footer className="mt-8 flex flex-col items-center gap-0.5">
                <span className="text-[15px] font-medium text-neutral-100">
                  {current.name}
                </span>
                <span className="text-sm text-neutral-500">{current.role}</span>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        {/* Dot controls. */}
        <div className="mt-10 flex items-center justify-center gap-3">
          {TESTIMONIALS.map((t, i) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setIndex(i)}
              data-cursor="button"
              aria-label={`Show testimonial ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              className={`h-2 rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6E1B45] ${
                i === index
                  ? "w-8 bg-[#A6386B]"
                  : "w-2 bg-white/25 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
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

/** First-letter monogram from a full name, e.g. "Fatima Musharraf" → "FM". */
function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

/**
 * How far a card travels in/out horizontally, as a % of its own width.
 * Partial rather than a full 100%: the card is wide, and sliding the whole
 * width makes the swap feel like a page turn. 22% plus the fade reads as the
 * quote being replaced rather than the layout scrolling.
 */
const SLIDE_PERCENT = 22;

/**
 * The testimonial experience — a single large editorial quote card that slides
 * horizontally between clients, in the direction of travel.
 *
 * It used to cross-fade in place, which with a blur on a card this large read as
 * a blink rather than a transition — there was no cue about which way the
 * carousel had moved. The card now enters from the side it is coming *from* and
 * exits to the opposite side, so forward and backward are visibly different.
 *
 * Behaviour: continuous autoplay (see AUTOPLAY_MS), prev/next controls,
 * clickable pagination, and horizontal swipe on touch (Framer drag with an
 * offset threshold). It pauses only for *keyboard* focus — not hover, and not a
 * mouse click; both of those used to stop it, see the notes below. Reduced
 * motion drops the slide to a plain fade and disables autoplay and drag
 * entirely.
 *
 * Attribution is the name only — no role, company or logo (see `Testimonial`).
 *
 * Palette is the site's brand pink (`#E00068`, deepening to `#8C003B`), matching
 * BUTTON_SKIN and the nav. It was previously an unrelated champagne gold, which
 * is why the section read as belonging to a different site.
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

  /**
   * Slow autoplay. Keyed to `page` on purpose: any manual navigation restarts
   * the full interval, so a click is never followed by an auto-advance a beat
   * later.
   *
   * There is deliberately **no hover pause**. It used to pause on
   * `mouseenter`, and on a card this size — ~380px tall and the full content
   * width — a cursor resting anywhere over the quote silently froze the
   * rotation, so the carousel read as static in exactly the situation where
   * someone is looking at it. WCAG 2.2.2 is still satisfied: the prev/next
   * controls and dots are a real pause-and-choose mechanism, and reduced motion
   * stops the rotation outright.
   */
  useEffect(() => {
    if (paused || reduce || count <= 1) return;
    const id = setInterval(() => paginate(1), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, reduce, count, page, paginate]);

  /**
   * Direction-aware slide. `custom` carries the direction (+1 forward, −1 back),
   * so the incoming card enters from the side the carousel is travelling from
   * and the outgoing one leaves the opposite way.
   *
   * The blur is gone: on a card this size it was what made the swap read as a
   * blink, and it fights the horizontal movement for attention. Reduced motion
   * drops the travel entirely and keeps a plain fade.
   */
  const variants: Variants = {
    enter: (dir: number) => ({
      opacity: 0,
      x: reduce ? 0 : `${dir > 0 ? SLIDE_PERCENT : -SLIDE_PERCENT}%`,
    }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({
      opacity: 0,
      x: reduce ? 0 : `${dir > 0 ? -SLIDE_PERCENT : SLIDE_PERCENT}%`,
    }),
  };

  /**
   * Pause on focus, but only when the focus is *keyboard*-driven.
   *
   * A plain `onFocusCapture` was one of two reasons this carousel appeared not
   * to autoplay at all: clicking prev/next or a dot leaves that button focused,
   * so `paused` latched true and autoplay never resumed — one click killed it
   * for good. `:focus-visible` is false for a mouse click on a button and true
   * for tab navigation, which is exactly the distinction wanted: a keyboard user
   * working through the controls should not have the quote change underneath
   * them; a mouse user who clicked once should not lose autoplay forever.
   *
   * The other reason was hover-pause, now removed — see the note above the
   * autoplay effect.
   */
  const handleFocusCapture = (event: React.FocusEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (typeof target.matches === "function" && target.matches(":focus-visible")) {
      setPaused(true);
    }
  };

  return (
    <div
      className="relative"
      onFocusCapture={handleFocusCapture}
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
            {/* Soft brand-pink border-glow. */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-[28px] bg-[radial-gradient(60%_60%_at_15%_0%,rgba(224,0,104,0.12),transparent_65%)]"
            />

            {/* Oversized editorial quotation mark. */}
            <span
              aria-hidden
              className="pointer-events-none absolute left-6 top-1 select-none font-[family-name:var(--font-cabinet)] text-[8rem] leading-none text-[#E00068]/25 sm:left-10 sm:text-[10rem]"
            >
              &ldquo;
            </span>

            <p className="relative mt-10 font-[family-name:var(--font-cabinet)] text-[clamp(1.3rem,2.5vw,2.05rem)] font-normal leading-[1.42] tracking-[-0.01em] text-neutral-100 sm:mt-12">
              {active.quote}
            </p>

            {/* Author row — the name alone. See the note on `Testimonial`. */}
            <footer className="relative mt-9 flex items-center gap-4 sm:mt-11">
              {/* Gradient monogram avatar — no image asset needed. */}
              <span
                aria-hidden
                className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#E00068_0%,#8C003B_100%)] text-[15px] font-semibold tracking-wide text-white shadow-[0_6px_20px_-6px_rgba(224,0,104,0.5)]"
              >
                {initialsOf(active.name)}
              </span>

              <div className="min-w-0 truncate text-[16px] font-semibold text-neutral-50">
                {active.name}
              </div>
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
          className="grid h-11 w-11 place-items-center rounded-full border border-white/12 bg-white/[0.03] text-neutral-300 transition-colors duration-300 hover:border-[#E00068]/50 hover:text-[#E00068]"
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
                  ? "w-7 bg-[#E00068]"
                  : "w-2 bg-white/25 hover:bg-white/40"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => paginate(1)}
          aria-label="Next testimonial"
          className="grid h-11 w-11 place-items-center rounded-full border border-white/12 bg-white/[0.03] text-neutral-300 transition-colors duration-300 hover:border-[#E00068]/50 hover:text-[#E00068]"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

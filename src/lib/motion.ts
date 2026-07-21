/**
 * Unified motion system — the single source of truth for the whole site's
 * scroll choreography. Every section pulls its easing, durations, stagger,
 * viewport trigger and reveal variants from here, so the page reads as one
 * continuous, premium motion language rather than a set of independently-tuned
 * animations.
 *
 * Two runtimes, one language:
 *   • Framer Motion  → `EASE` + the variant factories (fadeUp, heading, card…).
 *   • GSAP           → `GSAP_EASE`, `ST_START`, `gsapEntranceDefaults`.
 * The GSAP ease is matched to the Framer bezier so both read identically.
 *
 * Reveal grammar (kept consistent everywhere):
 *   headings rise + fade → body rises in sequence → cards stagger → buttons
 *   land last → images reveal via mask + 105%→100% scale, and drift on scroll.
 */
import type { Variants } from "framer-motion";

/** Signature easing — a soft, expensive ease-out. Used site-wide. */
export const EASE = [0.22, 1, 0.36, 1] as const;
/** Same curve for CSS transitions (hover states). */
export const EASE_CSS = "cubic-bezier(0.22, 1, 0.36, 1)";
/** GSAP counterpart — matched feel to `EASE`. */
export const GSAP_EASE = "power3.out";

/** Canonical durations (seconds) — the only speeds the site should use. */
export const DUR = {
  fast: 0.6,
  base: 0.8,
  slow: 1.1,
  image: 1.25,
} as const;

/** Sequencing constants. */
export const STAGGER = 0.12;
export const DELAY_STEP = 0.15;

/** Framer `whileInView` trigger — fire once, a touch before fully on screen. */
export const VIEWPORT = { once: true, margin: "-12% 0px -12% 0px" } as const;

/** GSAP ScrollTrigger entrance start — one point for every section. */
export const ST_START = "top 80%";

/** Default config for GSAP entrance timelines. */
export const gsapEntranceDefaults = { ease: GSAP_EASE, force3D: true } as const;

/* --------------------------------------------------------------------------
 * Framer variant factories. Pass `reduce` (from useReducedMotion) so the
 * whole system honours prefers-reduced-motion by collapsing the movement.
 * ------------------------------------------------------------------------ */

/** Fade + rise — the workhorse reveal for text and blocks. */
export const fadeUp = (reduce = false, delay = 0, y = 24): Variants => ({
  hidden: { opacity: 0, y: reduce ? 0 : y },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR.base, ease: EASE, delay },
  },
});

/** Section heading — a slightly larger rise, unified across sections. */
export const heading = (reduce = false, delay = DELAY_STEP): Variants =>
  fadeUp(reduce, delay, 26);

/** Card reveal — rise + subtle scale. Index-staggered where cards are siblings. */
export const card = (reduce = false, index = 0): Variants => ({
  hidden: { opacity: 0, y: reduce ? 0 : 40, scale: reduce ? 1 : 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: DUR.base, ease: EASE, delay: index * STAGGER },
  },
});

/** Button — fades in last with a small lift. */
export const button = (reduce = false, delay = 0.45): Variants => ({
  hidden: { opacity: 0, y: reduce ? 0 : 22, scale: reduce ? 1 : 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: DUR.fast, ease: EASE, delay },
  },
});

/** Image reveal — 105%→100% scale + upward mask wipe + fade. */
export const imageMask = (reduce = false): Variants => ({
  hidden: {
    opacity: 0,
    y: reduce ? 0 : 26,
    scale: reduce ? 1 : 1.05,
    clipPath: reduce ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)",
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: DUR.slow, ease: EASE },
  },
});

/** Parent that staggers its children (for grouped reveals). */
export const staggerContainer = (
  reduce = false,
  stagger = STAGGER,
  delayChildren = 0,
): Variants => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: reduce ? 0 : stagger,
      delayChildren: reduce ? 0 : delayChildren,
    },
  },
});

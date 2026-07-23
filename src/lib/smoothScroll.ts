"use client";

import type Lenis from "lenis";

/**
 * A module-level handle to the one live Lenis instance.
 *
 * Lenis is a singleton for the whole document, so rather than thread it through
 * React context (which would force every consumer to be a descendant of a
 * provider and re-render on nothing), the SmoothScroll component publishes the
 * instance here and nav/scroll helpers read it directly. `null` whenever smooth
 * scrolling is disabled — reduced motion, or before mount — and callers fall
 * back to native scrolling, so nothing depends on Lenis being present.
 */
let lenis: Lenis | null = null;

/** Called by SmoothScroll on mount/unmount. Not for general use. */
export function setLenis(instance: Lenis | null): void {
  lenis = instance;
}

/** The live instance, or null when smooth scrolling is off. */
export function getLenis(): Lenis | null {
  return lenis;
}

/**
 * Smooth-scroll to a target (element id, element, or absolute Y), routed through
 * Lenis when it is running so it shares one eased, ScrollTrigger-synced motion
 * with the wheel. Falls back to native `scrollIntoView` / `scrollTo` when Lenis
 * is off (reduced motion) or the target is missing, so callers never branch.
 *
 * `immediate` jumps with no animation — used for reduced motion.
 */
export function smoothScrollTo(
  target: string | HTMLElement | number,
  opts: { immediate?: boolean; offset?: number } = {},
): void {
  const { immediate = false, offset = 0 } = opts;

  if (lenis) {
    lenis.scrollTo(target, {
      offset,
      immediate,
      // A touch longer than the wheel's own easing so a jump to an anchor reads
      // as deliberate travel, not a snap.
      duration: immediate ? 0 : 1.1,
    });
    return;
  }

  // --- native fallback (Lenis disabled) ---
  const behavior: ScrollBehavior = immediate ? "auto" : "smooth";
  if (typeof target === "number") {
    window.scrollTo({ top: target + offset, behavior });
    return;
  }
  const el =
    typeof target === "string" ? document.getElementById(target) : target;
  el?.scrollIntoView({ behavior, block: "start" });
}

/**
 * Freeze / release page scrolling for the duration of a modal or drawer.
 *
 * `overflow: hidden` on the body alone does NOT stop Lenis — Lenis reads the
 * wheel on the window, so the background would still glide behind an open
 * overlay. This pauses Lenis as well, and pairs the two so callers make one
 * call. Safe when Lenis is off: the body style still applies.
 */
export function lockScroll(): void {
  lenis?.stop();
  document.documentElement.style.overflow = "hidden";
}

export function unlockScroll(): void {
  document.documentElement.style.overflow = "";
  lenis?.start();
}

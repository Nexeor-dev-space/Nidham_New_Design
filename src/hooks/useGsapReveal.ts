"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DUR, GSAP_EASE, ST_START, STAGGER } from "@/src/lib/motion";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scoped, declarative scroll reveals shared across the Events page so every
 * section speaks the same motion language as the homepage (signature ease,
 * canonical durations, staggered entrances).
 *
 * Mark any element inside the scoped section with a `data-reveal` attribute:
 *   • `data-reveal="up"`   → fade + rise (the workhorse for text/blocks).
 *   • `data-reveal="mask"` → image mask-wipe + settle (105%→100% scale).
 * Siblings that enter together stagger via `ScrollTrigger.batch`. Everything is
 * transforms + opacity only (60fps), fires once, and is scoped to `scopeRef` so
 * sections never grab each other's elements. Under `prefers-reduced-motion` the
 * content is simply left visible.
 */
export function useGsapReveal(scopeRef: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(scope);
        const up = q('[data-reveal="up"]');
        const masks = q('[data-reveal="mask"]');

        if (up.length) {
          gsap.set(up, { autoAlpha: 0, y: 48 });
          ScrollTrigger.batch(up, {
            start: ST_START,
            once: true,
            onEnter: (batch) =>
              gsap.to(batch, {
                autoAlpha: 1,
                y: 0,
                duration: DUR.base,
                ease: GSAP_EASE,
                stagger: STAGGER,
                overwrite: true,
                force3D: true,
              }),
          });
        }

        if (masks.length) {
          gsap.set(masks, {
            autoAlpha: 0,
            clipPath: "inset(0% 0% 100% 0%)",
            scale: 1.06,
          });
          ScrollTrigger.batch(masks, {
            start: ST_START,
            once: true,
            onEnter: (batch) =>
              gsap.to(batch, {
                autoAlpha: 1,
                clipPath: "inset(0% 0% 0% 0%)",
                scale: 1,
                duration: DUR.slow,
                ease: GSAP_EASE,
                stagger: STAGGER,
                overwrite: true,
              }),
          });
        }
      });
    }, scope);

    return () => ctx.revert();
  }, [scopeRef]);
}

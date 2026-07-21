"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Subtle scrubbed parallax for media inside a scoped section — the same gentle
 * "image drifts slower than the page" feel as the homepage's CreativeVision
 * banner. Each matched element must be oversized relative to its clip box (e.g.
 * `-top-[8%] h-[116%]`) so the drift never reveals an edge.
 *
 * Transforms only, scrubbed, scoped to `scopeRef`, and skipped entirely under
 * `prefers-reduced-motion`.
 *
 * @param selector Elements to parallax (default `.parallax`).
 * @param amount   Peak drift as a % of the element's height (default 6).
 */
export function useGsapParallax(
  scopeRef: RefObject<HTMLElement | null>,
  selector = ".parallax",
  amount = 6,
): void {
  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(scope);
        q(selector).forEach((el) => {
          gsap.fromTo(
            el,
            { yPercent: -amount },
            {
              yPercent: amount,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        });
      });
    }, scope);

    return () => ctx.revert();
  }, [scopeRef, selector, amount]);
}

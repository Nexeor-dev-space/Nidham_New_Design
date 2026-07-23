"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setLenis } from "@/src/lib/smoothScroll";

gsap.registerPlugin(ScrollTrigger);

/**
 * Site-wide smooth scrolling — the momentum layer that makes the existing
 * choreography read as premium rather than mechanical. Renders nothing; it only
 * runs Lenis for the document and wires it to GSAP.
 *
 * The integration is the part that matters, because this site pins sections
 * (see useHeroScroll / useAboutScroll) and pinning is what a naive Lenis setup
 * breaks:
 *
 *  • Lenis still moves the *native* window scroll, just eased — it does not
 *    transform a container — so ScrollTrigger reads real scroll positions and
 *    needs no scrollerProxy. It only has to be told to recompute on Lenis's
 *    eased frames instead of the browser's raw scroll event, hence
 *    `lenis.on("scroll", ScrollTrigger.update)`.
 *  • Both must advance on ONE clock. We drive `lenis.raf` from gsap's ticker
 *    (not a second rAF loop) so Lenis and every ScrollTrigger tween step in the
 *    same frame — two loops would beat against each other and jitter pinned
 *    elements. `lagSmoothing(0)` stops gsap from time-warping after a stall,
 *    which with smoothed scroll reads as a lurch.
 *
 * Accessibility & input:
 *  • prefers-reduced-motion → Lenis never starts. Native scrolling stays, and
 *    `getLenis()` returns null so anchor helpers use native jumps. The listener
 *    is live, so toggling the OS setting takes effect without a reload.
 *  • Touch is left native (`smoothWheel` only). Smoothing touch fights the
 *    platform's own momentum and hurts more than it helps on phones; the wheel
 *    and trackpad are where this belongs.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | null = null;

    const start = () => {
      if (lenis) return;

      lenis = new Lenis({
        // Eased momentum — long enough to feel expensive, short enough to never
        // feel laggy or out of the user's control.
        duration: 1.1,
        easing: (t) => 1 - Math.pow(1 - t, 3), // easeOutCubic
        smoothWheel: true,
        // Leave touch to the platform (see note above).
        touchMultiplier: 1,
        wheelMultiplier: 1,
      });

      lenis.on("scroll", ScrollTrigger.update);

      const onTick = (time: number) => {
        // gsap ticker time is seconds; Lenis wants milliseconds.
        lenis?.raf(time * 1000);
      };
      gsap.ticker.add(onTick);
      gsap.ticker.lagSmoothing(0);

      setLenis(lenis);

      // Stash the ticker callback so stop() can detach exactly this one.
      cleanupRaf = () => gsap.ticker.remove(onTick);
    };

    let cleanupRaf: (() => void) | null = null;

    const stop = () => {
      cleanupRaf?.();
      cleanupRaf = null;
      lenis?.destroy();
      lenis = null;
      setLenis(null);
      // Hand pinning back to raw scroll events while smooth scroll is off.
      gsap.ticker.lagSmoothing(500, 33);
    };

    const apply = () => {
      if (mq.matches) stop();
      else start();
    };

    apply();
    mq.addEventListener("change", apply);

    return () => {
      mq.removeEventListener("change", apply);
      stop();
    };
  }, []);

  return null;
}

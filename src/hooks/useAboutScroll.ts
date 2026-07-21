"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface AboutScrollRefs {
  /** The <section> — the pin trigger. */
  section: RefObject<HTMLElement | null>;
  /** Rounded image frame — scales up then back, corners open then close. */
  frame: RefObject<HTMLElement | null>;
  /** Inner image wrapper — over-scaled so it can parallax without gaps. */
  image: RefObject<HTMLElement | null>;
  /** Text column — drifts up a touch as the story unfolds. */
  text: RefObject<HTMLElement | null>;
}

/**
 * Cinematic, scroll-driven "story" for the About section. On desktop the
 * section is briefly pinned while a scrubbed GSAP timeline drives it:
 *
 *   • Expansion  — the image frame scales up (~8%) and its corners open, then
 *     eases back to its resting size/radius before the pin releases, so the
 *     hand-off into the next section is seamless (no snap).
 *   • Parallax   — the photo (pre-scaled for headroom) drifts slower than the
 *     frame, giving depth without ever exposing an edge.
 *   • Text       — the copy column lifts gently as you scroll, so the reading
 *     flow feels choreographed rather than static.
 *
 * The Framer entrance (mask reveal / fade / rise) is left to the component and
 * runs on *different* nodes, so the two systems never share a transform. Motion
 * is transform/opacity + a paint-only border-radius — no layout thrash. The
 * whole effect is desktop-only and skipped under reduced motion; on smaller
 * screens the section simply keeps its clean entrance.
 */
export function useAboutScroll({ section, frame, image, text }: AboutScrollRefs) {
  useEffect(() => {
    const sec = section.current;
    const fr = frame.current;
    const im = image.current;
    if (!sec || !fr || !im) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          const tl = gsap.timeline({
            defaults: { ease: "none", force3D: true },
            scrollTrigger: {
              trigger: sec,
              start: "top top",
              end: "+=70%",
              pin: true,
              pinSpacing: true,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          // Expand, then return to rest before release (seamless exit).
          tl.fromTo(
            fr,
            { scale: 1, borderRadius: 8 },
            { scale: 1.08, borderRadius: 2, duration: 0.66 },
            0,
          ).to(fr, { scale: 1, borderRadius: 8, duration: 0.34 }, 0.66);

          // Parallax — the photo is pre-scaled (headroom) and drifts slower.
          tl.fromTo(
            im,
            { yPercent: 6, scale: 1.12 },
            { yPercent: -6, scale: 1.12, duration: 1 },
            0,
          );

          // Copy lifts gently as the story unfolds.
          if (text.current) {
            tl.fromTo(
              text.current,
              { yPercent: 0 },
              { yPercent: -9, duration: 1 },
              0,
            );
          }
        },
      );
    }, sec);

    return () => ctx.revert();
  }, [section, frame, image, text]);
}

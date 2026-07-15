"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface HeroScrollRefs {
  /** The hero section — drives the scroll timeline. */
  section: RefObject<HTMLElement | null>;
  /** Background media (Layer 1) — slowest: scales down + lags downward. */
  video: RefObject<HTMLElement | null>;
  /** Text/CTA wrapper (Layer 3) — holds, then eases up with a slight fade. */
  content: RefObject<HTMLElement | null>;
  /** Decorative glows (Layer 2) — travels a touch faster than the media. */
  decor: RefObject<HTMLElement | null>;
}

/**
 * Cinematic, scroll-driven parallax for the hero — GSAP ScrollTrigger scrubbed
 * to the section leaving the viewport. Three layers move at different rates to
 * build depth (media slowest, decor faster, text natural), the media gently
 * settles from 1.08 → 1.00 as if you're moving into the scene, and the copy
 * stays readable — it lifts away late and fades only slightly, never vanishing.
 *
 * Everything runs on transforms (translate/scale/opacity) with force3D +
 * will-change for GPU compositing, so no layout thrash and a steady 60fps.
 * Distances shrink on tablet/mobile; motion is skipped entirely when the user
 * prefers reduced motion. Mirrors the repo's GSAP conventions (see useMagnetic).
 */
export function useHeroScroll({ section, video, content, decor }: HeroScrollRefs) {
  useEffect(() => {
    const sectionEl = section.current;
    const videoEl = video.current;
    const contentEl = content.current;
    if (!sectionEl || !videoEl || !contentEl) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 1024px)",
          isTablet: "(min-width: 768px) and (max-width: 1023px)",
          isMobile: "(max-width: 767px)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (mmCtx) => {
          const { isTablet, isMobile, reduce } = mmCtx.conditions as {
            isDesktop: boolean;
            isTablet: boolean;
            isMobile: boolean;
            reduce: boolean;
          };

          // Honour the user's OS-level preference — no scroll motion at all.
          if (reduce) return;

          // Scale animation distance down on smaller screens so the effect
          // stays subtle (and cheap) on tablets and phones.
          const factor = isMobile ? 0.4 : isTablet ? 0.6 : 1;

          // Media (Layer 1): the slowest layer. A small downward drift makes it
          // appear to rise slower than the page (classic parallax lag), while a
          // gentle scale-down reads as moving deeper into the scene.
          const videoStartScale = isMobile ? 1.04 : 1.08;
          const videoDrift = 8 * factor; // % of media height, downward

          // Decor (Layer 2): travels up a touch faster than the media.
          const decorLift = -12 * factor;

          // Content (Layer 3): holds early, then lifts away and fades only
          // slightly so the copy never leaves too soon / never disappears.
          const contentLift = -18 * factor;
          const contentFade = isMobile ? 0.8 : 0.55;

          const tl = gsap.timeline({
            defaults: { force3D: true },
            scrollTrigger: {
              trigger: sectionEl,
              start: "top top",
              // Runs until the hero has fully scrolled past the top — the exit
              // completes exactly as the next section takes over.
              end: "bottom top",
              // Numeric scrub adds a subtle catch-up lag: the buttery,
              // spring-like smoothing that sells the premium feel (vs. a rigid
              // 1:1 map). No sudden jumps, continuous motion.
              scrub: 1,
            },
          });

          tl.fromTo(
            videoEl,
            { yPercent: 0, scale: videoStartScale },
            { yPercent: videoDrift, scale: 1, ease: "none", duration: 1 },
            0,
          );

          if (decor.current) {
            tl.fromTo(
              decor.current,
              { yPercent: 0 },
              { yPercent: decorLift, ease: "none", duration: 1 },
              0,
            );
          }

          // Starts at 0.1 with an ease-in so ~the first quarter of the scroll
          // barely moves the copy — it "stays fixed initially" then leaves.
          tl.fromTo(
            contentEl,
            { yPercent: 0, opacity: 1 },
            { yPercent: contentLift, opacity: contentFade, ease: "power1.in", duration: 0.9 },
            0.1,
          );
        },
      );
    }, sectionEl);

    return () => ctx.revert();
  }, [section, video, content, decor]);
}

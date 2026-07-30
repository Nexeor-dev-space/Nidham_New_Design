"use client";

import { type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";
import { HERO_PIN_FACTOR, HERO_REVEAL } from "@/src/components/Hero/constants";

gsap.registerPlugin(ScrollTrigger);

export interface HeroRevealRefs {
  /** The hero <header> — the pin trigger; its own box is the pinned element. */
  section: RefObject<HTMLElement | null>;
  /** The tagline — rises, unblurs and fades in first. */
  tagline: RefObject<HTMLElement | null>;
  /** The CTA's outer box — carries the scrubbed entrance (opacity/y/blur). */
  cta: RefObject<HTMLElement | null>;
  /** A wrapper *inside* the CTA box — carries only the idle float. */
  ctaFloat: RefObject<HTMLElement | null>;
  reduce: boolean;
}

/**
 * The hero's opening beat: video alone, then — as the visitor scrolls — the
 * section pins and the tagline and CTA rise up out of a blur, from low in the
 * frame, as though surfacing from the footage. Scrolling back up runs the same
 * motion backwards, frame for frame, sinking them back down until the frame is
 * clean video again.
 *
 * **The timeline is scrubbed, and that is the whole design.** Scroll position
 * *is* the playhead, so reverse is not a separate animation that has to be
 * written and kept in sync — it is literally the same tween read right to left.
 * That is what makes entering and leaving perfectly mirrored, and what removes
 * the two failure modes of a play/reverse pair: a state that can pop if the
 * visitor changes direction mid-tween, and easing that silently differs between
 * the two directions.
 *
 * **`power2.out` under a raw `scrub: true`, and the exponent matters.** An
 * ease-out is by definition flat where it lands, and on a mirrored timeline that
 * flat tail becomes the *first* thing the reader feels on the way back up. The
 * velocities at 97% of the tween make the trade concrete:
 *
 *     power1.out  1.0        power3.out  0.0027
 *     power2.out  0.06       power4.out  0.0001
 *
 * At `power4.out` the copy is effectively motionless for the opening moments of
 * every reverse — it reads as "stuck", which is precisely what it was reported
 * as. `power2.out` keeps an obvious eased shape while retaining ~600× the
 * velocity at the settled end, so the exit visibly begins on the first upward
 * pixel. (Linear would be perfectly uniform in both directions, but was tried
 * and read as mechanical — the type tracked the scrollbar rather than moving
 * with weight of its own.)
 *
 * Reversing otherwise costs nothing: the ease is a function of progress and the
 * scrub only ever moves the playhead, so scrolling up traverses the identical
 * curve backwards. Lenis already smooths the scroll input upstream, so `true`
 * (1:1 with the playhead) is not as rigid here as it would be on a native
 * scroller; `scrub: 1` would add a further ~1s of catch-up glide on top.
 *
 * The shape of the timeline (see HERO_REVEAL for the numbers): an opening hold
 * of clean video, the tagline, a beat, then the CTA — and deliberately nothing
 * after it. Anything held at the *end* of a scrubbed timeline is dead scroll on
 * the way back up: a threshold the reader crosses before the exit responds. The
 * opening hold is the opposite, and load-bearing — it is the stretch over which
 * the copy is already gone but the hero has not yet unpinned, which is what
 * lets the exit finish rather than being cut off by the section scrolling away.
 *
 * The video is never touched here: it plays continuously through every stage.
 *
 * Runs as a LAYOUT effect for the same load-bearing reason as useAboutScroll:
 * the pin re-parents this section into a GSAP `pin-spacer`, so `ctx.revert()`
 * must restore it before React detaches the subtree or the unmount throws
 * NotFoundError. See useIsomorphicLayoutEffect.
 */
export function useHeroReveal({
  section,
  tagline,
  cta,
  ctaFloat,
  reduce,
}: HeroRevealRefs) {
  useIsomorphicLayoutEffect(() => {
    const sectionEl = section.current;
    const taglineEl = tagline.current;
    const ctaEl = cta.current;
    if (!sectionEl || !taglineEl || !ctaEl) return;

    const ctx = gsap.context(() => {
      // Reduced motion: no pin, no scroll gate — the copy simply renders in its
      // settled state and the page scrolls natively from the first pixel.
      if (reduce) {
        gsap.set([taglineEl, ctaEl], { opacity: 1, y: 0, filter: "blur(0px)" });
        return;
      }

      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 1440px)",
          isLaptop: "(min-width: 1024px) and (max-width: 1439.98px)",
          isTablet: "(min-width: 768px) and (max-width: 1023.98px)",
          isMobile: "(max-width: 767.98px)",
        },
        (mmCtx) => {
          const { isDesktop, isLaptop, isTablet } = mmCtx.conditions as {
            isDesktop: boolean;
            isLaptop: boolean;
            isTablet: boolean;
            isMobile: boolean;
          };

          const factor = isDesktop
            ? HERO_PIN_FACTOR.desktop
            : isLaptop
              ? HERO_PIN_FACTOR.laptop
              : isTablet
                ? HERO_PIN_FACTOR.tablet
                : HERO_PIN_FACTOR.mobile;

          // ---- Idle float -----------------------------------------------------
          // Lives on a nested element so it can never share `y` with the
          // scrubbed entrance below: one node cannot carry a scrub-driven
          // transform and an infinite tween on the same property without the
          // two overwriting each other every frame.
          //
          // It runs only while the reveal is complete, so it can't drift the CTA
          // mid-entrance. `SETTLED_AT` is the progress at which the CTA tween
          // ends, derived from the same constants that build the timeline — so
          // re-timing any beat in HERO_REVEAL moves this with it.
          // The reveal ends exactly at progress 1 (nothing is scheduled after
          // it), so this is 1 minus an epsilon rather than 1 — a `>= 1` test
          // would be at the mercy of floating point. The epsilon costs a pixel
          // or two of scroll and makes the float reliably start.
          const SETTLED_AT = 0.999;

          const floatEl = ctaFloat.current;
          let float: gsap.core.Tween | null = null;

          const setFloating = (on: boolean) => {
            if (!floatEl) return;
            if (on) {
              float ??= gsap.to(floatEl, {
                y: -3,
                duration: 2.4,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1,
              });
            } else if (float) {
              float.kill();
              float = null;
              gsap.set(floatEl, { y: 0 });
            }
          };

          const tl = gsap.timeline({
            defaults: { ease: "power2.out", force3D: true },
            scrollTrigger: {
              trigger: sectionEl,
              start: "top top",
              end: () => `+=${Math.round(window.innerHeight * factor)}`,
              pin: true,
              pinSpacing: true,
              anticipatePin: 1,
              scrub: true,
              invalidateOnRefresh: true,
              onUpdate: (self) => setFloating(self.progress >= SETTLED_AT),
            },
          });

          // `fromTo` rather than `from`: it pins the start values explicitly, so
          // `invalidateOnRefresh` cannot re-read them from whatever the element
          // happens to look like mid-scroll and rebase the tween.
          const from = {
            opacity: 0,
            y: HERO_REVEAL.rise,
            scale: HERO_REVEAL.scaleFrom,
            filter: `blur(${HERO_REVEAL.blur}px)`,
          };
          const to = { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" };

          // Absolute positions, not `+=` offsets — the two tweens overlap and
          // land together (see HERO_REVEAL), which sequential positioning
          // cannot express. The empty stretch before `leadIn` is the opening
          // hold; a timeline simply has nothing scheduled there.
          tl.fromTo(
            taglineEl,
            from,
            { ...to, duration: HERO_REVEAL.taglineDuration },
            HERO_REVEAL.leadIn,
          );

          tl.fromTo(
            ctaEl,
            from,
            { ...to, duration: HERO_REVEAL.ctaDuration },
            HERO_REVEAL.ctaStart,
          );

          return () => setFloating(false);
        },
      );
    }, sectionEl);

    return () => ctx.revert();
  }, [section, tagline, cta, ctaFloat, reduce]);
}

"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface HeroScrollRefs {
  /** The hero section — pinned, and the trigger for the whole timeline. */
  section: RefObject<HTMLElement | null>;
  /** The rounded video card — grows from inset card to full-bleed cover. */
  stage: RefObject<HTMLElement | null>;
  /** The <video> itself — brightens as the card takes the screen. */
  video: RefObject<HTMLElement | null>;
  /** Headline wrapper — leads the exit: lifts + fades. */
  headline: RefObject<HTMLElement | null>;
  /** Description wrapper — follows the headline a beat later. */
  description: RefObject<HTMLElement | null>;
  /** Decorative rotating flower — dissolves with the copy. */
  shape: RefObject<HTMLElement | null>;
  /** Ambient glow layer — dissolves with the copy. */
  decor: RefObject<HTMLElement | null>;
  /** Top scrim — fades in to keep the nav readable once the video is behind it. */
  scrim: RefObject<HTMLElement | null>;
}

/**
 * Cinematic, scroll-driven hero transition — the opening beat of the page.
 *
 * The hero is pinned at the top of the viewport and, as the user scrolls, the
 * rounded video card grows out of the layout and takes the whole screen: it
 * scales up, rises to viewport centre, its 24px radius flattens to 0 and the
 * footage brightens. The copy leaves in the same breath — the headline lifts
 * and fades first, the description a beat behind, and the decorative flower and
 * ambient glows dissolve with them. Once the video is full-screen the pin
 * releases and the hero scrolls away normally, handing the viewport to the next
 * section with no jump (pin spacing reserves the scroll distance).
 *
 * Mechanics worth knowing before editing:
 *
 * • The card covers the viewport via a *uniform* scale — `max(w-ratio, h-ratio)`,
 *   i.e. object-fit: cover semantics. The overshooting axis is clipped by the
 *   section's `overflow-hidden`. Never scale the axes independently: the video
 *   would stretch.
 *
 * • The video is COUNTER-SCALED inside that growing frame, and this is the whole
 *   trick — don't remove it. The resting card is a wide, shallow strip (the
 *   headline takes most of the screen), so covering the viewport needs a scale of
 *   ~4×. Letting that scale reach the footage would blow a ~336×210 crop up to
 *   full screen — visibly blurry. Instead the video's box is sized to the
 *   viewport and scaled by `push / s`, cancelling the frame's scale: the footage
 *   stays painted at ~viewport size the whole way, so the card *opens to reveal*
 *   more frame rather than magnifying it, and `push` (1 → 1.06) supplies the
 *   gentle cinematic zoom on top. Resolution stays native throughout.
 *
 * • That cancellation only covers the card because, from md up, a landscape strip
 *   inside a landscape viewport always makes the cover scale height-driven
 *   (`hostH/H` ≫ `hostW/W`, since the card is already ~92% of viewport width).
 *   So the viewport-sized, centre-aligned video box always contains the card's
 *   on-screen region. Mobile opts out of this path entirely.
 *
 * • Radius is divided by `s` for the same reason: a raw 24 → 0 tween would render
 *   as 24·s and balloon to ~100px mid-flight. Dividing keeps the *rendered*
 *   corner at a true 24px until it flattens.
 *
 * • Frame, video, and radius are driven from one proxy tween rather than three
 *   parallel tweens: they must stay exactly in step, and `push / s` and
 *   `radius / s` are not expressible as independent eased tweens.
 *
 * • `measure()` reads geometry from `offsetWidth/offsetTop`, never from
 *   `getBoundingClientRect()`. Rects are polluted by transforms — both the
 *   Framer entrance on the card's wrapper and this timeline's own scaling —
 *   whereas offsets are pure layout. This is what keeps the numbers correct no
 *   matter when a refresh lands.
 *
 * • While pinned, the section's box *is* the viewport box, so the cover maths is
 *   expressed relative to the section — no scroll or scrollbar arithmetic.
 *
 * • Everything animated here is transform, opacity or filter — compositor work,
 *   no layout. `scrub` adds catch-up smoothing, so motion stays tied to the
 *   scrollbar (no hijacking, no fake smooth scrolling) while still feeling
 *   spring-loaded rather than rigidly 1:1.
 *
 * Responsive: desktop runs the full distances, tablet ~65% of them, and mobile
 * opts out of the pin entirely for plain native scrolling — as does anyone with
 * prefers-reduced-motion.
 */
export function useHeroScroll({
  section,
  stage,
  video,
  headline,
  description,
  shape,
  decor,
  scrim,
}: HeroScrollRefs) {
  useEffect(() => {
    const sectionEl = section.current;
    const stageEl = stage.current;
    if (!sectionEl || !stageEl) return;

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

          // Phones scroll normally — no pin, no scrub. Same for anyone who has
          // asked the OS for reduced motion. The card simply stays as designed.
          if (isMobile || reduce) return;

          // Tablets run the same choreography over shorter distances.
          const factor = isTablet ? 0.65 : 1;

          // Where the card has to travel/scale to cover the viewport. Filled by
          // measure() and read live inside the timeline's onUpdate, so resize and
          // font-load can't desync it.
          const cover = { x: 0, y: 0, scale: 1 };
          const videoEl = video.current;

          // One eased proxy drives frame, video and radius together — see the
          // header note on why these can't be three independent tweens.
          const flatten = gsap.parseEase("power2.in");
          const state = { p: 0 };

          const render = () => {
            const p = state.p;
            const s = 1 + (cover.scale - 1) * p;

            gsap.set(stageEl, {
              x: cover.x * p,
              y: cover.y * p,
              scale: s,
              // Divided by `s` so the *rendered* corner rides a true 24px → 0.
              borderRadius: (24 * (1 - flatten(p))) / s,
              force3D: true,
            });

            if (videoEl) {
              // `push / s` — cancels the frame's scale, leaving the footage at
              // native size with a gentle 6% push-in of its own.
              gsap.set(videoEl, { scale: (1 + 0.06 * p) / s, force3D: true });
            }
          };

          const measure = () => {
            const cardW = stageEl.offsetWidth;
            const cardH = stageEl.offsetHeight;
            const hostW = sectionEl.offsetWidth;
            const hostH = sectionEl.offsetHeight;
            if (!cardW || !cardH || !hostW || !hostH) return;

            // Card offset within the section, walked up the offsetParent chain.
            // Layout-only, so any transform in flight is invisible to it.
            let top = 0;
            let left = 0;
            let node: HTMLElement | null = stageEl;
            while (node && node !== sectionEl) {
              top += node.offsetTop;
              left += node.offsetLeft;
              node = node.offsetParent as HTMLElement | null;
            }

            // Uniform cover scale + the translation that centres the card on the
            // (pinned) section, i.e. on the viewport. OVERSCAN buys ~2px of bleed
            // on every edge: offset* measurements are integer-rounded, so an
            // exact fit can land a sub-pixel short and leave a hairline seam of
            // page background at the viewport edge. The section clips the bleed.
            const OVERSCAN = 4;
            cover.scale = Math.max(
              (hostW + OVERSCAN) / cardW,
              (hostH + OVERSCAN) / cardH,
            );
            cover.x = hostW / 2 - (left + cardW / 2);
            cover.y = hostH / 2 - (top + cardH / 2);

            // Give the video a viewport-sized box centred on the card, so the
            // counter-scale in render() lands it at native size on screen. The
            // markup's `inset-0 h-full w-full` default stays untouched on mobile
            // and under reduced motion, where none of this runs; gsap.context
            // restores it if this breakpoint is left.
            if (videoEl) {
              gsap.set(videoEl, {
                top: "50%",
                left: "50%",
                right: "auto",
                bottom: "auto",
                // Tailwind's preflight resets `video { max-width: 100% }`, which
                // silently clamps this box to the card's width — the inline
                // width is set but computes to the parent's. Without this the
                // footage is too narrow to cover the screen at the end.
                maxWidth: "none",
                width: hostW,
                height: hostH,
                xPercent: -50,
                yPercent: -50,
              });
            }

            // Re-paint at the current progress with the new geometry, so a
            // refresh mid-scroll can't leave a frame of stale transform.
            render();
          };

          measure();
          ScrollTrigger.addEventListener("refreshInit", measure);

          const tl = gsap.timeline({
            defaults: { force3D: true, ease: "none" },
            scrollTrigger: {
              trigger: sectionEl,
              // The hero already sits at the top of the page, so the pin engages
              // on the very first pixel of scroll.
              start: "top top",
              end: () =>
                `+=${Math.round(window.innerHeight * (isTablet ? 1 : 1.35))}`,
              pin: true,
              // Reserves the pinned distance in the document, which is what lets
              // the next section arrive without a jump.
              pinSpacing: true,
              anticipatePin: 1,
              // Numeric scrub — a subtle catch-up lag. Buttery rather than rigid.
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          });

          // ---- The card takes the screen -------------------------------------
          // Ends at 0.92 so it settles into full-screen just before the pin
          // releases — the scrub's catch-up lag then has room to land cleanly
          // instead of still travelling as the hero starts scrolling away.
          // fromTo, not to: `invalidateOnRefresh` re-reads a `to` tween's start
          // from the object's *current* value, which mid-scroll would rebase the
          // proxy at whatever p it had reached. The explicit from pins it at 0.
          tl.fromTo(
            state,
            { p: 0 },
            { p: 1, ease: "power2.inOut", duration: 0.92, onUpdate: render },
            0,
          );

          if (videoEl) {
            tl.fromTo(
              videoEl,
              { filter: "brightness(1)" },
              { filter: "brightness(1.12)", duration: 0.92 },
              0,
            );
          }

          // ---- The copy leaves ------------------------------------------------
          // Headline leads; description follows a beat later (offset 0.12); the
          // flower and glows dissolve alongside. All within the first half of the
          // scrub, so the screen is clear well before the video fills it.
          if (headline.current) {
            tl.fromTo(
              headline.current,
              { y: 0, opacity: 1 },
              {
                y: -80 * factor,
                opacity: 0,
                ease: "power2.in",
                duration: 0.5,
              },
              0,
            );
          }

          if (description.current) {
            tl.fromTo(
              description.current,
              { y: 0, opacity: 1 },
              {
                y: -64 * factor,
                opacity: 0,
                ease: "power2.in",
                duration: 0.5,
              },
              0.12,
            );
          }

          if (shape.current) {
            tl.fromTo(
              shape.current,
              { opacity: 1 },
              { opacity: 0, ease: "power1.in", duration: 0.4 },
              0,
            );
          }

          if (decor.current) {
            tl.fromTo(
              decor.current,
              { opacity: 1 },
              { opacity: 0, ease: "power1.in", duration: 0.55 },
              0,
            );
          }

          // Starts at 0.3 — by then the video is climbing behind the nav, and the
          // scrim is fully in before it gets there.
          if (scrim.current) {
            tl.fromTo(
              scrim.current,
              { opacity: 0 },
              { opacity: 1, ease: "power1.inOut", duration: 0.6 },
              0.3,
            );
          }

          return () => {
            ScrollTrigger.removeEventListener("refreshInit", measure);
          };
        },
      );
    }, sectionEl);

    // The announcement ribbon is dismissible and fonts load late — both resize
    // the card without a window resize event, which would leave the cover maths
    // stale. Debounced so the ribbon's 0.55s collapse costs one refresh, not one
    // per frame. Transforms never affect offsetWidth/Height, so the timeline's
    // own scaling cannot feed back into this.
    let timer: number | undefined;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 200);
    });
    ro.observe(stageEl);

    return () => {
      window.clearTimeout(timer);
      ro.disconnect();
      ctx.revert();
    };
  }, [section, stage, video, headline, description, shape, decor, scrim]);
}

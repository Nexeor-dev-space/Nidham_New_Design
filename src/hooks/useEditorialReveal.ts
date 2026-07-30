"use client";

import { type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

gsap.registerPlugin(ScrollTrigger);

/**
 * Class hooks this reveal understands. Declared here so the contract between
 * markup and choreography lives in one place — a renamed class silently drops
 * part of the animation, since a selector that matches nothing is not an error.
 */
export const REVEAL = {
  /** Fades and rises. The workhorse. */
  up: "r-up",
  /** Photograph: clip-path mask wipe + a settle from 1.06. */
  plate: "r-plate",
  /** Scrubbed parallax; `data-parallax` sets the px travel. */
  drift: "r-drift",
  /** Counts 0 → `data-count` once, on arrival. */
  count: "r-count",
} as const;

/**
 * Editorial scroll choreography for the Melody Dreamz case study.
 *
 * One hook rather than a timeline per section, because every section wants the
 * same grammar — rise, mask, drift, count — and the only thing that differs is
 * which elements are present. Sections opt in by class.
 *
 * Deliberate choices:
 *
 * • **Per-element triggers, not per-section.** Each `.r-up` and `.r-plate` gets
 *   its own trigger at `top 88%`, so nothing animates while it is below the
 *   fold. A section-level trigger on a page this tall reveals its lower half
 *   off-screen and the reader arrives to find it already settled — which is the
 *   exact failure that made the services grid look static.
 *
 * • **`stagger` comes from DOM order within a parent**, via `batch`-free manual
 *   grouping: siblings sharing a parent animate together with a small offset, so
 *   a row of cards cascades but two distant blocks do not wait on each other.
 *
 * • **`scrub` is used only for `.r-drift`.** Entrances are `once: true`. That
 *   split is what keeps the page off the main thread during normal scrolling.
 *
 * • Everything is opacity / transform / clip-path — compositor work only.
 *
 * Reduced motion skips the whole hook, leaving the markup in its natural
 * fully-visible state.
 */
export function useEditorialReveal(
  scope: RefObject<HTMLElement | null>,
  reduce: boolean,
) {
  useIsomorphicLayoutEffect(() => {
    const root = scope.current;
    if (!root || reduce) return;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);

      /** Group siblings so a row cascades but unrelated blocks stay independent. */
      const byParent = (els: HTMLElement[]) => {
        const groups = new Map<Element, HTMLElement[]>();
        els.forEach((el) => {
          const key = el.parentElement ?? root;
          const list = groups.get(key);
          if (list) list.push(el);
          else groups.set(key, [el]);
        });
        return [...groups.values()];
      };

      // ---- Rise + fade ----------------------------------------------------
      byParent(q<HTMLElement>(`.${REVEAL.up}`)).forEach((group) => {
        gsap.fromTo(
          group,
          { opacity: 0, y: 42, filter: "blur(10px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1,
            ease: "power3.out",
            stagger: 0.09,
            force3D: true,
            scrollTrigger: { trigger: group[0], start: "top 88%", once: true },
          },
        );
      });

      // ---- Photographs: mask wipe + settle --------------------------------
      // The clip travels and the picture inside it barely moves, which reads as
      // the frame opening rather than the image sliding.
      byParent(q<HTMLElement>(`.${REVEAL.plate}`)).forEach((group) => {
        gsap.fromTo(
          group,
          { clipPath: "inset(0% 0% 100% 0%)", scale: 1.06, opacity: 0 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            scale: 1,
            opacity: 1,
            duration: 1.35,
            ease: "power3.out",
            stagger: 0.12,
            force3D: true,
            scrollTrigger: { trigger: group[0], start: "top 88%", once: true },
          },
        );
      });

      // ---- Scrubbed parallax ----------------------------------------------
      q<HTMLElement>(`.${REVEAL.drift}`).forEach((el) => {
        const distance = Number(el.dataset.parallax ?? 0);
        if (!distance) return;
        gsap.fromTo(
          el,
          { y: distance / 2 },
          {
            y: -distance / 2,
            ease: "none",
            force3D: true,
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
      });

      // ---- Counters -------------------------------------------------------
      // The markup renders the final value, so SSR, no-JS and reduced motion are
      // all correct without this. Zeroed here on mount rather than inside the
      // trigger, so a slow reader never watches a real number blink back to 0.
      q<HTMLElement>(`.${REVEAL.count}`).forEach((el) => {
        const target = Number(el.dataset.count ?? 0);
        if (!Number.isFinite(target) || target <= 0) return;
        const proxy = { v: 0 };
        el.textContent = "0";
        gsap.to(proxy, {
          v: target,
          duration: 1.4,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = String(Math.round(proxy.v));
          },
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });
    }, root);

    return () => ctx.revert();
  }, [scope, reduce]);
}

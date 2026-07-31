"use client";

import { type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";
import { SHOWCASE_REVEAL } from "@/src/components/ServicesShowcase/constants";

gsap.registerPlugin(ScrollTrigger);

/**
 * Class hooks the markup must provide. Kept here so the contract between
 * ServiceTile's DOM and this choreography is stated in one place — renaming one
 * of these silently drops part of the animation, since a missing selector is not
 * an error to GSAP.
 */
export const SVC = {
  row: "svc-row",
  tile: "svc-tile",
  /** Oversized wrapper around the image — owns the settle bounce. */
  media: "svc-media",
  /** The <img> itself — owns the cinematic scale/opacity reveal. */
  image: "svc-image",
  /** Reveal-only dimmer, faded out once. Separate from the hover overlay. */
  dim: "svc-dim",
  title: "svc-title",
} as const;

/**
 * The services gallery's entrance and parallax — GSAP ScrollTrigger throughout.
 *
 * **Why this replaced the Framer version.** The panels previously revealed with
 * one `whileInView` per row, which gave a flat fade with no internal
 * choreography: the image, its scrim and its title all arrived on the same
 * frame, so the section read as five boxes switching on. Building it as a
 * timeline lets each panel introduce itself — the frame rises, the photograph
 * settles out of a scale-and-blur, the dimmer lifts, and only then does the
 * title sharpen into place.
 *
 * Structure:
 *
 * • **Entrance** — one timeline per row, `once: true`, no scrub. Panels cascade
 *   in DOM order (1 2 3 / 4 5) at `SHOWCASE_REVEAL.stagger`, and inside each
 *   panel the title is held back `titleDelay` behind its own image so the two
 *   read as sequential rather than simultaneous. Per row, not per section — see
 *   the note at the trigger for the measurement that forced that.
 *
 * • **Parallax** — the only scrubbed part, and it drives the *rows*, not the
 *   images. Moving each row by a different amount (top less than bottom) is what
 *   produces depth; drifting the images inside static frames only produces
 *   sliding photographs. Rows are transform-only, so this never touches layout —
 *   which matters because the panels' hover interaction animates `flex-grow`,
 *   and a scrubbed layout property alongside it would thrash every frame.
 *
 * • **Mobile** gets per-panel triggers instead of one cascade. Stacked, the five
 *   panels span far more than a viewport, so a single section-level trigger
 *   would fire the whole sequence while four of them were still below the fold
 *   and the reader would scroll down to find them already settled.
 *
 * Everything animated here is transform, opacity or filter. `filter` is the
 * expensive one, so it is deliberately confined to the panel and its title — the
 * image reveals on scale and opacity alone, and inherits the panel's blur while
 * that is still resolving, which looks identical for a fraction of the cost.
 */
export function useServicesReveal(
  section: RefObject<HTMLElement | null>,
  reduce: boolean,
) {
  useIsomorphicLayoutEffect(() => {
    const sectionEl = section.current;
    if (!sectionEl) return;

    // Reduced motion: leave the markup exactly as rendered — fully visible,
    // no pre-hiding, no scrub. The section is legible without any of this.
    if (reduce) return;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(sectionEl);
      const tiles = q<HTMLElement>(`.${SVC.tile}`);
      const rows = q<HTMLElement>(`.${SVC.row}`);
      if (!tiles.length) return;

      const {
        rise,
        blur,
        imageScale,
        dimFrom,
        duration,
        imageDuration,
        titleDuration,
        titleDelay,
        stagger,
        titleRise,
        titleBlur,
      } = SHOWCASE_REVEAL;

      /** One panel's internal choreography, added to `tl` at `at` seconds. */
      const addPanel = (tl: gsap.core.Timeline, tile: HTMLElement, at: number) => {
        const image = tile.querySelector<HTMLElement>(`.${SVC.image}`);
        const dim = tile.querySelector<HTMLElement>(`.${SVC.dim}`);
        const title = tile.querySelector<HTMLElement>(`.${SVC.title}`);

        tl.fromTo(
          tile,
          { opacity: 0, y: rise, filter: `blur(${blur}px)` },
          { opacity: 1, y: 0, filter: "blur(0px)", duration },
          at,
        );

        if (image) {
          tl.fromTo(
            image,
            { scale: imageScale, opacity: 0 },
            { scale: 1, opacity: 1, duration: imageDuration },
            at,
          );
        }

        // The reveal dimmer lifts as the photograph lands, so the image appears
        // to gain richness rather than simply fade up.
        if (dim) {
          tl.fromTo(
            dim,
            { opacity: dimFrom },
            { opacity: 0, duration: imageDuration },
            at,
          );
        }

        if (title) {
          tl.fromTo(
            title,
            { opacity: 0, y: titleRise, filter: `blur(${titleBlur}px)` },
            { opacity: 1, y: 0, filter: "blur(0px)", duration: titleDuration },
            at + titleDelay,
          );
        }
      };

      const mm = gsap.matchMedia();

      // ---- Desktop / tablet: one cascade PER ROW --------------------------
      //
      // Not one trigger on the section, which is the mistake this replaces. The
      // section is ~1660px tall; anchoring the cascade to its top meant that at
      // the moment it fired (measured, 1440×900) the top row began at y=742 —
      // just scraping the bottom edge — and the bottom row sat 862px BELOW the
      // fold. Cards 4 and 5 played their entire reveal off-screen and were
      // already settled by the time they scrolled into view, so the section
      // read as static however carefully the timeline was authored.
      //
      // Per-row triggers keep the specified reading order (row one cascades
      // 1→2→3, row two cascades 4→5) while guaranteeing each row is actually
      // on screen when its own cascade starts. `start: "top 85%"` puts the
      // row's leading edge just inside the viewport as it begins.
      mm.add("(min-width: 768px)", () => {
        rows.forEach((row) => {
          const rowTiles = tiles.filter((t) => row.contains(t));
          if (!rowTiles.length) return;

          const tl = gsap.timeline({
            defaults: { ease: "power3.out", force3D: true },
            scrollTrigger: { trigger: row, start: "top 85%", once: true },
          });

          // Stagger restarts per row: continuing the global index would delay
          // card 4 by three steps for no reason the reader can perceive, since
          // row one's cascade finished before this trigger existed.
          rowTiles.forEach((tile, i) => addPanel(tl, tile, i * stagger));
        });
      });

      // ---- Mobile: each panel reveals on its own as it arrives -------------
      // Stacked, the five panels span several viewports, so even a per-row
      // trigger would reveal the second card of a row off-screen.
      mm.add("(max-width: 767.98px)", () => {
        tiles.forEach((tile) => {
          const tl = gsap.timeline({
            defaults: { ease: "power3.out", force3D: true },
            scrollTrigger: { trigger: tile, start: "top 85%", once: true },
          });
          addPanel(tl, tile, 0);
        });
      });

      // ---- Row parallax — the only scrubbed animation ----------------------
      rows.forEach((row) => {
        const distance = Number(row.dataset.parallax ?? 0);
        if (!distance) return;

        // Centred on the section's midpoint (+d/2 → −d/2) so the net travel is
        // `distance` and neither end of the scroll sits at an extreme offset.
        gsap.fromTo(
          row,
          { y: distance / 2 },
          {
            y: -distance / 2,
            ease: "none",
            force3D: true,
            scrollTrigger: {
              trigger: sectionEl,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
      });
      // Refresh after all triggers are created, so positions account for
      // the Hero's pin-spacer and Lenis's scroll setup.
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, sectionEl);

    return () => ctx.revert();
  }, [section, reduce]);
}

"use client";

import { useCallback, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import ServiceTile from "./ServiceTile";
import { useIsDesktop } from "@/src/components/WhyChooseUs/useIsDesktop";
import { SVC, useServicesReveal } from "@/src/hooks/useServicesReveal";
import {
  BOTTOM_ROW_GROW,
  SHOWCASE_BOTTOM,
  SHOWCASE_EXPAND_MIN_WIDTH,
  SHOWCASE_PARALLAX,
  SHOWCASE_TOP,
  TOP_ROW_GROW,
} from "./constants";

/** Row class shared by both rows — grid below `lg`, flex above. */
const ROW =
  "grid grid-cols-1 gap-5 md:grid-cols-2 lg:flex lg:gap-6 will-change-transform";

/**
 * Homepage services gallery — five edge-to-edge photographic panels that
 * respond to the pointer by changing width, not a card grid.
 *
 * Layout is two rows: three equal panels, then a 65/35 pair. Below `lg` it
 * becomes a plain grid — two columns at tablet (with the third top-row panel
 * spanning both, so no column is left half-empty) and a single stack on mobile.
 *
 * **The expansion is CSS, not JS.** React only decides *which* panel is active;
 * the widths are `flex-grow` values against `flex-basis: 0`, transitioned by
 * the browser. That matters for two reasons: moving the pointer across three
 * panels in under a second would otherwise queue three JS tweens that fight
 * over the same property, and `flex-grow` interpolation lets the row stay
 * summed to exactly 100% at every frame — a width/percentage tween rounds, and
 * the rounding shows up as a sub-pixel seam that shivers during the animation.
 * See constants.ts for where the grow numbers come from.
 *
 * **Expansion is desktop-only**, gated on a real media query rather than on
 * hover support, because the interaction is about having the horizontal room
 * for it. Tablet and mobile keep the zoom, wash and glow, which is the part that
 * reads on a touch screen.
 *
 * The entrance and the row parallax are GSAP's (see useServicesReveal); this
 * component owns only the hover state and the settle bounce. The panels carry no
 * cursor treatment: the site's custom cursor is not mounted (see CustomCursor —
 * it has no call site), so these stay on the browser's own pointer.
 */
export default function ServicesShowcase() {
  const reduce = useReducedMotion() ?? false;
  const canExpand = useIsDesktop(SHOWCASE_EXPAND_MIN_WIDTH);
  const sectionRef = useRef<HTMLElement>(null);

  useServicesReveal(sectionRef, reduce);

  // One active id across both rows. Rows compute their own proportions from it,
  // so a panel in the top row can never influence the bottom row's widths.
  const [activeId, setActiveId] = useState<string | null>(null);

  const activate = (id: string) => () => setActiveId(id);
  const deactivate = () => setActiveId(null);

  /**
   * Settle bounce — a 2px overshoot as a panel finishes widening, so the
   * expansion lands with a little weight instead of stopping dead.
   *
   * Fired from the panel's own `transitionend` for `flex-grow` rather than on a
   * timer, so it is always in step with the real width transition however long
   * the browser took. It runs on the media wrapper, not the panel: the panel's
   * `transform` is the entrance's, and the wrapper is oversized so 2px of travel
   * cannot expose an edge. `overwrite` keeps a fast in-out-in hover from
   * stacking bounces.
   */
  const handleExpanded = useCallback(
    (media: HTMLElement | null) => {
      if (!media || reduce || !canExpand) return;
      gsap.fromTo(
        media,
        { y: -2 },
        { y: 0, duration: 0.45, ease: "power2.out", overwrite: "auto" },
      );
    },
    [reduce, canExpand],
  );

  /** Equal thirds until one is active, then 56 / 22 / 22. */
  const topGrow = (id: string) => {
    if (!canExpand) return undefined;
    return activeId === id ? TOP_ROW_GROW.expanded : TOP_ROW_GROW.rest;
  };

  /**
   * 65 / 35, with the active panel taking the 65. Hovering the panel that
   * already holds it is a no-op — see BOTTOM_ROW_GROW.
   */
  const bottomGrow = (id: string, index: number) => {
    if (!canExpand) return undefined;
    const activeIndex = SHOWCASE_BOTTOM.findIndex((t) => t.id === activeId);
    const majorIndex = activeIndex === -1 ? 0 : activeIndex;
    return index === majorIndex ? BOTTOM_ROW_GROW.major : BOTTOM_ROW_GROW.minor;
  };

  return (
    <section
      ref={sectionRef}
      id="services"
      aria-labelledby="services-showcase-heading"
      data-particles="gallery"
      className="w-full bg-[#111111] section-y"
    >
      <div className="container-page">
        {/* No visible section label: the gallery is meant to read as imagery,
            not as a labelled block, so it deliberately breaks the homepage's
            `SectionDivider` rhythm. The heading stays for assistive tech —
            `aria-labelledby` on the section points at it — but is visually
            hidden. */}
        <h2 id="services-showcase-heading" className="sr-only">
          Our Services
        </h2>

        <div className="flex flex-col gap-5 lg:gap-6">
          {/* Top row — three panels. `data-parallax` is the scrub distance in
              px; the hook reads it so the two rows' depths live in one place
              (SHOWCASE_PARALLAX) rather than being split across files. */}
          <ul className={`${SVC.row} ${ROW}`} data-parallax={SHOWCASE_PARALLAX.topRow}>
            {SHOWCASE_TOP.map((tile) => (
              <ServiceTile
                key={tile.id}
                tile={tile}
                grow={topGrow(tile.id)}
                onActivate={activate(tile.id)}
                onDeactivate={deactivate}
                onExpanded={handleExpanded}
              />
            ))}
          </ul>

          {/* Bottom row — the 65/35 pair. Drifts further than the top row. */}
          <ul
            className={`${SVC.row} ${ROW}`}
            data-parallax={SHOWCASE_PARALLAX.bottomRow}
          >
            {SHOWCASE_BOTTOM.map((tile, i) => (
              <ServiceTile
                key={tile.id}
                tile={tile}
                grow={bottomGrow(tile.id, i)}
                onActivate={activate(tile.id)}
                onDeactivate={deactivate}
                onExpanded={handleExpanded}
              />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

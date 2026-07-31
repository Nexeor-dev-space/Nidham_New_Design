"use client";

import Image from "next/image";
import Link from "next/link";
import { SVC } from "@/src/hooks/useServicesReveal";
import { SHOWCASE_HREF } from "./constants";
import type { ShowcaseTile } from "./types";

/**
 * Hover timing, shared by every property that moves on hover so the whole card
 * reacts as one gesture rather than several. `power3.out` as a bezier.
 */
const HOVER = "duration-[600ms] ease-[cubic-bezier(0.165,0.84,0.44,1)]";

/**
 * Panel title — large, elegant, medium weight, low in the frame.
 *
 * `max-w-[14ch]` is load-bearing rather than cosmetic: at desktop a panel
 * narrows to 22% of the row while a sibling is hovered, and the longest title
 * ("Artist & Influencer Management") would otherwise reflow from one line to
 * four *during* the width tween — a visible text reshuffle in the middle of an
 * otherwise smooth motion. Capping the measure means the title already wraps at
 * rest, so the line count barely changes as the panel resizes.
 */
const TILE_TITLE =
  "block max-w-[14ch] font-[family-name:var(--font-cabinet)] text-[clamp(1.35rem,1rem+1.1vw,2rem)] font-medium leading-[1.15] tracking-[-0.015em] text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.55)]";

interface ServiceTileProps {
  tile: ShowcaseTile;
  /**
   * `flex-grow` for the desktop expansion, or `undefined` below `lg` where the
   * rows are grids and grow is meaningless. Transitioned in CSS, not by an
   * animation library: it is a layout property, and the browser's own
   * interpolation is both cheaper and immune to being interrupted mid-tween by
   * a second pointer move.
   */
  grow?: number;
  onActivate: () => void;
  onDeactivate: () => void;
  /** Fires when the width transition finishes — drives the settle bounce. */
  onExpanded: (media: HTMLElement | null) => void;
}

export default function ServiceTile({
  tile,
  grow,
  onActivate,
  onDeactivate,
  onExpanded,
}: ServiceTileProps) {
  return (
    <li
      style={{ flexGrow: grow }}
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
      // Focus drives the same expansion as hover, so the interaction exists for
      // keyboard users too rather than being pointer-only decoration.
      onFocus={onActivate}
      onBlur={onDeactivate}
      // `flex-grow` is the only property whose transition we care about here;
      // every panel also transitions box-shadow, and reacting to that would fire
      // the bounce on plain hover-out too.
      onTransitionEnd={(event) => {
        if (event.propertyName === "flex-grow") {
          onExpanded(event.currentTarget.querySelector(`.${SVC.media}`));
        }
      }}
      className={`${SVC.tile} group relative min-w-0 overflow-hidden rounded-2xl bg-neutral-900 ring-1 ring-white/[0.06] transition-[flex-grow,box-shadow] ${HOVER} hover:shadow-[0_0_70px_-16px_rgba(224,0,104,0.30)] h-[20rem] sm:h-[22rem] md:h-[19rem] lg:h-[25rem] lg:basis-0 xl:h-[28rem] ${
        tile.spanOnTablet ? "md:col-span-2 lg:col-span-1" : ""
      }`}
    >
      <Link
        href={SHOWCASE_HREF}
        className="block h-full w-full outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#FF3D8F]"
      >
        {/* Media wrapper. Slightly oversized so the settle bounce has somewhere
            to move without exposing an edge; GSAP owns its `y`. */}
        <div className={`${SVC.media} absolute inset-x-0 -inset-y-[3%]`}>
          {/* The photograph. `alt=""` on purpose: this is the panel's
              background, and the link already carries the service name as its
              accessible name — a described image here would make every panel
              announce itself twice. Lazy by default (no `priority`), which is
              right for a section that always sits below the fold.
              GSAP animates `transform` here for the reveal; the hover scale is a
              Tailwind `scale` utility, which in v4 compiles to the standalone
              `scale` property. Two properties, so the two compose instead of
              overwriting each other. */}
          <Image
            src={tile.image}
            alt=""
            fill
            sizes={tile.sizes}
            quality={85}
            className={`${SVC.image} object-cover transition-[scale,filter] ${HOVER} group-hover:scale-[1.08] group-focus-visible:scale-[1.08] motion-reduce:transition-none`}
          />
        </div>

        {/* Readability wash. Deepens slightly on hover, which together with the
            inner glow below is what makes the hovered panel read as lit from
            within rather than merely bigger. */}
        <div
          aria-hidden="true"
          className={`absolute inset-0 bg-black/[0.35] transition-colors ${HOVER} group-hover:bg-black/[0.44] group-focus-visible:bg-black/[0.44]`}
        />

        {/* Reveal-only dimmer. GSAP fades this from `dimFrom` to 0 exactly once,
            so the image gains richness as it lands. Kept separate from the wash
            above so the entrance and the hover never share a property. */}
        <div aria-hidden="true" className={`${SVC.dim} absolute inset-0 bg-black opacity-0`} />

        {/* Soft inner glow, hover only — an inset ring of light just inside the
            panel's edge. */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity ${HOVER} [box-shadow:inset_0_0_60px_-12px_rgba(255,255,255,0.28),inset_0_0_120px_-40px_rgba(224,0,104,0.45)] group-hover:opacity-100 group-focus-visible:opacity-100`}
        />

        {/* A soft bottom gradient, independent of the hover wash — it is what
            keeps the title legible at every wash level. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent"
        />

        <span className="absolute inset-x-0 bottom-0 p-6 sm:p-7 lg:p-9">
          {/* GSAP owns `transform` for the entrance rise; the hover lift uses
              Tailwind's `translate` property, so the two compose. */}
          <span
            className={`${SVC.title} ${TILE_TITLE} transition-[translate] ${HOVER} group-hover:-translate-y-2 group-focus-visible:-translate-y-2 motion-reduce:transition-none`}
          >
            {tile.title}
          </span>
        </span>
      </Link>
    </li>
  );
}

"use client";

import type { MouseEvent } from "react";
import type { Service } from "./types";

/** Magenta hairline used for the animated divider — same hue as the nav rule. */
const ACCENT =
  "bg-[linear-gradient(90deg,#6E1B45_0%,#A6386B_55%,transparent_100%)]";

interface ServiceRowProps {
  service: Service;
  /** Row index, for the floating-preview crossfade. */
  index: number;
  onEnter: (index: number) => void;
  onLeave: (index: number) => void;
  onOpen: (event: MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * One full-width editorial service — no card, no box. A number, a large Cabinet
 * title, a verbatim description, and an "Explore" affordance, separated from the
 * next by a hairline divider.
 *
 * Hover choreography (desktop, all on the site's signature ease, transforms +
 * colour only):
 *  - the title brightens slightly and the title block drifts a few px right;
 *  - the arrow slides horizontally and "Explore" picks up the brand magenta;
 *  - a magenta accent line wipes across the divider from the left.
 * The row carries `data-cursor="link"` so the custom cursor treats it like the
 * rest of the site's links.
 */
export default function ServiceRow({
  service,
  index,
  onEnter,
  onLeave,
  onOpen,
}: ServiceRowProps) {
  const { title, description, note, index: ordinal } = service;

  return (
    <a
      href="#contact"
      data-cursor="link"
      onClick={onOpen}
      onMouseEnter={() => onEnter(index)}
      onMouseLeave={() => onLeave(index)}
      onFocus={() => onEnter(index)}
      onBlur={() => onLeave(index)}
      aria-label={`${title} — explore`}
      className="service-row group relative block border-t border-white/10 outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6E1B45]"
    >
      {/* Animated divider — a magenta line that wipes in from the left on hover. */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 -top-px h-px origin-left scale-x-0 ${ACCENT} shadow-[0_0_12px_rgba(166,56,107,0.5)] transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none`}
      />

      <div className="flex flex-col gap-4 py-8 sm:py-10 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:py-14">
        <div className="flex items-start gap-5 sm:gap-8 lg:gap-16">
          <span className="mt-1 shrink-0 font-[family-name:var(--font-cabinet)] text-base tabular-nums text-neutral-500 transition-colors duration-500 group-hover:text-[#A6386B] sm:mt-2 sm:text-lg">
            {ordinal}
          </span>

          <div className="min-w-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:group-hover:translate-x-3">
            <h3 className="font-[family-name:var(--font-cabinet)] text-[clamp(2rem,6vw,4.5rem)] font-normal leading-[1.02] tracking-[-0.025em] text-neutral-200 transition-colors duration-500 group-hover:text-white">
              {title}
            </h3>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-neutral-400 sm:mt-4 sm:text-base lg:text-[17px]">
              {description}
            </p>
            {note && (
              <p className="mt-2 text-[13px] uppercase tracking-[0.14em] text-neutral-500 sm:text-sm">
                {note}
              </p>
            )}
          </div>
        </div>

        {/* Explore affordance — arrow slides on hover. */}
        <span className="inline-flex shrink-0 items-center gap-2.5 text-sm font-medium uppercase tracking-[0.16em] text-neutral-400 transition-colors duration-500 group-hover:text-[#A6386B] lg:pr-1">
          <span
            aria-hidden="true"
            className="text-lg leading-none transition-transform duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:translate-x-[6px]"
          >
            &rarr;
          </span>
          Explore
        </span>
      </div>
    </a>
  );
}

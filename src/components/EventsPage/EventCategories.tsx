"use client";

import { useRef } from "react";
import { useGsapReveal } from "@/src/hooks/useGsapReveal";
import { CATEGORIES_TITLE, EVENT_CATEGORIES } from "./constants";

/**
 * Event categories as an editorial index — no cards. Each category is a wide
 * text block (large Cabinet name + a quiet descriptor) separated by hairline
 * dividers. On hover the name brightens, the descriptor picks up the brand
 * magenta, and a magenta accent line wipes across the divider. Rows reveal on
 * scroll via the shared GSAP hook.
 */
export default function EventCategories() {
  const scopeRef = useRef<HTMLElement>(null);
  useGsapReveal(scopeRef);

  return (
    <section
      ref={scopeRef}
      aria-label="Event categories"
      data-particles="services"
      className="relative w-full bg-[#1F1F1F] section-y"
    >
      <div className="container-page">
        <p
          data-reveal="up"
          className="text-xs font-medium uppercase tracking-[0.28em] text-neutral-500 sm:text-sm"
        >
          {CATEGORIES_TITLE}
        </p>

        <div className="mt-12 border-b border-white/10 sm:mt-16">
          {EVENT_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              data-reveal="up"
              className="group relative flex flex-col gap-2 border-t border-white/10 py-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8 sm:py-7 lg:py-8"
            >
              {/* Animated divider accent. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 -top-px h-px origin-left scale-x-0 bg-[linear-gradient(90deg,#6E1B45_0%,#A6386B_55%,transparent_100%)] transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
              />
              <h3 className="font-[family-name:var(--font-cabinet)] text-[clamp(1.4rem,3vw,2.5rem)] font-normal leading-[1.05] tracking-[-0.02em] text-neutral-300 transition-colors duration-500 group-hover:text-white">
                {cat.name}
              </h3>
              <span className="shrink-0 text-sm uppercase tracking-[0.14em] text-neutral-500 transition-colors duration-500 group-hover:text-[#A6386B] sm:text-right sm:text-[15px]">
                {cat.blurb}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

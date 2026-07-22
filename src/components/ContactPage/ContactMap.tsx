"use client";

import { useRef } from "react";
import { useGsapReveal } from "@/src/hooks/useGsapReveal";
import { CONTACT_LOCATION, MAP_EMBED_SRC } from "./constants";

/**
 * Interactive map — a large, rounded, near-full-width panel that mask-reveals on
 * scroll. To sit comfortably on the dark theme the map is tinted dark by default
 * and eases back to its true colours on hover (a quiet micro-interaction). The
 * iframe is lazy-loaded so it never blocks earlier content.
 */
export default function ContactMap() {
  const scopeRef = useRef<HTMLElement>(null);
  useGsapReveal(scopeRef);

  return (
    <section
      ref={scopeRef}
      aria-label="Location map"
      data-particles="gallery"
      className="relative w-full bg-[#1F1F1F] section-y"
    >
      <div className="container-page">
        <div
          data-reveal="mask"
          className="group relative h-[52vh] min-h-[22rem] w-full overflow-hidden rounded-[24px] border border-white/10 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.8)]"
        >
          <iframe
            title={`Map of ${CONTACT_LOCATION}`}
            src={MAP_EMBED_SRC}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full w-full border-0 [filter:invert(0.92)_hue-rotate(180deg)_brightness(0.95)_contrast(0.9)] transition-[filter] duration-700 ease-out group-hover:[filter:none]"
          />
          {/* Corner label — quiet editorial caption over the map. */}
          <div className="pointer-events-none absolute bottom-5 left-5 rounded-full border border-white/15 bg-black/40 px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-neutral-200 backdrop-blur-sm">
            {CONTACT_LOCATION}
          </div>
        </div>
      </div>
    </section>
  );
}

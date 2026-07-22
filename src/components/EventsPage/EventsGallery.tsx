"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGsapReveal } from "@/src/hooks/useGsapReveal";
import { useGsapParallax } from "@/src/hooks/useGsapParallax";
import { GALLERY_IMAGES, GALLERY_TITLE } from "./constants";
import type { GalleryImage } from "./types";

/** Aspect ratio per masonry span — varied sizes make the column layout read as
 *  an editorial masonry rather than a uniform grid. */
const SPAN_ASPECT: Record<GalleryImage["span"], string> = {
  tall: "aspect-[3/4.3]",
  wide: "aspect-[4/3]",
  regular: "aspect-[4/5]",
};

/**
 * Immersive gallery — a CSS-columns masonry (no boxed grid) of varied image
 * sizes. Each tile mask-reveals on scroll, drifts with a subtle scrubbed
 * parallax, and on hover gains a slight zoom, brightness lift and soft shadow.
 * Images are `next/image`, lazy-loaded by default and sized per column.
 */
export default function EventsGallery() {
  const scopeRef = useRef<HTMLElement>(null);
  useGsapReveal(scopeRef);
  useGsapParallax(scopeRef, ".gallery-parallax", 5);

  return (
    <section
      ref={scopeRef}
      aria-label="Gallery"
      data-particles="gallery"
      className="relative w-full bg-[#1F1F1F] section-y"
    >
      <div className="container-page">
        <p
          data-reveal="up"
          className="text-xs font-medium uppercase tracking-[0.28em] text-neutral-500 sm:text-sm"
        >
          {GALLERY_TITLE}
        </p>

        <div className="mt-12 gap-4 [column-fill:_balance] sm:mt-16 sm:columns-2 sm:gap-5 lg:columns-3 lg:gap-6">
          {GALLERY_IMAGES.map((img) => (
            <figure
              key={img.id}
              data-reveal="mask"
              data-cursor="image"
              className={`group relative mb-4 block break-inside-avoid overflow-hidden rounded-[16px] shadow-[0_16px_40px_-28px_rgba(0,0,0,0.7)] transition-shadow duration-500 hover:shadow-[0_36px_80px_-30px_rgba(0,0,0,0.8)] sm:mb-5 lg:mb-6 ${SPAN_ASPECT[img.span]}`}
            >
              <div className="gallery-parallax absolute inset-x-0 -top-[7%] h-[114%] will-change-transform">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-[transform,filter] duration-[700ms] ease-out will-change-transform group-hover:scale-[1.05] group-hover:brightness-110"
                />
              </div>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

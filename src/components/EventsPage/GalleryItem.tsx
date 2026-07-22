"use client";

import { useRef, type MouseEvent } from "react";
import Image from "next/image";
import type { PortfolioEvent } from "./types";

interface GalleryItemProps {
  event: PortfolioEvent;
  onOpen: (event: MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * One editorial event preview — no card, no bordered box. A large cinematic
 * visual with rounded corners + soft shadow, then the metadata set as free
 * editorial text beneath it (category · year, title, location, description and a
 * minimal "View Details →" link).
 *
 * Every preview shares one aspect ratio so the visuals are all the same height,
 * and the article stretches to its grid row so whole cards align.
 *
 * Premium hover choreography (all GPU transforms + opacity, signature ease):
 *  - the whole visual lifts 8px and its image zooms slightly;
 *  - a dark gradient overlay fades in;
 *  - the title brightens and the View Details arrow slides;
 *  - a very subtle pointer parallax drifts the image within its frame.
 * Carries `data-cursor="image"` so the site's custom cursor treats it as media.
 */
export default function GalleryItem({ event, onOpen }: GalleryItemProps) {
  const { category, title, location, year, description, image, imageAlt, video } =
    event;
  const parallaxRef = useRef<HTMLDivElement>(null);

  // Subtle pointer parallax — imperative, no re-render. Skipped on coarse
  // pointers (no hover) and when the ref isn't ready.
  const onMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = parallaxRef.current;
    if (!el) return;
    const r = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - r.left) / r.width - 0.5;
    const dy = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `translate3d(${dx * -12}px, ${dy * -12}px, 0)`;
  };
  const onLeave = () => {
    const el = parallaxRef.current;
    if (el) el.style.transform = "translate3d(0,0,0)";
  };

  return (
    <article className="gallery-item">
      <a
        href="#contact"
        onClick={onOpen}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        data-cursor="image"
        aria-label={`${title} — view details`}
        className="group block outline-none"
      >
        {/* Visual — lifts on hover. */}
        <div
          className="gallery-media relative aspect-[4/3] w-full overflow-hidden rounded-[22px] shadow-[0_30px_70px_-40px_rgba(0,0,0,0.85)] transition-[transform,box-shadow] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover:-translate-y-2 group-hover:shadow-[0_45px_90px_-40px_rgba(0,0,0,0.9)] group-focus-visible:-translate-y-2"
        >
          {/* Parallax layer — slightly oversized so the drift never reveals an
              edge. */}
          <div
            ref={parallaxRef}
            className="absolute -inset-4 transition-transform duration-[500ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
          >
            {video ? (
              <video
                className="h-full w-full scale-100 object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                src={video}
                poster={image}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                aria-label={imageAlt}
              />
            ) : (
              <Image
                src={image}
                alt={imageAlt}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                quality={85}
                className="scale-100 object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
              />
            )}
          </div>

          {/* Dark overlay — fades in on hover. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 transition-opacity duration-[600ms] ease-out group-hover:opacity-100"
          />
          {/* Constant faint grade so the image never reads as flat. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_0%,transparent_55%,rgba(0,0,0,0.28)_100%)]"
          />
        </div>

        {/* Metadata — free editorial text, no box. */}
        <div className="mt-5">
          <div className="flex items-center gap-3 font-[family-name:var(--font-urbanist)] text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-500">
            <span className="text-[#A6386B]">{category}</span>
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-neutral-600" />
            <span className="tabular-nums">{year}</span>
          </div>

          <h3 className="mt-3 font-[family-name:var(--font-cabinet)] text-[clamp(1.5rem,2.1vw,2.1rem)] font-normal leading-[1.1] tracking-[-0.02em] text-neutral-200 transition-colors duration-500 group-hover:text-white">
            {title}
          </h3>

          <p className="mt-2 font-[family-name:var(--font-urbanist)] text-sm text-neutral-400">
            {location}
          </p>

          <p className="mt-3 max-w-md font-[family-name:var(--font-urbanist)] text-[20px] font-light leading-[1.65] text-neutral-400">
            {description}
          </p>

          <span className="relative mt-5 inline-flex items-center gap-2.5 pb-1 font-[family-name:var(--font-urbanist)] text-xs font-medium uppercase tracking-[0.18em] text-neutral-300 transition-colors duration-500 group-hover:text-white">
            View Details
            <span
              aria-hidden="true"
              className="text-[#A6386B] transition-transform duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:translate-x-1.5"
            >
              &rarr;
            </span>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-[linear-gradient(90deg,#6E1B45,#A6386B)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
            />
          </span>
        </div>
      </a>
    </article>
  );
}

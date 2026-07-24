"use client";

import Image from "next/image";
import { useRef, type MouseEvent } from "react";
import EventCardLink from "./EventCardLink";
import type { EventItem } from "./types";

interface EventCardProps {
  item: EventItem;
  /** Opens the shared video modal. Only wired when the item has a `videoUrl`. */
  onWatch?: () => void;
  /** Home preview clamps the description; the structure stays identical. */
  compact?: boolean;
}

/**
 * The single, reusable event card — used verbatim on both the Home featured
 * preview and the full /events portfolio (see EventGrid). Editorial by design:
 * a rounded cinematic visual with hover zoom + a subtle pointer parallax, then
 * a fixed content hierarchy beneath it —
 *
 *   Image → Category · Date → Title → (Location) → Description → Actions
 *
 * The action row adapts to the data: "Watch Highlights" appears only with a
 * `videoUrl` (and opens the modal via `onWatch`), "View Gallery" only with a
 * `galleryHref`, "Learn More" only with a `learnMoreHref`. The first available
 * action is the emphasised (filled) one so a card never shows two equal buttons.
 *
 * The `<li>` is the GSAP entrance target (`.event-card`) and `.event-media` is
 * the parallax-scrub target — both owned by EventGrid — so this component stays
 * presentational and the two motion systems never fight over one transform.
 */
export default function EventCard({ item, onWatch, compact = false }: EventCardProps) {
  const parallaxRef = useRef<HTMLDivElement>(null);

  // Subtle pointer parallax — imperative, no re-render; skipped on coarse
  // pointers (no hover fires there) and when the ref isn't ready.
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
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

  const hasVideo = Boolean(item.videoUrl) && Boolean(onWatch);
  // One link on every card. The play badge already handles "watch" for videos.
  const detailsHref = item.learnMoreHref ?? item.galleryHref;

  return (
    <li className="event-card group list-none [will-change:transform]">
      {/* Visual — lifts on hover; the inner layer carries zoom + pointer drift. */}
      <div
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        data-cursor="image"
        className="event-media relative aspect-[4/3] w-full overflow-hidden rounded-[22px] bg-neutral-900 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.85)] transition-[transform,box-shadow] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover:-translate-y-2 group-hover:shadow-[0_45px_90px_-40px_rgba(0,0,0,0.9)]"
      >
        {/* Parallax layer — slightly oversized so the drift never reveals an
            edge. Zoom + brightness live on the image itself. */}
        <div
          ref={parallaxRef}
          className="absolute -inset-4 transition-transform duration-[500ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
        >
          <Image
            src={item.image}
            alt={item.imageAlt}
            fill
            loading="lazy"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            quality={88}
            className="object-cover transition-[transform,filter] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05] group-hover:brightness-[1.04]"
          />
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

        {/* Play badge — accessible full-bleed trigger; only when a video exists. */}
        {hasVideo && (
          <button
            type="button"
            onClick={onWatch}
            data-cursor="button"
            aria-label={`Watch highlights: ${item.title}`}
            className="absolute inset-0 z-10 grid place-items-center rounded-[22px] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/80"
          >
            <span className="grid h-16 w-16 place-items-center rounded-full bg-black/45 ring-1 ring-white/25 backdrop-blur-sm transition-transform duration-500 ease-out group-hover:scale-110">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-6 w-6 translate-x-[1px] fill-white"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        )}
      </div>

      {/* Content — fixed hierarchy shared by both pages. */}
      <div className="mt-5">
        <div className="flex items-center gap-3 font-[family-name:var(--font-urbanist)] text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-500">
          <span className="text-[#FFD83D]">{item.category}</span>
          {item.date && (
            <>
              <span aria-hidden="true" className="h-1 w-1 rounded-full bg-neutral-600" />
              <span className="tabular-nums">{item.date}</span>
            </>
          )}
        </div>

        <h3 className="mt-3 font-[family-name:var(--font-cabinet)] text-[clamp(1.5rem,2.1vw,2.1rem)] font-normal leading-[1.1] tracking-[-0.02em] text-neutral-100 transition-colors duration-500 group-hover:text-white">
          {item.title}
        </h3>

        {item.location && (
          <p className="mt-2 font-[family-name:var(--font-urbanist)] text-sm text-neutral-400">
            {item.location}
          </p>
        )}

        <p
          className={`mt-3 max-w-xl font-[family-name:var(--font-urbanist)] text-[18px] font-light leading-[1.65] text-neutral-300 ${
            compact ? "line-clamp-3" : ""
          }`}
        >
          {item.description}
        </p>

        {detailsHref && (
          <div className="mt-6">
            <EventCardLink href={detailsHref} ariaLabel={`View details: ${item.title}`}>
              View Details
            </EventCardLink>
          </div>
        )}
      </div>
    </li>
  );
}

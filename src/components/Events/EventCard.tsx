"use client";

import Image from "next/image";
import type { EventCardItem } from "./types";

interface EventCardProps {
  item: EventCardItem;
  /** Opens the video modal for this card. */
  onPlay: () => void;
}

/**
 * A single event highlight. The `<li>` is the GSAP entrance target
 * (`.event-card`); the inner `<article>` owns the hover lift so its transform
 * never collides with the entrance transform. A full-bleed button over the
 * thumbnail is the accessible trigger (keyboard + pointer); the glass play
 * badge is decorative. Nothing autoplays here — clicking opens the modal.
 */
export default function EventCard({ item, onPlay }: EventCardProps) {
  return (
    <li className="event-card list-none [will-change:transform]">
      <article className="group transition-transform duration-500 ease-out will-change-transform hover:-translate-y-1.5">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-neutral-900 shadow-[0_0_0_rgba(0,0,0,0)] transition-shadow duration-500 ease-out group-hover:shadow-[0_34px_70px_-30px_rgba(0,0,0,0.45)]">
          <Image
            src={item.image}
            alt={item.imageAlt}
            fill
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 48vw"
            quality={90}
            className="object-cover transition-[transform,filter] duration-[600ms] ease-out will-change-transform group-hover:scale-[1.08] group-hover:brightness-[1.05]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-black/[0.04]"
          />

          <button
            type="button"
            onClick={onPlay}
            data-cursor="button"
            aria-label={`Play video: ${item.category} — ${item.tag}`}
            className="absolute inset-0 z-10 grid place-items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
          >
            <Image
              src="/images/youtube.png"
              alt=""
              aria-hidden="true"
              width={89}
              height={59}
              className="h-auto w-[74px] drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)] transition-transform duration-500 ease-out will-change-transform group-hover:scale-110 sm:w-[88px]"
            />
          </button>
        </div>

        <h3 className="mt-6 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-neutral-900 transition-colors duration-300 group-hover:text-[#6E1B45]">
          <span>
            {item.category} <span className="text-neutral-400">|</span> {item.tag}
          </span>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-4 w-4 shrink-0 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          >
            <path d="M7 17 17 7M8 7h9v9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </h3>

        <p className="mt-4 max-w-xl text-[clamp(1.05rem,1.4vw,1.4rem)] leading-relaxed text-neutral-600 line-clamp-3">
          {item.description}
        </p>
      </article>
    </li>
  );
}

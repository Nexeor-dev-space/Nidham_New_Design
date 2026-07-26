"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import EventCard from "./EventCard";
import VideoModal from "./VideoModal";
import CinematicVideoModal from "./CinematicVideoModal";
import type { EventItem } from "./types";
import { DUR, GSAP_EASE, STAGGER } from "@/src/lib/motion";

gsap.registerPlugin(ScrollTrigger);

interface EventGridProps {
  items: readonly EventItem[];
  /** Clamp descriptions (Home preview). Structure is unchanged either way. */
  compact?: boolean;
  /** Grid column classes for the <ul>. Defaults to a 2-up layout. */
  className?: string;
}

const DEFAULT_GRID =
  "grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 sm:gap-x-8 lg:gap-y-16";

/**
 * The shared event grid — the ONE place both pages render {@link EventCard}s, so
 * the layout, the reveal choreography and the video modal are identical
 * everywhere by construction.
 *
 * Motion (matched to the site's system in lib/motion, skipped under
 * prefers-reduced-motion so content stays visible):
 *   • Reveal — cards fade + rise + scale-up with blur removal, staggered as each
 *     row scrolls in (ScrollTrigger.batch).
 *   • Parallax — each card's `.event-media` drifts on a scrubbed timeline.
 * The reveal targets the `<li>` (`.event-card`) while hover/parallax target the
 * inner `.event-media`, so no two effects ever share one transform.
 */
export default function EventGrid({
  items,
  compact = false,
  className = DEFAULT_GRID,
}: EventGridProps) {
  const rootRef = useRef<HTMLUListElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      // Only under allowed motion; reduced motion keeps the cards visible.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(".event-card", root);
        if (!cards.length) return;

        gsap.set(cards, { autoAlpha: 0, y: 40, scale: 0.96, filter: "blur(8px)" });
        ScrollTrigger.batch(cards, {
          start: "top 88%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
              duration: DUR.base,
              ease: GSAP_EASE,
              stagger: STAGGER,
              overwrite: true,
              force3D: true,
            }),
        });

        // Subtle scrubbed parallax on each card's media block.
        cards.forEach((card) => {
          const media = card.querySelector<HTMLElement>(".event-media");
          if (!media) return;
          gsap.fromTo(
            media,
            { yPercent: -2 },
            {
              yPercent: 2,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        });
      });
    }, root);

    return () => ctx.revert();
  }, [items]);

  const active = activeIndex !== null ? items[activeIndex] : null;
  const close = () => setActiveIndex(null);

  /**
   * Two players, picked by what the event actually has. A self-hosted file gets
   * the cinematic lightbox (custom controls, which need a real `<video>`); an
   * embed URL gets the iframe one. `videoSrc` wins if an event somehow carries
   * both, so this is never ambiguous.
   */
  const embedUrl = active && !active.videoSrc ? active.videoUrl ?? "" : "";

  /**
   * VideoModal keeps itself mounted and fades on `open`, and it does not portal
   * — so rendering it unconditionally would leave a permanent second
   * `role="dialog"` in the page markup. Mount it only for grids that actually
   * contain an embed-backed event (today: the /events portfolio, not Home).
   */
  const hasEmbed = items.some((item) => !item.videoSrc && item.videoUrl);

  return (
    <>
      <ul ref={rootRef} className={className}>
        {items.map((item, i) => (
          <EventCard
            key={item.id}
            item={item}
            compact={compact}
            onWatch={
              item.videoSrc ?? item.videoUrl ? () => setActiveIndex(i) : undefined
            }
          />
        ))}
      </ul>

      {/* Mounted only while playing — that is this lightbox's whole open/closed
          contract, and it is what keeps the file un-fetched until asked. */}
      {active?.videoSrc && (
        <CinematicVideoModal
          onClose={close}
          src={active.videoSrc}
          title={active.videoTitle ?? active.title}
          poster={active.image}
          posterAlt={active.imageAlt}
        />
      )}

      {hasEmbed && (
        <VideoModal
          open={Boolean(embedUrl)}
          title={active?.title ?? ""}
          videoUrl={embedUrl}
          onClose={close}
        />
      )}
    </>
  );
}

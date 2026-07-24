"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import EventCard from "./EventCard";
import VideoModal from "./VideoModal";
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

  return (
    <>
      <ul ref={rootRef} className={className}>
        {items.map((item, i) => (
          <EventCard
            key={item.id}
            item={item}
            compact={compact}
            onWatch={item.videoUrl ? () => setActiveIndex(i) : undefined}
          />
        ))}
      </ul>

      <VideoModal
        open={active !== null}
        title={active?.title ?? ""}
        videoUrl={active?.videoUrl ?? ""}
        onClose={() => setActiveIndex(null)}
      />
    </>
  );
}

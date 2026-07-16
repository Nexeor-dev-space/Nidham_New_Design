"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import EventCard from "./EventCard";
import VideoModal from "./VideoModal";
import { EVENTS_GALLERY } from "./constants";
import type { EventCardItem } from "./types";

gsap.registerPlugin(ScrollTrigger);

interface EventsGalleryProps {
  items?: EventCardItem[];
  id?: string;
}

/**
 * Grid of event-highlight cards with a shared video modal. Cards reveal once on
 * scroll (fade + rise + slight scale, staggered left → right) via GSAP; the
 * reveal is skipped under prefers-reduced-motion so content stays visible.
 */
export default function EventsGallery({
  items = EVENTS_GALLERY,
  id,
}: EventsGalleryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      // Only runs when motion is allowed; under reduce the cards stay visible.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(".event-card");
        gsap.fromTo(
          cards,
          { autoAlpha: 0, y: 48, scale: 0.97 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.18,
            force3D: true,
            scrollTrigger: { trigger: section, start: "top 78%", once: true },
          },
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const active = activeIndex !== null ? items[activeIndex] : null;

  return (
    <section
      ref={sectionRef}
      id={id}
      aria-label="Event highlights"
      className="w-full bg-[#F1F0EE] section-y font-[family-name:var(--font-geist-sans)]"
    >
      <div className="container-page">
        <ul className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-10 lg:gap-16">
          {items.map((item, i) => (
            <EventCard key={item.id} item={item} onPlay={() => setActiveIndex(i)} />
          ))}
        </ul>
      </div>

      <VideoModal
        open={active !== null}
        title={active ? `${active.category} — ${active.tag}` : ""}
        videoUrl={active?.videoUrl ?? ""}
        onClose={() => setActiveIndex(null)}
      />
    </section>
  );
}

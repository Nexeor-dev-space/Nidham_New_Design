"use client";

import { motion, useReducedMotion } from "framer-motion";
import EventGrid from "./EventGrid";
import EventButton from "./EventButton";
import SectionDivider from "@/src/components/ui/SectionDivider";
import { FEATURED_EVENTS } from "./events.data";
import { SECTION_CONTENT_GAP, SECTION_HEADING, SECTION_HEADING_GAP } from "@/src/lib/typography";
import { fadeUp, VIEWPORT } from "@/src/lib/motion";

interface EventsGalleryProps {
  id?: string;
}

/**
 * Home page — the Featured Events *preview*. It renders only the `featured`
 * subset of the shared {@link EVENTS} portfolio through the same {@link EventGrid}
 * the /events page uses, then a single prominent "Explore All Events" CTA that
 * carries the visitor into the full collection. The Home page is deliberately a
 * teaser; the dedicated page is the complete portfolio.
 */
export default function EventsGallery({ id }: EventsGalleryProps) {
  const reduce = useReducedMotion() ?? false;

  return (
    <section
      id={id}
      aria-labelledby="featured-events-title"
      data-particles="gallery"
      className="w-full bg-[#1F1F1F] section-y"
    >
      <div className="container-page">
        <SectionDivider label="Featured Events" />

        <motion.h2
          id="featured-events-title"
          variants={fadeUp(reduce, 0, 26)}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className={`${SECTION_HEADING_GAP} ${SECTION_HEADING}`}
        >
          Highlights from the floor
        </motion.h2>

        <div className={SECTION_CONTENT_GAP}>
          <EventGrid items={FEATURED_EVENTS} compact />
        </div>

        {/* Preview → full collection. */}
        <motion.div
          variants={fadeUp(reduce, 0.1, 22)}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mt-14 flex justify-center sm:mt-16"
        >
          <EventButton href="/events" variant="primary">
            Explore All Events
          </EventButton>
        </motion.div>
      </div>
    </section>
  );
}

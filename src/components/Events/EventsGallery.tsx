"use client";

import { motion, useReducedMotion } from "framer-motion";
import EventGrid from "./EventGrid";
import SectionDivider from "@/src/components/ui/SectionDivider";
import { FEATURED_EVENTS } from "./events.data";
import { SECTION_CONTENT_GAP, SECTION_HEADING, SECTION_HEADING_GAP } from "@/src/lib/typography";
import { fadeUp, VIEWPORT } from "@/src/lib/motion";

interface EventsGalleryProps {
  id?: string;
}

/**
 * Home page — the Featured Event highlight.
 *
 * With a single featured event (the current business reality) it renders one
 * centred, capped-width hero card — a curated highlight, not a row with a gap
 * where a second card used to be. If more events are ever marked `featured`, it
 * falls back automatically to the shared two-up {@link EventGrid}, so the layout
 * scales without a code change. Either way it uses the very same
 * {@link EventCard} the /events page uses.
 *
 * There is intentionally no "Explore All Events" CTA and no link on to the
 * /events listing: with one event there is nothing to browse. The dedicated
 * /events page and its route stay in the project for future expansion.
 */
export default function EventsGallery({ id }: EventsGalleryProps) {
  const reduce = useReducedMotion() ?? false;
  const isSingle = FEATURED_EVENTS.length === 1;

  return (
    <section
      id={id}
      aria-labelledby="featured-events-title"
      data-particles="gallery"
      className="w-full bg-[#1F1F1F] section-y"
    >
      <div className="container-page">
        <SectionDivider label={isSingle ? "Featured Event" : "Featured Events"} />

        <motion.h2
          id="featured-events-title"
          variants={fadeUp(reduce, 0, 26)}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className={`${SECTION_HEADING_GAP} ${SECTION_HEADING}`}
        >
          {isSingle ? "Our latest highlight" : "Highlights from the floor"}
        </motion.h2>

        <div className={SECTION_CONTENT_GAP}>
          {/* Single featured event → one centred hero card (full description,
              capped width). More than one → the default two-up grid. */}
          <EventGrid
            items={FEATURED_EVENTS}
            compact={!isSingle}
            className={isSingle ? "mx-auto w-full max-w-3xl" : undefined}
          />
        </div>
      </div>
    </section>
  );
}

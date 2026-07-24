"use client";

import { motion, useReducedMotion } from "framer-motion";
import EventGrid from "@/src/components/Events/EventGrid";
import { EVENTS } from "@/src/components/Events/events.data";
import { SECTION_HEADING } from "@/src/lib/typography";
import { fadeUp, VIEWPORT } from "@/src/lib/motion";

/**
 * /events — the complete Events Portfolio. A natural continuation of the Home
 * page's featured preview: it renders the full {@link EVENTS} list through the
 * exact same {@link EventGrid} + {@link EventCard}, so the card design,
 * interactions and motion are identical across both pages. The ambient backdrop
 * (soft radial glows + faint grain) keeps the section from ever reading as flat
 * black; the grid scales to any number of future events without a redesign.
 */
export default function EventsPortfolio() {
  const reduce = useReducedMotion() ?? false;

  return (
    <section
      aria-labelledby="events-portfolio-title"
      data-particles="gallery"
      className="relative w-full overflow-hidden bg-[#141414]"
    >
      {/* Ambient backdrop — soft radial glows + faint grain; never flat black. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -left-40 top-[10%] h-[36rem] w-[36rem] rounded-full bg-[#6E1B45]/[0.10] blur-[120px]" />
        <div className="absolute -right-44 top-[45%] h-[40rem] w-[40rem] rounded-full bg-amber-300/[0.05] blur-[130px]" />
        <div className="absolute -left-32 top-[80%] h-[38rem] w-[38rem] rounded-full bg-[#6E1B45]/[0.08] blur-[125px]" />
        <div className="hero-grain absolute inset-0 opacity-[0.03] mix-blend-soft-light" />
      </div>

      <div className="container-page relative z-10 py-16 sm:py-20 lg:py-24">
        {/* Editorial header. */}
        <motion.p
          variants={fadeUp(reduce, 0, 18)}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="flex items-center justify-center gap-4 font-[family-name:var(--font-urbanist)] text-[11px] font-medium uppercase tracking-[0.32em] text-neutral-400"
        >
          <span aria-hidden="true" className="h-px w-10 bg-[#A6386B]/80" />
          The Portfolio
        </motion.p>

        <motion.h2
          id="events-portfolio-title"
          variants={fadeUp(reduce, 0.1, 26)}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className={`mt-6 ${SECTION_HEADING}`}
        >
          Every event, end to end
        </motion.h2>

        <div className="mt-14 sm:mt-16 lg:mt-20">
          <EventGrid
            items={EVENTS}
            className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 sm:gap-x-7 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16"
          />
        </div>
      </div>
    </section>
  );
}

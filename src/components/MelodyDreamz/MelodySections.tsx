"use client";

import { useState } from "react";
import Image from "next/image";
import SectionDivider from "@/src/components/ui/SectionDivider";
import FilmModal from "./FilmModal";
import MelodyContinue from "./MelodyContinue";
import { REVEAL } from "@/src/hooks/useEditorialReveal";
import { SECTION_HEADING, SECTION_HEADING_GAP } from "@/src/lib/typography";
import {
  MD_CLOSE,
  MD_FILM,
  MD_FILM_ID,
  MD_HIGHLIGHTS,
  MD_HIGHLIGHTS_HEADING,
  MD_HIGHLIGHTS_INTRO,
  MD_QUOTE,
  MD_STATS,
  MD_STORY,
  MD_TAGS,
} from "./constants";

/** Glass surface shared by the stat and highlight cards. */
const GLASS =
  "rounded-2xl border border-white/[0.08] bg-white/[0.025] backdrop-blur-md";

/** Editorial body copy — one measure and one scale for every paragraph. */
const BODY =
  "font-[family-name:var(--font-urbanist)] text-[17px] font-light leading-[1.8] text-neutral-300 sm:text-[19px]";

/* ========================================================================== */
/*  Overview — the metadata strip + statistics                                */
/* ========================================================================== */

/**
 * Statistics as glass cards. Cards with a `count` run a scroll-triggered counter
 * (see useEditorialReveal); cards with a `display` string show it flat. That
 * split exists so a venue or category never has a number invented for it just to
 * make the row look uniform.
 */
export function MelodyOverview() {
  return (
    <section
      id="md-overview"
      aria-labelledby="md-overview-heading"
      className="w-full bg-[#201D1A] section-y"
    >
      <div className="container-page">
        <SectionDivider label="Overview" />
        <h2
          id="md-overview-heading"
          className={`${SECTION_HEADING_GAP} ${SECTION_HEADING} ${REVEAL.up}`}
        >
          {MD_HIGHLIGHTS_HEADING}
        </h2>

        <p className={`mx-auto mt-8 max-w-3xl text-center ${BODY} ${REVEAL.up}`}>
          {MD_HIGHLIGHTS_INTRO}
        </p>

        <ul className="mt-14 grid grid-cols-1 gap-5 sm:mt-16 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:gap-6">
          {MD_STATS.map((stat) => (
            <li
              key={stat.id}
              // Same as the highlight cards: lift + border only, no glow.
              className={`${GLASS} ${REVEAL.up} group relative overflow-hidden p-7 transition-[transform,border-color] duration-[600ms] ease-[cubic-bezier(0.165,0.84,0.44,1)] hover:-translate-y-1 hover:border-[#E00068]/35 sm:p-8`}
            >
              {/* Soft brand wash, hover only. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_70%_at_20%_0%,rgba(224,0,104,0.16),transparent_70%)] opacity-0 transition-opacity duration-[600ms] group-hover:opacity-100"
              />

              <p className="relative font-[family-name:var(--font-cabinet)] text-[clamp(2rem,4vw,2.9rem)] font-normal leading-none tracking-[-0.02em] text-white">
                {stat.count !== undefined ? (
                  <>
                    {/* Renders the real value for SSR / no-JS; the hook zeroes
                        and counts it up on arrival. */}
                    <span className={REVEAL.count} data-count={String(stat.count)}>
                      {stat.count}
                    </span>
                    {stat.suffix}
                  </>
                ) : (
                  <span className="text-[clamp(1.35rem,2.2vw,1.75rem)]">
                    {stat.display}
                  </span>
                )}
              </p>

              <p className="relative mt-4 font-[family-name:var(--font-urbanist)] text-[12px] font-medium uppercase tracking-[0.2em] text-neutral-500">
                {stat.label}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ========================================================================== */
/*  Story — alternating image / text editorial blocks                         */
/* ========================================================================== */

/**
 * The story blocks, alternating side to side. Each photograph sits in a
 * `r-drift` wrapper for a slow scrubbed parallax, with the mask reveal on the
 * image itself — two different elements, so the scrubbed transform and the
 * one-shot clip never fight over the same property.
 */
export function MelodyStory() {
  return (
    <section
      id="md-story"
      aria-labelledby="md-story-heading"
      className="w-full bg-[#111111] section-y"
    >
      <div className="container-page">
        <SectionDivider label="The Story" />
        <h2 id="md-story-heading" className="sr-only">
          The Story
        </h2>

        <div className="mt-12 flex flex-col gap-20 sm:mt-14 sm:gap-24 lg:mt-16 lg:gap-32">
          {MD_STORY.map((block) => (
            <article
              key={block.id}
              className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16"
            >
              {/* `lg:order-2` flips the photograph to the right for blocks
                  marked `side: "right"`, which is what alternates the rhythm. */}
              <div
                className={`${REVEAL.drift} ${
                  block.side === "right" ? "lg:order-2" : ""
                }`}
                data-parallax="34"
              >
                {/* The photographs' own ratio (1285×658), not a generic 4/3 —
                    a 4/3 slot would crop a third of the width off these wide
                    stage shots. Kept in step with `MD_STORY`. */}
                <div className="relative aspect-[1285/658] w-full overflow-hidden rounded-2xl bg-neutral-900 ring-1 ring-white/[0.06]">
                  <Image
                    src={block.image}
                    alt={block.imageAlt}
                    fill
                    sizes="(max-width: 1023px) 100vw, 50vw"
                    quality={85}
                    className={`${REVEAL.plate} object-cover`}
                  />
                </div>
              </div>

              <div className={block.side === "right" ? "lg:order-1" : ""}>
                <h3
                  className={`${REVEAL.up} font-[family-name:var(--font-cabinet)] text-[clamp(1.6rem,3.4vw,2.6rem)] font-normal leading-[1.15] tracking-[-0.02em] text-neutral-100`}
                >
                  {block.heading}
                </h3>
                <p className={`${REVEAL.up} mt-7 ${BODY}`}>{block.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========================================================================== */
/*  Film — cinematic video, click to play                                     */
/* ========================================================================== */

/**
 * The event film. A YouTube embed, so it uses this page's own `FilmModal` rather
 * than the site's `CinematicVideoModal` (which is built around a `<video>`).
 *
 * Playback happens in a **fullscreen modal**, not inline. An earlier version
 * swapped the poster for the iframe in place, which left the reader with no way
 * out — no close control, no Escape, and clicking away did nothing. The modal
 * closes on its Close button, on Escape and on a backdrop click.
 *
 * The section itself never autoplays: the iframe does not exist until the modal
 * opens, so nothing is requested from YouTube until the reader asks for it.
 */
export function MelodyFilm() {
  const [playing, setPlaying] = useState(false);

  return (
    <section
      id={MD_FILM_ID}
      aria-labelledby="md-film-heading"
      className="relative w-full overflow-hidden bg-[#0B0B0B] section-y"
    >
      {/* Premium gradient bed behind the frame. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(224,0,104,0.16),transparent_70%),radial-gradient(50%_45%_at_15%_90%,rgba(140,0,59,0.18),transparent_72%)]"
      />

      <div className="container-page relative">
        <SectionDivider label="The Film" />
        <h2
          id="md-film-heading"
          className={`${SECTION_HEADING_GAP} ${SECTION_HEADING} ${REVEAL.up}`}
        >
          {MD_FILM.title}
        </h2>

        <div className={`${REVEAL.plate} mt-12 sm:mt-14 lg:mt-16`}>
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-neutral-900 ring-1 ring-white/[0.08] shadow-[0_60px_120px_-50px_rgba(224,0,104,0.4)]">
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label={`Play ${MD_FILM.title}`}
              className="group absolute inset-0 h-full w-full outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#FF3D8F]"
            >
              {/* `object-top`, not the default centre: this poster is 3:2 in a
                  16:9 slot, and a centred crop clips the raised hand at the top
                  of the frame. See MD_FILM.poster. */}
              <Image
                src={MD_FILM.poster}
                alt=""
                fill
                sizes="100vw"
                quality={85}
                className="object-cover object-top transition-[scale,filter] duration-[1200ms] ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:scale-[1.03] group-hover:brightness-[1.05]"
              />
              <span aria-hidden="true" className="absolute inset-0 bg-black/45 transition-colors duration-700 group-hover:bg-black/35" />

              {/* Glow play button. */}
              <span
                aria-hidden="true"
                className="absolute inset-0 grid place-items-center"
              >
                <span className="relative grid h-20 w-20 place-items-center rounded-full bg-[#E00068] text-white shadow-[0_0_60px_-6px_rgba(224,0,104,0.9)] transition-[transform,background-color] duration-[600ms] ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:bg-[#8C003B] motion-safe:group-hover:scale-110 sm:h-24 sm:w-24">
                  {/* Slow halo pulse — one ring, not a fireworks display. */}
                  <span className="absolute inset-0 rounded-full border border-white/30 motion-safe:animate-ping motion-reduce:hidden" />
                  <svg viewBox="0 0 24 24" fill="currentColor" className="relative h-7 w-7 translate-x-[2px] sm:h-8 sm:w-8">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>

      <FilmModal
        open={playing}
        onClose={() => setPlaying(false)}
        src={MD_FILM.src}
        title={MD_FILM.title}
      />
    </section>
  );
}

/* ========================================================================== */
/*  Highlights — numbered glass cards                                        */
/* ========================================================================== */

export function MelodyHighlights() {
  return (
    <section
      id="md-highlights"
      aria-labelledby="md-highlights-heading"
      className="w-full bg-[#201D1A] section-y"
    >
      <div className="container-page">
        <SectionDivider label="Highlights" />
        <h2
          id="md-highlights-heading"
          className={`${SECTION_HEADING_GAP} ${SECTION_HEADING} ${REVEAL.up}`}
        >
          Key Highlights
        </h2>

        <ul className="mt-12 grid grid-cols-1 gap-5 sm:mt-14 lg:mt-16 lg:grid-cols-3 lg:gap-6">
          {MD_HIGHLIGHTS.map((item, i) => (
            <li
              key={item.id}
              // No glow on hover — the lift and the pink border carry it. A
              // large pink drop-shadow behind a near-black card read as a haze
              // bleeding onto the section bed rather than as elevation.
              className={`${GLASS} ${REVEAL.up} group relative flex flex-col overflow-hidden p-7 transition-[transform,border-color] duration-[600ms] ease-[cubic-bezier(0.165,0.84,0.44,1)] hover:-translate-y-1.5 hover:border-[#E00068]/35 sm:p-9`}
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_15%_0%,rgba(224,0,104,0.18),transparent_70%)] opacity-0 transition-opacity duration-[600ms] group-hover:opacity-100"
              />

              <span className="relative font-[family-name:var(--font-cabinet)] text-[13px] font-medium tabular-nums tracking-[0.2em] text-[#FF3D8F]">
                {String(i + 1).padStart(2, "0")}
              </span>

              <h3 className="relative mt-6 font-[family-name:var(--font-cabinet)] text-[clamp(1.25rem,1.9vw,1.6rem)] font-medium leading-[1.2] tracking-[-0.015em] text-white">
                {item.title}
              </h3>

              <p className="relative mt-4 font-[family-name:var(--font-urbanist)] text-[16px] font-light leading-[1.75] text-neutral-400">
                {item.text}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ========================================================================== */
/*  Quote — the sentence the article already made its centre                  */
/* ========================================================================== */

export function MelodyQuote() {
  return (
    <section
      aria-label="Quote"
      className="relative w-full overflow-hidden bg-[#111111] section-y"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_50%_at_50%_50%,rgba(224,0,104,0.12),transparent_72%)]"
      />

      <div className="container-page relative">
        <blockquote className="mx-auto max-w-5xl text-center">
          <span
            aria-hidden="true"
            className={`${REVEAL.up} block font-[family-name:var(--font-cabinet)] text-[6rem] leading-[0.5] text-[#E00068]/30 sm:text-[8rem]`}
          >
            &ldquo;
          </span>

          <p
            className={`${REVEAL.up} mt-8 font-[family-name:var(--font-cabinet)] text-[clamp(1.6rem,4.4vw,3.4rem)] font-light leading-[1.25] tracking-[-0.02em] text-white`}
          >
            {MD_QUOTE.text}
          </p>

          <footer
            className={`${REVEAL.up} mt-10 font-[family-name:var(--font-urbanist)] text-[12px] font-medium uppercase tracking-[0.28em] text-neutral-500`}
          >
            {MD_QUOTE.attribution}
          </footer>
        </blockquote>
      </div>
    </section>
  );
}

/* ========================================================================== */
/*  Close — the closing paragraph + tags                                     */
/* ========================================================================== */

export function MelodyClose() {
  return (
    <section
      aria-labelledby="md-close-heading"
      className="w-full bg-[#201D1A] section-y"
    >
      <div className="container-page">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="md-close-heading"
            className={`${REVEAL.up} ${SECTION_HEADING}`}
          >
            {MD_CLOSE.heading}
          </h2>

          <p className={`${REVEAL.up} mt-8 ${BODY}`}>{MD_CLOSE.text}</p>

          {/* The related-event row lives inside this section rather than in one
              of its own — small closing aside, not another chapter. Sits between
              the statement and the tags so the tags stay the article's last
              word. */}
          <MelodyContinue />
        </div>

        {/* Tags — the article's own 20, preserved. Presentational only: there
            are no tag archive routes on this site, so they are not links. */}
        <ul className={`${REVEAL.up} mx-auto mt-14 flex max-w-4xl flex-wrap justify-center gap-2.5 sm:mt-16`}>
          {MD_TAGS.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-white/[0.10] bg-white/[0.03] px-4 py-2 font-[family-name:var(--font-urbanist)] text-[12px] font-medium text-neutral-400"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

"use client";

import { useCallback, useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import AnnouncementBar from "./AnnouncementBar";
import Navbar from "./Navbar";
import VolumeControl, {
  DEFAULT_VOLUME,
  type AudioSettings,
} from "./VolumeControl";
import { useHeroReveal } from "@/src/hooks/useHeroReveal";
import { navigateTo } from "@/src/lib/nav";
import { HERO_TAGLINE } from "@/src/lib/typography";
import {
  HERO_CTA,
  HERO_TAGLINE_TEXT,
  HERO_VIDEO,
  VOLUME_DELAY,
} from "./constants";

/**
 * Homepage hero — a five-stage cinematic open, not a conventional banner.
 *
 *   1. Video alone.        Nothing else is on screen — no tagline, no CTA.
 *   2. Scrolling pins the hero (see useHeroReveal / ScrollTrigger).
 *   3. The tagline rises out of a blur as the scroll advances.
 *   4. The CTA follows a beat later, then picks up a slow float.
 *   5. The pin releases and the page continues into the next section.
 *
 * Scrolling back up runs 4 → 1 exactly in reverse, because the timeline is
 * *scrubbed*: scroll position is the playhead, so the copy sinks back down,
 * re-blurs and fades out along the same curve it came in on, and is fully gone
 * before the hero unpins. See useHeroReveal for why that is a scrub rather than
 * a play/reverse pair.
 *
 * Stages 2–5 are GSAP's job, not Framer's: they are driven by scroll position
 * and have to *pin the page* while they run. Framer stays in charge of things
 * that really are mount animations — the volume control's entrance, and
 * everything in Navbar/AnnouncementBar.
 *
 * Three things are load-bearing and easy to undo by accident:
 *
 * • **The nav sits above the film, not on it.** The ribbon and navbar are in
 *   normal flow on the hero's own dark surface, and the film takes the rest of
 *   the viewport (`flex-1`) — so the nav never overlaps the footage and needs no
 *   scrim of its own. The section as a whole is still exactly one viewport tall,
 *   which is what keeps that arithmetic free of magic numbers at any height.
 *
 * • **The overlay stays light.** A flat ~32% wash and nothing more. Legibility
 *   over bright frames is bought by the tagline's own text-shadow (see
 *   HERO_TAGLINE), not by darkening the film — pushing the scrim much past this
 *   is what makes a hero video start to look like a placeholder.
 *
 * • **The copy sits just below centre** — horizontally centred, with its
 *   midpoint at 57% of the *viewport*. Not dead centre, and not an edge anchor:
 *   the slight drop leaves the larger share of the frame to the footage above
 *   it, which is what keeps the video reading as the subject and the type as a
 *   caption on it. It is a sibling of the film stage rather than a child so
 *   that 57% measures against the whole hero — see the comment at the block
 *   itself for why nesting it changes the number.
 *
 * `#hero-nav-sentinel` still rides directly under the navbar as the marker for
 * the global FloatingNav, which reads it as the hero's nav anchor (see
 * FloatingNav for when the pill actually appears).
 *
 * All the GSAP-driven motion is opacity/transform/filter — compositor work, so
 * it holds 60fps — and nothing but the CTA's float repeats. Under reduced
 * motion there is no pin and no scrub at all: the tagline and CTA simply render
 * in their settled state from the first frame (see useHeroReveal).
 */
export default function Hero() {
  const reduce = useReducedMotion() ?? false;
  const router = useRouter();
  const pathname = usePathname();
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const taglineRef = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const ctaFloatRef = useRef<HTMLDivElement>(null);

  useHeroReveal({
    section: sectionRef,
    tagline: taglineRef,
    cta: ctaRef,
    ctaFloat: ctaFloatRef,
    reduce,
  });

  // The `autoPlay` attribute alone is not reliable: React sets `muted` as an
  // attribute, and some browsers evaluate the autoplay policy against the
  // *property* before that attribute is applied — the video then silently sits
  // on its first frame. Setting the property and kicking playback ourselves
  // makes it deterministic. If the policy still refuses (iOS Low Power Mode,
  // say), the rejection is expected, not an error: the frame stays as a still.
  // The pinned reveal never touches this element, so playback is continuous
  // through every stage — pinned or not, revealed or not.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    void video.play().catch(() => {});
  }, []);

  // Audio state. Hero owns the <video>, so Hero owns every write to it;
  // VolumeControl is a pure control that reports what the visitor asked for.
  // Held in a ref rather than state because nothing here renders from it — a
  // slider drag must not re-render the hero once per frame.
  const audio = useRef<AudioSettings>({ muted: true, volume: DEFAULT_VOLUME });

  const handleAudioChange = useCallback((next: AudioSettings) => {
    audio.current = next;
    const video = videoRef.current;
    if (!video) return;
    video.volume = next.volume;
    video.muted = next.muted;
  }, []);

  // Sound never outlives the hero: the film is muted the moment it leaves the
  // viewport and the visitor's choice is restored when it comes back. Audio
  // continuing while someone reads the footer is the single most annoying thing
  // a hero video can do. This only ever *restores* a choice already made — it
  // cannot turn sound on by itself. Reading `audio.current` inside the callback
  // (rather than depending on it) is what keeps the observer subscribed once.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !("IntersectionObserver" in window)) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        video.muted = entry.isIntersecting ? audio.current.muted : true;
      },
      { threshold: 0 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    // Exactly one viewport tall, laid out as a column: the nav chrome takes its
    // natural height and the film absorbs whatever is left. `svh` rather than
    // `vh` so mobile browsers size it to the *stable* viewport and the hero
    // doesn't resize as the URL bar collapses.
    <header
      ref={sectionRef}
      id="top"
      className="relative flex h-[100svh] w-full flex-col overflow-hidden bg-[#0B0B0B] text-white"
    >
      {/* Nav chrome — in flow above the film, on the hero's dark surface, and
          unchanged. `shrink-0` so it always keeps its full height and it is the
          film, never the nav, that gives way on short viewports. */}
      <div className="relative z-30 shrink-0">
        <AnnouncementBar />
        <Navbar />
        <div id="hero-nav-sentinel" aria-hidden="true" className="h-0 w-full" />
      </div>

      {/* The film stage — everything below the nav, and the box useHeroReveal
          pins. `min-h-0` lets it actually shrink inside the flex column instead
          of forcing the header taller than the viewport; `overflow-hidden`
          clips the film's overscanning axis. */}
      <div className="relative min-h-0 flex-1 overflow-hidden">
        {/* Layer 0 — the film, Stage 1's entire content. Absolutely positioned
            and object-cover, so it fills the stage on both axes at any aspect
            ratio with no letterboxing. `preload="auto"` because this is the
            page's hero visual: it has to be already playing by the time the
            visitor's first scroll triggers Stage 3. */}
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-label={HERO_VIDEO.alt}
        >
          <source src={HERO_VIDEO.src} type={HERO_VIDEO.type} />
        </video>

        {/* Layer 1 — readability only. A flat ~32% wash; nothing gradients or
            vignettes on top of it, so it reads evenly behind dead-centre type
            rather than being heavier at one edge. */}
        <div aria-hidden="true" className="absolute inset-0 bg-black/[0.32]" />

        {/* Sound — a utility, not part of the narrative, so it belongs to
            Stage 1 and fades in on its own short mount delay rather than
            waiting on the scroll-gated reveal. */}
        <VolumeControl
          onChange={handleAudioChange}
          delay={VOLUME_DELAY}
          reduce={reduce}
        />
      </div>

      {/* The copy: Stages 3–4, revealed by useHeroReveal.
          Horizontally centred; vertically its midpoint sits at 67% of the
          *viewport* — the lower-middle third, editorial rather than centred.
          That leaves the top two-thirds of the frame entirely to the footage,
          which is what keeps the video reading as the subject and the type as a
          caption surfacing out of it.
          It is a sibling of the film stage rather than a child of it so that
          67% is measured against the whole hero. Nested inside the stage the
          same percentage lands far lower, because the stage starts below the
          nav — measurably outside the intended band.
          `z-20` keeps it under the nav's `z-30`: on a viewport short enough for
          the two to meet (a landscape phone with the ribbon open) the nav wins
          rather than the two overlapping illegibly. The hero's own
          `overflow-hidden` clips the 120px rise, so the type enters from
          beneath the frame rather than from empty space inside it. */}
      <div className="absolute inset-x-0 top-[67%] z-20 -translate-y-1/2 px-6">
        <div className="flex flex-col items-center text-center">
          <h1 ref={taglineRef} className={HERO_TAGLINE}>
            {HERO_TAGLINE_TEXT}
          </h1>

          {/* Two nested nodes, not one: the outer carries the scrubbed
              entrance (opacity / y / blur), the inner carries only the idle
              float. Both animate `y`, and a scrub-driven transform cannot share
              a node with an infinite tween — they would overwrite each other
              every frame. See useHeroReveal. */}
          <div ref={ctaRef} className="mt-8 sm:mt-10">
            <div ref={ctaFloatRef}>
              {/* An understated text link, not a button: a short underline
                  that widens on hover and an arrow that slides with it, on one
                  shared curve — matching the reference's "Learn More" rather
                  than the site's filled/outlined button language, which would
                  read as a second call to action next to Register. */}
              <a
                href={HERO_CTA.href}
                onClick={(e) =>
                  navigateTo(e, HERO_CTA.href, router, pathname, reduce)
                }
                data-cursor="button"
                className="group inline-flex items-center gap-2.5 text-white outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                <span className="relative pb-1 text-[11px] font-medium uppercase tracking-[0.22em] sm:text-[12px]">
                  {HERO_CTA.label}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-75 bg-white/55 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:scale-x-100 group-hover:bg-white"
                  />
                </span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="h-3.5 w-3.5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:translate-x-1.5"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

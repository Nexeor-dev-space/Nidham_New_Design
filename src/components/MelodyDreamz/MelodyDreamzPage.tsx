"use client";

import { useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { useEditorialReveal } from "@/src/hooks/useEditorialReveal";
import MelodyComments from "./MelodyComments";
import MelodyGallery from "./MelodyGallery";
import MelodyHero from "./MelodyHero";
import SectionProgress from "./SectionProgress";
import {
  MelodyClose,
  MelodyFilm,
  MelodyHighlights,
  MelodyOverview,
  MelodyQuote,
  MelodyStory,
} from "./MelodySections";

/**
 * The Melody Dreamz case study — one page, no separate Album route.
 *
 * A client component wrapper exists so the whole article shares **one**
 * `useEditorialReveal` scope. The alternative — a hook per section — would create
 * seven GSAP contexts and seven selector sweeps for one page, and would make the
 * reveal grammar drift between sections over time. One scope, one grammar; each
 * section opts in with the `r-*` classes.
 *
 * Section order mirrors the page it replaces (hero → open → film → platform →
 * quote → highlights → gallery → close → tags), re-cut so the rhythm alternates
 * rather than running as one column:
 *
 *   hero        fullscreen film, copy blurs up once playback starts
 *   overview    the highlights intro + statistics as glass cards
 *   story       the two narrative blocks, image left / image right
 *   film        the event film, click-to-play (never autoplays)
 *   gallery     the merged Album — masonry + lightbox
 *   highlights  the three highlights as numbered glass cards
 *   quote       the sentence the article already made its centre
 *   close       the closing paragraph, the "Continue Exploring" row, 20 tags
 *   comments    the comment form
 *
 * "Continue Exploring" is *inside* `close`, not a band of its own — see
 * `MelodyContinue`. It was briefly a full-width section here and read as another
 * chapter rather than a pointer away from the page.
 *
 * Lenis already runs site-wide from the root layout, so every in-page jump here
 * (the hero buttons, the progress rail) inherits the site's smooth scrolling
 * through `scrollToId` — nothing extra is mounted for it.
 */
export default function MelodyDreamzPage() {
  const reduce = useReducedMotion() ?? false;
  const scopeRef = useRef<HTMLDivElement>(null);

  useEditorialReveal(scopeRef, reduce);

  return (
    // `rail-inset` reserves the left gutter for SectionProgress at lg+ — the
    // rail is fixed and `.container-page` has no max-width, so without it the
    // panel sits on top of every left-hand column on the page.
    <div ref={scopeRef} className="rail-inset">
      <MelodyHero />
      <SectionProgress />
      <MelodyOverview />
      <MelodyStory />
      <MelodyFilm />
      <MelodyGallery />
      <MelodyHighlights />
      <MelodyQuote />
      <MelodyClose />
      <MelodyComments />
    </div>
  );
}

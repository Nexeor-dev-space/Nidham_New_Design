"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Magnetic from "@/src/components/CustomCursor/Magnetic";
import {
  ABOUT_BUTTON_LINK,
  ABOUT_BUTTON_TEXT,
  ABOUT_MEDIA,
  ABOUT_PARAGRAPHS,
  ABOUT_STATS,
  ABOUT_SUBTITLE,
  ABOUT_TITLE_LINES,
} from "./constants";
import type { AboutSectionProps } from "./types";
import { SECTION_HEADING, SECTION_HEADING_GAP } from "@/src/lib/typography";
import SectionDivider from "@/src/components/ui/SectionDivider";
import { ST_START, gsapEntranceDefaults } from "@/src/lib/motion";
import { BUTTON_SKIN } from "@/src/lib/button";

gsap.registerPlugin(ScrollTrigger);

/**
 * The brand-story section — a single centred column that the reader descends
 * through, rather than a two-column information block.
 *
 * The layout is deliberately one axis: divider → statement headline → rule →
 * showreel → copy → figures → CTA. Everything is centre-aligned except the
 * body copy's measure, which is capped near 672px because centred prose wider
 * than that stops being readable — the eye loses the start of the next line.
 * The video is never placed beside the text: it is the centrepiece, and putting
 * copy alongside it would halve its width and turn the section back into the
 * two-column card it replaced.
 *
 * Motion (GSAP + ScrollTrigger, one timeline, GPU transforms only):
 *   headline reveals line by line → the video fades up from 0.94 → 1 → copy
 *   follows → figures rise and count from zero → CTA lands. The divider above
 *   the headline runs its own reveal (see SectionDivider), not this timeline.
 * Timings come from the shared motion tokens so this reads as the same
 * choreography as the hero above and the services below.
 *
 * Two separate wrappers carry the video's motion — `videoRevealRef` owns the
 * entrance (opacity + scale) and `videoFloatRef` owns the endless float (y).
 * They must stay separate: one element cannot hold a one-shot tween and an
 * infinite yoyo on overlapping properties without the two fighting for the
 * transform.
 *
 * Reduced motion: the timeline is skipped entirely and nothing is pre-hidden,
 * so the section renders in its natural, fully-visible state — which is also
 * what SSR and a no-JS client get. The counters follow the same rule (see the
 * note on them below), and the video never plays.
 */
export default function AboutSection({
  subtitle = ABOUT_SUBTITLE,
  titleLines = ABOUT_TITLE_LINES,
  paragraphs = ABOUT_PARAGRAPHS,
  stats = ABOUT_STATS,
  buttonText = ABOUT_BUTTON_TEXT,
  buttonLink = ABOUT_BUTTON_LINK,
  media = ABOUT_MEDIA,
}: AboutSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRevealRef = useRef<HTMLDivElement>(null);
  const videoFloatRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Latches true the first time the section nears the viewport; gates `src`.
  const [near, setNear] = useState(false);

  /**
   * Stand-in for the `loading="lazy"` an <img> would carry — this is a multi-MB
   * file sitting well below a hero that already ships its own video, so it must
   * not compete for bandwidth on first paint.
   *
   * The `src` is withheld until the section is near rather than relying on
   * `preload="metadata"`: preload is only a hint, and Chrome was observed
   * buffering the whole file at page load regardless. Withholding `src` is the
   * only thing that reliably defers the fetch. `rootMargin` starts it a screen
   * early so it is ready by the time it is actually on screen.
   */
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    // Latch only — never un-latch. The showreel is scrubbed by scroll (below),
    // so there is nothing to pause when it leaves: the frame on screen is a
    // function of scroll position, not of a running clock.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setNear(true);
      },
      { rootMargin: "100% 0px", threshold: 0 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  /**
   * Scroll-scrubbed playback: the showreel advances as the section scrolls up
   * the viewport and rewinds as it scrolls back down, rather than running on
   * its own clock.
   *
   * This also removes a bug the autoplay version had. That one paused the
   * element whenever it left the observer's range but only ever called `play()`
   * in an effect keyed to `near` — and `near` latches true and never changes
   * again. So the first time you scrolled past the section and came back, the
   * effect did not re-run, nothing resumed it, and the showreel sat frozen on
   * whatever frame it had reached. Scrubbing has no play/pause state at all, so
   * the failure mode does not exist.
   *
   * Mechanics worth knowing:
   *
   * • `duration` is only known after metadata loads, and `readyState` may
   *   already satisfy that by the time this runs (the browser can have the
   *   header cached), so both paths have to be handled or the trigger is never
   *   built.
   *
   * • The tween drives a plain proxy object, not the element. Seeking is the
   *   expensive part, and writing `currentTime` on every scrub frame queues
   *   seeks faster than the decoder retires them; skipping while `seeking` is
   *   true keeps it to one in flight and is what stops the stutter.
   *
   * • Reduced motion opts out entirely and leaves the first frame showing —
   *   a still, which is the honest reduced-motion answer for decorative footage.
   */
  useEffect(() => {
    const el = videoRef.current;
    const section = sectionRef.current;
    if (!el || !section || !near) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ctx: gsap.Context | null = null;

    const build = () => {
      const duration = el.duration;
      if (!duration || !Number.isFinite(duration)) return;

      // Nothing should be advancing it but the scroll.
      el.pause();

      ctx = gsap.context(() => {
        const playhead = { t: 0 };

        gsap.to(playhead, {
          t: duration,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
          onUpdate: () => {
            if (!el.seeking) el.currentTime = playhead.t;
          },
        });
      }, section);
    };

    if (el.readyState >= 1) {
      build();
    } else {
      el.addEventListener("loadedmetadata", build, { once: true });
    }

    return () => {
      el.removeEventListener("loadedmetadata", build);
      ctx?.revert();
    };
  }, [near]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          isMobile: "(max-width: 767px)",
          isTablet: "(min-width: 768px) and (max-width: 1023px)",
          isDesktop: "(min-width: 1024px)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (mmCtx) => {
          const { isMobile, isTablet, reduce } = mmCtx.conditions as {
            isMobile: boolean;
            isTablet: boolean;
            isDesktop: boolean;
            reduce: boolean;
          };

          // Respect the OS preference — leave everything in its natural,
          // fully-visible state. No fromTo pre-hiding runs, and the counters
          // keep the final values React already rendered.
          if (reduce) return;

          const factor = isMobile ? 0.6 : isTablet ? 0.8 : 1;
          const q = gsap.utils.selector(section);
          const lineEls = q(".about-line");
          const statEls = q(".about-stat");
          const countEls = q<HTMLElement>(".about-count");

          // The markup renders each counter's *final* value, so SSR, no-JS and
          // reduced motion are all correct without this effect. Zero them here,
          // on mount and well before the trigger fires, rather than inside the
          // timeline — a tl.set() would only run on scroll-in, and a reader
          // arriving slowly would watch the real number blink back to zero.
          const targets = countEls.map((el) => Number(el.dataset.value ?? 0));
          countEls.forEach((el) => {
            el.textContent = "0";
          });

          const tl = gsap.timeline({
            defaults: { ...gsapEntranceDefaults, duration: 0.9 },
            scrollTrigger: { trigger: section, start: ST_START, once: true },
          });

          // The divider runs its own self-contained reveal (see SectionDivider),
          // so this timeline opens on the headline. Its own entrance is what
          // gives the section its first beat.
          tl.fromTo(
            lineEls,
            { autoAlpha: 0, y: 34 * factor, filter: "blur(14px)" },
            {
              autoAlpha: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 1,
              stagger: 0.12,
            },
            0.1,
          )
            // The centrepiece — settles from 0.94 rather than the site's usual
            // 1.05 image reveal: growing into place reads as arrival, where
            // shrinking into place reads as a photo settling.
            .fromTo(
              videoRevealRef.current,
              { autoAlpha: 0, scale: 0.94, y: 30 * factor },
              { autoAlpha: 1, scale: 1, y: 0, duration: 1.3 },
              "-=0.5",
            )
            .fromTo(
              copyRef.current,
              { autoAlpha: 0, y: 26 * factor },
              { autoAlpha: 1, y: 0, duration: 0.9 },
              "-=0.7",
            )
            .fromTo(
              statEls,
              { autoAlpha: 0, y: 24 * factor },
              { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1 },
              "-=0.5",
            );

          // Count-up, riding alongside the figures' rise. A per-counter proxy
          // object is tweened and written out on update — tweening textContent
          // directly is not a thing GSAP can interpolate.
          countEls.forEach((el, i) => {
            const target = targets[i];
            if (!Number.isFinite(target) || target <= 0) return;
            const proxy = { v: 0 };
            tl.to(
              proxy,
              {
                v: target,
                duration: 1.2,
                ease: "power2.out",
                onUpdate: () => {
                  el.textContent = String(Math.round(proxy.v));
                },
              },
              "-=0.7",
            );
          });

          tl.fromTo(
            ctaRef.current,
            { autoAlpha: 0, y: 20 * factor, scale: 0.96 },
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.8 },
            "-=0.6",
          );

          // Endless, barely-there float. Runs on its own wrapper so it never
          // contends with the entrance tween above for the transform.
          const float = gsap.to(videoFloatRef.current, {
            y: -14,
            duration: 4.5,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });

          // ----- Scroll-linked drift on the lower block ---------------------
          // The entrance above fires once and then the copy, figures and CTA sit
          // completely still for the rest of the scroll — which is what makes
          // this half of the section read as flat. These give each row its own
          // travel rate so the block keeps breathing as it crosses the viewport.
          //
          // Deliberately tiny and *decreasing* down the stack (18 → 12 → 8px):
          // a uniform offset would just look like the whole block sliding. The
          // differential is what reads as depth.
          //
          // `y` is safe to scrub here even though the entrance also animates it:
          // the entrance runs `once: true` and has fully settled at `y: 0` long
          // before these triggers engage, and each `fromTo` below pins its own
          // start value so nothing rebases mid-flight.
          const driftTargets: Array<[gsap.TweenTarget, number]> = [
            [copyRef.current, 18 * factor],
            [statEls, 12 * factor],
            [ctaRef.current, 8 * factor],
          ];

          driftTargets.forEach(([target, distance]) => {
            if (!target) return;
            gsap.fromTo(
              target,
              { y: distance },
              {
                y: -distance,
                ease: "none",
                scrollTrigger: {
                  trigger: section,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                  invalidateOnRefresh: true,
                },
              },
            );
          });

          return () => float.kill();
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="about-heading"
      data-particles="about"
      // `#201D1A` rather than the `#1F1F1F` used by most sections: Partners sits
      // directly above and WhyChooseUs directly below, both on `#1F1F1F`, so an
      // identical value made this section merge into its neighbours instead of
      // reading as its own band. The warm near-black also leans toward the
      // footer's `#5b1c3a`.
      className="relative isolate w-full overflow-hidden bg-[#201D1A] section-y"
    >
      {/* Ambient light — two very soft washes in the brand magenta and a warm
          gold, at 5–7%. Painted as gradients rather than blurred elements: no
          filter, no extra layer, no circular edge to catch the eye. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_45%_at_50%_8%,rgba(110,27,69,0.10),transparent_70%),radial-gradient(55%_45%_at_15%_65%,rgba(199,154,46,0.05),transparent_72%),radial-gradient(50%_40%_at_88%_82%,rgba(110,27,69,0.07),transparent_72%)]"
      />

      <div className="container-page">
        {/* Full container width, matching every other section's divider — the
            centred `max-w-[1200px]` column below is for the About content
            only, and must not clip this too. */}
        <SectionDivider label={subtitle} />

        <div className="mx-auto flex max-w-[1200px] flex-col items-center">
          {/* Statement headline, on the shared section-heading scale so it sits
              at the same size as every other <h2> on the site.

              Each authored line gets its own overflow-hidden row so the
              blur-and-rise is clipped to that line rather than bleeding into
              its neighbour. The row padding gives the descenders in
              "Technology" and "Converge." room to clear that clip. */}
          <h2
            id="about-heading"
            className={`${SECTION_HEADING_GAP} ${SECTION_HEADING}`}
          >
            {titleLines.map((line) => (
              <span key={line} className="block overflow-hidden pb-[0.08em]">
                <span className="about-line block will-change-[transform,filter]">
                  {line}
                </span>
              </span>
            ))}
          </h2>

          {/* Centrepiece showreel */}
          <div
            ref={videoRevealRef}
            className="relative mt-12 w-full will-change-[transform,opacity] sm:mt-16"
          >
            <div ref={videoFloatRef} className="relative will-change-transform">
              {/* Ambient glow behind the frame. Inset so it reads as light
                  spilling from the footage rather than as a visible halo, and
                  blurred well past the frame's own corners. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-x-6 -bottom-10 -top-6 -z-10 rounded-[48px] bg-[radial-gradient(60%_60%_at_30%_20%,rgba(110,27,69,0.55),transparent_70%),radial-gradient(55%_55%_at_75%_85%,rgba(199,154,46,0.30),transparent_70%)] blur-[60px]"
              />

              <div
                data-cursor="video"
                className="group relative aspect-[16/10] w-full overflow-hidden rounded-[32px] bg-neutral-900 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.75)] sm:aspect-[16/9]"
              >
                <video
                  ref={videoRef}
                  // Withheld until near — see the IntersectionObserver above.
                  src={near ? media.src : undefined}
                  aria-label={media.alt}
                  muted
                  playsInline
                  // `auto`, not `metadata`: playback is seek-driven, and seeking
                  // into an unbuffered region is what makes a scrubbed video
                  // stutter. The `src` is still withheld until the section is
                  // near, so this costs nothing on first paint.
                  preload="auto"
                  // No `loop`: there is no clock to wrap around. The playhead is
                  // the scroll position, which the timeline already bounds.
                  className="h-full w-full object-cover contrast-[1.04] saturate-[1.03]"
                />
                {/* Very subtle vignette for depth. */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 [box-shadow:inset_0_0_130px_rgba(0,0,0,0.28)]"
                />
                {/* Gentle hover lighting. */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(255,255,255,0.14),transparent_60%)] opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
                />
              </div>
            </div>
          </div>

          {/* Intro copy — the one element with its own measure. */}
          <div
            ref={copyRef}
            className="mt-8 flex max-w-[42rem] flex-col gap-6 text-center sm:mt-10"
          >
            {paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="font-[family-name:var(--font-urbanist)] text-[17px] font-light leading-[1.8] text-neutral-400 sm:text-[19px]"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Figures */}
          <ul className="mt-10 grid w-full max-w-3xl grid-cols-1 gap-12 sm:mt-12 sm:grid-cols-3 sm:gap-8">
            {stats.map((stat) => {
              const shown =
                stat.value !== null
                  ? `${stat.value}${stat.suffix ?? ""}`
                  : (stat.display ?? "");
              return (
                <li
                  key={stat.label}
                  className="about-stat flex flex-col items-center text-center"
                >
                  {/* The visible figure is hidden from assistive tech because
                      its text is rewritten frame by frame while counting; the
                      sr-only line carries the settled value instead. */}
                  <p
                    aria-hidden="true"
                    className="font-[family-name:var(--font-cabinet)] text-[clamp(2.25rem,4.4vw,3.25rem)] font-normal leading-none tracking-[-0.02em] text-neutral-100"
                  >
                    {stat.value !== null ? (
                      <>
                        <span
                          className="about-count"
                          data-value={String(stat.value)}
                        >
                          {stat.value}
                        </span>
                        {stat.suffix}
                      </>
                    ) : (
                      stat.display
                    )}
                  </p>
                  <p
                    aria-hidden="true"
                    className="mt-4 font-[family-name:var(--font-urbanist)] text-[13px] font-medium uppercase tracking-[0.18em] text-neutral-500"
                  >
                    {stat.label}
                  </p>
                  <span className="sr-only">{`${shown} — ${stat.label}`}</span>
                </li>
              );
            })}
          </ul>

          {/* CTA */}
          <div ref={ctaRef} className="mt-10 w-full sm:mt-12 sm:w-auto">
            <Magnetic className="block w-full sm:inline-block sm:w-auto">
              <Link
                href={buttonLink}
                data-cursor="button"
                className={`group inline-flex w-full items-center justify-center gap-3 rounded-[16px] px-8 py-4 text-[13px] font-medium uppercase tracking-[0.14em] outline-none active:translate-y-0 active:scale-[0.99] motion-safe:hover:-translate-y-0.5 sm:w-auto sm:px-10 sm:py-5 ${BUTTON_SKIN}`}
              >
                {buttonText}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1"
                >
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}

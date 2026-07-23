"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Service } from "./types";
import { GSAP_EASE } from "@/src/lib/motion";

gsap.registerPlugin(ScrollTrigger);

interface ServiceChapterProps {
  service: Service;
  /** Position in the list (0-based) — drives the alternating split + numbering. */
  index: number;
  /** Explore affordance handler (smooth-scrolls to the footer contact block). */
  onOpen: (event: MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * One full-height "chapter" in the editorial services story — no card, no box,
 * no grid. A composition of a large ghosted section number, a massive Cabinet
 * title, verbatim Urbanist body copy, and a single cinematic visual that bleeds
 * slightly past its container with rounded corners, a soft floating drift and a
 * slow Ken Burns zoom. The visual itself is the affordance — clicking it
 * smooth-scrolls to the footer contact block (see `onOpen`).
 *
 * Layout alternates by index — even chapters put the text left / media right,
 * odd chapters flip it — so no two blocks repeat. On mobile it collapses to one
 * column with the media first, then title and description.
 *
 * Motion is entirely scroll-driven (GSAP + ScrollTrigger, GPU transforms +
 * opacity + clip-path only) — it never relies on hover to reveal content:
 *  - As the chapter enters: the media clip-reveals + settles 1.06 → 1.0, the
 *    number fades in, the title reveals upward (masked), then the description
 *    fades — all staggered on the signature ease.
 *  - A scrubbed parallax drifts the media slower than the page (no hard cut).
 *  - A gentle leave-scrub fades + lifts the previous chapter as the next rises.
 * Everything is skipped under prefers-reduced-motion (content stays visible).
 */
export default function ServiceChapter({
  service,
  index,
  onOpen,
}: ServiceChapterProps) {
  const { title, description, note, index: ordinal, image, imageAlt } = service;
  const rootRef = useRef<HTMLElement>(null);

  // Even chapters: text left, media right. Odd: media left, text right.
  // Media is always the first DOM child, so on mobile it naturally leads.
  const mediaRight = index % 2 === 0;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

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
            reduce: boolean;
          };
          // Under reduced motion, leave everything in its natural, visible
          // state — no pre-hiding, no parallax, no scrubbed fades.
          if (reduce) return;

          const factor = isMobile ? 0.6 : isTablet ? 0.82 : 1;
          const q = gsap.utils.selector(root);
          const numberEl = q(".chapter-number");
          const titleInner = q(".chapter-title-inner");
          const descEl = q(".chapter-desc");
          const mediaEl = q(".chapter-media");
          const parallaxEl = q(".chapter-parallax");
          const dividerEl = q(".chapter-divider");

          // ----- Entrance (once) -------------------------------------------
          const tl = gsap.timeline({
            defaults: { ease: GSAP_EASE, force3D: true },
            scrollTrigger: { trigger: root, start: "top 72%", once: true },
          });

          if (dividerEl.length) {
            tl.fromTo(
              dividerEl,
              { scaleX: 0, autoAlpha: 0 },
              { scaleX: 1, autoAlpha: 1, duration: 1.1, ease: "power2.out" },
              0,
            );
          }

          // Media reveal — clip-path wipe + settle, simultaneous with number.
          tl.fromTo(
            mediaEl,
            {
              autoAlpha: 0,
              y: 40 * factor,
              scale: 1.06,
              clipPath: "inset(0% 0% 100% 0%)",
            },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.4,
              ease: "power2.out",
            },
            0,
          );

          // Number — fades in first.
          tl.fromTo(
            numberEl,
            { autoAlpha: 0, y: 28 * factor, filter: "blur(10px)" },
            { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.8 },
            0.05,
          );

          // Title — masked reveal upward, second.
          tl.fromTo(
            titleInner,
            { yPercent: 115 },
            { yPercent: 0, duration: 1, ease: "power4.out" },
            0.2,
          );

          // Description — fades, third.
          tl.fromTo(
            descEl,
            { autoAlpha: 0, y: 24 * factor },
            { autoAlpha: 1, y: 0, duration: 0.8 },
            0.42,
          );

          // ----- Media parallax (scrub) ------------------------------------
          const drift = 6 * factor; // % of the oversized parallax wrapper
          gsap.fromTo(
            parallaxEl,
            { yPercent: -drift },
            {
              yPercent: drift,
              ease: "none",
              scrollTrigger: {
                trigger: root,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );

          // ----- Leave (scrub) — previous chapter gently fades + lifts -----
          const contentEl = q(".chapter-inner");
          gsap.fromTo(
            contentEl,
            { autoAlpha: 1, y: 0, scale: 1 },
            {
              autoAlpha: 0.5,
              y: -50 * factor,
              scale: 0.985,
              ease: "none",
              scrollTrigger: {
                trigger: root,
                start: "bottom 65%",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        },
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      aria-labelledby={`service-${service.id}-title`}
      className="relative flex min-h-[82vh] w-full items-center py-20 sm:py-24 lg:min-h-[90vh] lg:py-28"
    >
      {/* Elegant divider — a glowing hairline that separates this chapter from
          the one above. Omitted on the first chapter (index 0). */}
      {index > 0 && (
        <span
          aria-hidden="true"
          className="chapter-divider pointer-events-none absolute inset-x-0 top-0 flex items-center justify-center"
        >
          <span className="h-px w-full max-w-[min(90%,72rem)] origin-center bg-[linear-gradient(90deg,transparent_0%,rgba(166,56,107,0.55)_50%,transparent_100%)] shadow-[0_0_18px_rgba(166,56,107,0.35)]" />
        </span>
      )}

      <div className="container-page chapter-inner will-change-[transform,opacity]">
        <div
          className={`flex flex-col gap-10 sm:gap-12 lg:items-center lg:gap-16 xl:gap-24 ${
            mediaRight ? "lg:flex-row-reverse" : "lg:flex-row"
          }`}
        >
          {/* ---------- Media (first DOM child → leads on mobile) ----------
              Larger than its column and bleeding a little past the outer gutter
              (and slightly top/bottom) so the visual breaks the grid rather than
              sitting in a neat box. */}
          <div
            className={`w-full lg:w-[56%] lg:-my-4 xl:-my-6 ${
              mediaRight
                ? "lg:-mr-6 xl:-mr-12 2xl:-mr-20"
                : "lg:-ml-6 xl:-ml-12 2xl:-ml-20"
            }`}
          >
            <a
              href="#contact"
              onClick={onOpen}
              data-cursor="image"
              aria-label={`${title} — explore`}
              className="chapter-media group/media relative block aspect-[5/4] w-full overflow-hidden rounded-[26px] shadow-[0_40px_90px_-40px_rgba(0,0,0,0.85)] outline-none transition-shadow duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform hover:shadow-[0_55px_120px_-38px_rgba(0,0,0,0.9)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A6386B] sm:aspect-[4/3] lg:aspect-[4/3]"
            >
              {/* Floating drift wraps the parallax wrapper wraps the Ken Burns
                  image — three independent, layered motions. */}
              <span className="chapter-float absolute inset-0 block">
                <span className="chapter-parallax absolute inset-x-0 -top-[8%] block h-[116%] will-change-transform">
                  <Image
                    src={image}
                    alt={imageAlt}
                    fill
                    quality={90}
                    sizes="(min-width: 1024px) 56vw, 100vw"
                    className="chapter-kenburns object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/media:scale-[1.04]"
                    style={{ animationDelay: `${index * -3}s` }}
                    priority={index === 0}
                  />
                </span>
              </span>

              {/* Cinematic grade — a soft vignette + magenta spotlight lift so
                  no visual ever reads as flat. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,transparent_35%,rgba(0,0,0,0.35)_100%)]"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_30%_20%,rgba(166,56,107,0.16)_0%,transparent_60%)] mix-blend-screen"
              />
            </a>
          </div>

          {/* ---------- Text ---------- */}
          <div className="w-full lg:w-[44%]">
            {/* Large ghosted section number. */}
            <p
              aria-hidden="true"
              className="chapter-number font-[family-name:var(--font-cabinet)] text-[clamp(3.5rem,8vw,7rem)] font-normal leading-none tracking-[-0.03em] text-transparent [-webkit-text-stroke:1px_rgba(248,216,61,0.55)] will-change-[transform,opacity,filter]"
            >
              {ordinal}
            </p>

            {/* Massive title — masked line reveal upward. */}
            <h2
              id={`service-${service.id}-title`}
              className="mt-5 overflow-hidden pb-[0.1em] sm:mt-6"
            >
              <span className="chapter-title-inner group/title block cursor-default font-[family-name:var(--font-cabinet)] text-[clamp(2.5rem,7vw,6.5rem)] font-normal leading-[0.95] tracking-[-0.03em] text-neutral-100 will-change-transform">
                {title}
              </span>
            </h2>

            {/* Description — Urbanist, ~20px, generous. */}
            <p className="chapter-desc mt-7 max-w-xl font-[family-name:var(--font-urbanist)] text-[20px] font-light leading-[1.7] text-neutral-300 will-change-[transform,opacity] sm:mt-8">
              {description}
            </p>

            {note && (
              <p className="chapter-desc mt-4 font-[family-name:var(--font-urbanist)] text-[13px] uppercase tracking-[0.16em] text-neutral-500 sm:text-sm">
                {note}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

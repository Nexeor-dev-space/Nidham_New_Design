"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import InfoCard from "./InfoCard";
import CountdownCard from "./CountdownCard";
import EventButton from "./EventButton";
import {
  EVENTS_ATTENDEES_TEXT,
  EVENTS_COUNTDOWN_LINK_TEXT,
  EVENTS_COUNTDOWN_TITLE,
  EVENTS_DATE,
  EVENTS_DESCRIPTION,
  EVENTS_FEATURED_LABEL,
  EVENTS_HEADING,
  EVENTS_IMAGE,
  EVENTS_IMAGE_ALT,
  EVENTS_INFO,
  EVENTS_PRIMARY_TEXT,
  EVENTS_SEATS_TEXT,
  EVENTS_SECONDARY_TEXT,
  EVENTS_SECTION_LABEL,
  EVENTS_SECTION_TITLE,
  EVENTS_STATUS_LABEL,
} from "./constants";
import type { CorporateEventsProps } from "./types";
import {
  SECTION_CONTENT_GAP,
  SECTION_HEADING,
  SECTION_HEADING_GAP,
} from "@/src/lib/typography";
import { GSAP_EASE, ST_START } from "@/src/lib/motion";

gsap.registerPlugin(ScrollTrigger);

/** Small decorative avatar stack for the social-proof row. */
const AVATARS = [
  "from-[#8a7fa3] to-[#6b5e80]",
  "from-[#c98fae] to-[#9a5c7c]",
  "from-[#7f9bc9] to-[#4d6ea3]",
];

export default function CorporateEvents({
  sectionLabel = EVENTS_SECTION_LABEL,
  sectionTitle = EVENTS_SECTION_TITLE,
  featuredLabel = EVENTS_FEATURED_LABEL,
  statusLabel = EVENTS_STATUS_LABEL,
  heading = EVENTS_HEADING,
  description = EVENTS_DESCRIPTION,
  info = EVENTS_INFO,
  primaryText = EVENTS_PRIMARY_TEXT,
  primaryLink = "#",
  secondaryText = EVENTS_SECONDARY_TEXT,
  secondaryLink = "#",
  seatsText = EVENTS_SEATS_TEXT,
  attendeesText = EVENTS_ATTENDEES_TEXT,
  image = EVENTS_IMAGE,
  imageAlt = EVENTS_IMAGE_ALT,
  eventDate = EVENTS_DATE,
  countdownTitle = EVENTS_COUNTDOWN_TITLE,
  countdownLinkText = EVENTS_COUNTDOWN_LINK_TEXT,
  countdownLink = "#",
  id,
}: CorporateEventsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLElement>(null);
  const motionRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const countdownRef = useRef<HTMLDivElement>(null);

  const headingLines = Array.isArray(heading) ? heading : [heading];
  const fullHeading = headingLines.join(" ");

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
          const { isMobile, isTablet, isDesktop, reduce } = mmCtx.conditions as {
            isMobile: boolean;
            isTablet: boolean;
            isDesktop: boolean;
            reduce: boolean;
          };

          // Reduced motion: everything stays in its natural, visible state.
          if (reduce) return;

          const factor = isMobile ? 0.6 : isTablet ? 0.8 : 1;
          const q = gsap.utils.selector(section);

          // ----- Entrance (once) -----------------------------------------
          const tl = gsap.timeline({
            defaults: { ease: GSAP_EASE, force3D: true },
            scrollTrigger: { trigger: section, start: ST_START, once: true },
          });

          tl.fromTo(
            q(".ev-eyebrow"),
            { autoAlpha: 0, y: 14, filter: "blur(8px)" },
            { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.7 },
            0,
          )
            .fromTo(
              q(".ev-title-line"),
              { yPercent: 115 },
              { yPercent: 0, duration: 0.9 },
              0.05,
            )
            // Image mask reveal + settle — simultaneous with the header.
            .fromTo(
              maskRef.current,
              { clipPath: "inset(0 0 100% 0)", scale: 1.08, autoAlpha: 0.5 },
              {
                clipPath: "inset(0 0 0% 0)",
                scale: 1,
                autoAlpha: 1,
                duration: 1.25,
              },
              0.15,
            )
            .fromTo(
              q(".ev-meta"),
              { autoAlpha: 0, y: 18 * factor },
              { autoAlpha: 1, y: 0, duration: 0.6 },
              0.3,
            )
            .fromTo(
              q(".ev-head-line"),
              { yPercent: 120 },
              { yPercent: 0, duration: 0.85, stagger: 0.09 },
              0.35,
            )
            .fromTo(
              q(".ev-desc"),
              { autoAlpha: 0, y: 22 * factor },
              { autoAlpha: 1, y: 0, duration: 0.7 },
              0.6,
            )
            .fromTo(
              q(".ev-card"),
              { autoAlpha: 0, y: 26 * factor },
              { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.1 },
              0.75,
            )
            .fromTo(
              q(".ev-actions"),
              { autoAlpha: 0, y: 20 * factor, scale: 0.97 },
              { autoAlpha: 1, y: 0, scale: 1, duration: 0.6 },
              0.95,
            )
            .fromTo(
              q(".ev-social"),
              { autoAlpha: 0, y: 18 * factor },
              { autoAlpha: 1, y: 0, duration: 0.6 },
              1.05,
            )
            .fromTo(
              countdownRef.current,
              { autoAlpha: 0, y: 42 * factor },
              { autoAlpha: 1, y: 0, duration: 0.8 },
              1.1,
            );

          // ----- Scroll parallax (scrub) — image drifts slower than page ---
          if (motionRef.current) {
            const drift = 4 * factor; // % of the oversized image height
            gsap.fromTo(
              motionRef.current,
              { yPercent: -drift },
              {
                yPercent: drift,
                ease: "none",
                scrollTrigger: {
                  trigger: section,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              },
            );
          }

          // ----- Mouse parallax (desktop only) ----------------------------
          const frame = frameRef.current;
          const layer = motionRef.current;
          if (isDesktop && frame && layer) {
            const xTo = gsap.quickTo(layer, "x", { duration: 0.6, ease: "power3.out" });
            const yTo = gsap.quickTo(layer, "y", { duration: 0.6, ease: "power3.out" });
            const onMove = (e: MouseEvent) => {
              const r = frame.getBoundingClientRect();
              const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
              const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
              xTo(dx * 18);
              yTo(dy * 18);
            };
            const onLeave = () => {
              xTo(0);
              yTo(0);
            };
            frame.addEventListener("mousemove", onMove);
            frame.addEventListener("mouseleave", onLeave);
            return () => {
              frame.removeEventListener("mousemove", onMove);
              frame.removeEventListener("mouseleave", onLeave);
            };
          }
        },
      );
    }, section);

    return () => ctx.revert();
  }, [fullHeading, description]);

  return (
    <section
      ref={sectionRef}
      id={id}
      aria-labelledby="corporate-events-title"
      className="w-full bg-[#1F1F1F] section-y"
    >
      <div className="container-page">
        {/* Header: divider with centred label. */}
        <div className="relative flex items-center justify-center">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/10"
          />
          <span className="ev-eyebrow relative bg-[#1F1F1F] px-6 text-xs font-medium uppercase tracking-[0.25em] text-neutral-400 [will-change:transform,filter]">
            (&nbsp;{sectionLabel}&nbsp;)
          </span>
        </div>

        <h2
          id="corporate-events-title"
          className={`${SECTION_HEADING_GAP} overflow-hidden pb-[0.08em] ${SECTION_HEADING}`}
        >
          <span className="ev-title-line block [will-change:transform]">
            {sectionTitle}
          </span>
        </h2>

        {/* Two-column layout — flush split, no gap or rounding. */}
        <div
          className={`${SECTION_CONTENT_GAP} grid grid-cols-1 lg:grid-cols-[48fr_52fr] lg:items-stretch`}
        >
          {/* Left — content panel. */}
          <div className="flex flex-col bg-[#2A2A2A] p-8 sm:p-10 lg:p-14 xl:p-16">
            <div className="ev-meta flex flex-wrap items-center gap-4 [will-change:transform]">
              <span className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-100">
                <span aria-hidden="true" className="h-px w-8 bg-neutral-500" />
                {featuredLabel}
              </span>
              <span className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-200">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#C79A2E]" />
                {statusLabel}
              </span>
            </div>

            <h3 className="mt-7 font-[family-name:var(--font-cabinet)] text-[clamp(2rem,3.6vw,3.5rem)] font-medium leading-[1.04] tracking-[-0.02em] text-neutral-100">
              {headingLines.map((line, i) => (
                <span key={i} className="block overflow-hidden pb-[0.06em]">
                  <span className="ev-head-line block [will-change:transform]">
                    {line}
                  </span>
                </span>
              ))}
            </h3>

            <p className="ev-desc mt-6 max-w-[32rem] text-[20px] font-light leading-relaxed text-neutral-400 [will-change:transform]">
              {description}
            </p>

            <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {info.map((item) => (
                <InfoCard key={item.id} info={item} />
              ))}
            </ul>

            <div className="ev-actions mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 [will-change:transform]">
              <EventButton href={primaryLink} variant="primary">
                {primaryText}
              </EventButton>
              <EventButton href={secondaryLink} variant="secondary">
                {secondaryText}
              </EventButton>
            </div>

            <div className="ev-social mt-auto flex items-center gap-4 pt-10 [will-change:transform]">
              <div aria-hidden="true" className="flex -space-x-3">
                {AVATARS.map((grad, i) => (
                  <span
                    key={i}
                    className={`inline-block h-9 w-9 rounded-full bg-gradient-to-br ${grad} ring-2 ring-white transition-transform duration-300 ease-out hover:-translate-y-1 hover:scale-105`}
                  />
                ))}
              </div>
              <p className="text-sm text-neutral-400">
                <span className="font-semibold text-neutral-100">{seatsText}</span>
                {" — "}
                {attendeesText}
              </p>
            </div>
          </div>

          {/* Right — event image with overlapping countdown. */}
          <figure
            ref={frameRef}
            data-cursor="image"
            className="group relative m-0 aspect-[4/5] w-full overflow-hidden bg-neutral-900 lg:aspect-auto lg:h-full lg:min-h-[560px]"
          >
            {/* Oversized layer: carries scroll + mouse parallax without gaps. */}
            <div
              ref={motionRef}
              className="absolute inset-x-0 -top-[6%] h-[112%] will-change-transform"
            >
              {/* Mask + scale entrance. */}
              <div ref={maskRef} className="relative h-full w-full [will-change:transform,clip-path]">
                {/* Hover zoom + brightness (CSS only). */}
                <div className="h-full w-full transition-[transform,filter] duration-[900ms] ease-out will-change-transform group-hover:scale-[1.08] group-hover:brightness-105">
                  <Image
                    src={image}
                    alt={imageAlt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 1024px) 100vw, 52vw"
                    quality={90}
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Centered in the frame — centering lives on this (untransformed)
                wrapper so it can't collide with the GSAP entrance `y` below. */}
            <div className="pointer-events-none absolute inset-0 flex items-end justify-center p-4 sm:p-6 lg:p-8">
              <div
                ref={countdownRef}
                className="pointer-events-auto w-full [will-change:transform] lg:w-[86%]"
              >
                <CountdownCard
                  eventDate={eventDate}
                  title={countdownTitle}
                  linkText={countdownLinkText}
                  linkHref={countdownLink}
                />
              </div>
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
}

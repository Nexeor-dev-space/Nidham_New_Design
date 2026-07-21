"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  CREATIVE_VISION_IMAGE,
  CREATIVE_VISION_IMAGE_ALT,
  CREATIVE_VISION_TITLE,
} from "./constants";
import type { CreativeVisionSectionProps } from "./types";
import { GSAP_EASE, ST_START } from "@/src/lib/motion";

gsap.registerPlugin(ScrollTrigger);

/**
 * Full-bleed "Creative Vision" banner: a background image with a centred
 * editorial heading overlaid, exactly as composed in the Figma. Optional label,
 * description and CTA are supported for reuse but omitted by default.
 *
 * Motion (GSAP + ScrollTrigger, GPU transforms only):
 *  - Entrance runs once — a cinematic line-by-line heading reveal (fade + rise
 *    + blur-out, staggered), with the image fading and settling from 1.05 → 1.0
 *    simultaneously; label / paragraph / CTA join in sequence when present.
 *  - A subtle scrubbed parallax keeps the image drifting slower than the page
 *    (~40px) through and past the section — no abrupt exit.
 *  - Distances shrink on tablet/mobile and everything is skipped under
 *    prefers-reduced-motion (content stays visible by default).
 */
export default function CreativeVisionSection({
  label,
  title = CREATIVE_VISION_TITLE,
  description,
  image = CREATIVE_VISION_IMAGE,
  imageAlt = CREATIVE_VISION_IMAGE_ALT,
  buttonText,
  buttonLink = "#",
  id,
}: CreativeVisionSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const imageRevealRef = useRef<HTMLDivElement>(null);

  const lines = Array.isArray(title) ? title : [title];
  const fullTitle = lines.join(" ");

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
          // fully-visible state (no fromTo pre-hiding runs).
          if (reduce) return;

          const factor = isMobile ? 0.6 : isTablet ? 0.8 : 1;
          const q = gsap.utils.selector(section);
          const lineEls = q(".cv-line");

          // ----- Entrance (once) --------------------------------------------
          const tl = gsap.timeline({
            defaults: { ease: GSAP_EASE, force3D: true },
            scrollTrigger: { trigger: section, start: ST_START, once: true },
          });

          if (labelRef.current) {
            tl.fromTo(
              labelRef.current,
              { autoAlpha: 0, y: 16 * factor, filter: "blur(8px)" },
              { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.7 },
              0,
            );
          }

          // Image reveal — simultaneous with the heading (position 0).
          if (imageRevealRef.current) {
            tl.fromTo(
              imageRevealRef.current,
              { autoAlpha: 0, scale: 1.05 },
              { autoAlpha: 1, scale: 1, duration: 1.4, ease: "power2.out" },
              0,
            );
          }

          // Heading — line-by-line: fade up 30px with a blur-out, staggered.
          tl.fromTo(
            lineEls,
            { autoAlpha: 0, y: 30 * factor, filter: "blur(12px)" },
            {
              autoAlpha: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 1,
              stagger: 0.14,
            },
            0.1,
          );

          if (descRef.current) {
            tl.fromTo(
              descRef.current,
              { autoAlpha: 0, y: 22 * factor },
              { autoAlpha: 1, y: 0, duration: 0.8 },
              "-=0.5",
            );
          }

          if (ctaRef.current) {
            tl.fromTo(
              ctaRef.current,
              { autoAlpha: 0, y: 18 * factor, scale: 0.95 },
              { autoAlpha: 1, y: 0, scale: 1, duration: 0.7 },
              "-=0.4",
            );
          }

          // ----- Scroll parallax (scrub) ------------------------------------
          // The image drifts slower than the page — a gentle ~40px range that
          // keeps moving as the next section arrives (no hard cut).
          if (parallaxRef.current) {
            const drift = 3 * factor; // % of the oversized image height
            gsap.fromTo(
              parallaxRef.current,
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
        },
      );
    }, section);

    return () => ctx.revert();
  }, [fullTitle, label, description, buttonText]);

  return (
    <section
      ref={sectionRef}
      id={id}
      aria-label={fullTitle}
      className="relative isolate flex w-full items-center justify-center overflow-hidden min-h-[60svh] py-24 sm:min-h-[68svh] lg:min-h-[82svh]"
    >
      {/* Background image (Layer 1) — parallax wrapper is oversized so the
          drift never reveals an edge; the inner layer carries the entrance. */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div
          ref={parallaxRef}
          className="absolute inset-x-0 -top-[8%] h-[116%] will-change-transform"
        >
          <div
            ref={imageRevealRef}
            className="relative h-full w-full will-change-transform"
          >
            <Image
              src={image}
              alt={imageAlt}
              fill
              sizes="100vw"
              quality={90}
              className="object-cover"
            />
          </div>
        </div>
        {/* Subtle overlay for text contrast — keeps the Figma look intact. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-black/15"
        />
      </div>

      <div className="relative z-10 mx-auto flex max-w-[72rem] flex-col items-center px-6 text-center sm:px-10">
        {label && (
          <p
            ref={labelRef}
            className="mb-5 text-xs font-medium uppercase tracking-[0.22em] text-white/80 [will-change:transform,filter] sm:text-sm"
          >
            {label}
          </p>
        )}

        <h2
          className="font-[family-name:var(--font-cabinet)] text-[clamp(1.6rem,3.4vw,3.25rem)] font-light leading-[1.28] tracking-[-0.005em] text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.28)]"
        >
          {lines.map((line, i) => (
            <span
              key={i}
              className="cv-line block [will-change:transform,filter]"
            >
              {line}
            </span>
          ))}
        </h2>

        {description && (
          <p
            ref={descRef}
            className="mt-6 max-w-2xl text-base text-white/85 [will-change:transform] sm:text-lg"
          >
            {description}
          </p>
        )}

        {buttonText && (
          <div ref={ctaRef} className="mt-9 [will-change:transform]">
            <Link
              href={buttonLink}
              data-cursor="button"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-neutral-900 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.5)] transition-[transform,box-shadow,background-color] duration-300 ease-out hover:-translate-y-[3px] hover:bg-neutral-100 hover:shadow-[0_18px_40px_-14px_rgba(0,0,0,0.6)] active:translate-y-0 active:duration-100"
            >
              {buttonText}
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

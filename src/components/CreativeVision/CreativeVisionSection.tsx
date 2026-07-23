"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  CREATIVE_VISION_POSTER,
  CREATIVE_VISION_TITLE,
  CREATIVE_VISION_VIDEO,
} from "./constants";
import type { CreativeVisionSectionProps } from "./types";
import { GSAP_EASE, ST_START } from "@/src/lib/motion";
import { BUTTON_SKIN } from "@/src/lib/button";

gsap.registerPlugin(ScrollTrigger);

/**
 * Full-bleed "Creative Vision" banner: looping background footage with a centred
 * editorial heading overlaid, composed as in the Figma. Optional label,
 * description and CTA are supported for reuse but omitted by default.
 *
 * The video is decorative — muted, looping, `aria-hidden`, and carrying no
 * caption track. The section's own `aria-label` is the heading, so the footage
 * needs no text alternative; that is also why it has no `alt`-equivalent prop.
 *
 * Motion (GSAP + ScrollTrigger, GPU transforms only):
 *  - Entrance runs once — a cinematic line-by-line heading reveal (fade + rise
 *    + blur-out, staggered), with the footage fading and settling from
 *    1.05 → 1.0 simultaneously; label / paragraph / CTA join when present.
 *  - A subtle scrubbed parallax keeps the footage drifting slower than the page
 *    (~40px) through and past the section — no abrupt exit.
 *  - Distances shrink on tablet/mobile and everything is skipped under
 *    prefers-reduced-motion (content stays visible by default).
 */
export default function CreativeVisionSection({
  label,
  title = CREATIVE_VISION_TITLE,
  description,
  video = CREATIVE_VISION_VIDEO,
  poster = CREATIVE_VISION_POSTER,
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
  const videoRef = useRef<HTMLVideoElement>(null);

  const lines = Array.isArray(title) ? title : [title];
  const fullTitle = lines.join(" ");

  // Reduced motion: hold the first frame rather than loop. `autoPlay` is a
  // markup attribute, so it has already fired by the time this runs — pausing
  // is the only way to honour the preference without giving up the poster.
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      if (mq.matches) el.pause();
      else void el.play().catch(() => {});
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

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
      {/* Background video (Layer 1) — parallax wrapper is oversized so the
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
            {/* `poster` is the still this section used to carry: it paints the
                exact same composition on the first frame, so the banner is
                never a black box while the video buffers, and it stays put as
                the visible background wherever autoplay is refused (low-power
                mode, data saver) or reduced motion pauses playback below. */}
            <video
              ref={videoRef}
              src={video}
              poster={poster}
              aria-hidden="true"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>
        {/* Text-contrast scrim, in two parts, because this footage is bright and
            moving: a flat 15% left white heading text at 1.87:1 over the frame's
            hottest areas — under the 3:1 WCAG minimum for large text — and the
            hot spot drifts, so it cannot be dodged by composition.

            A flat scrim heavy enough to fix that (~55%) would mute the footage
            everywhere. Instead a light 25% base keeps the edges vivid and a
            centred radial adds ~40% only where the copy sits; the two compose to
            45% transmittance there, putting the worst case at 3.27:1 while the
            periphery keeps its colour. Re-measure both layers if the footage
            changes — a darker clip wants less of this, not the same. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-black/25 bg-[radial-gradient(60%_60%_at_50%_50%,rgba(0,0,0,0.40),transparent_75%)]"
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
            className="mt-6 max-w-2xl text-[20px] font-light text-white/85 [will-change:transform]"
          >
            {description}
          </p>
        )}

        {buttonText && (
          <div ref={ctaRef} className="mt-9 [will-change:transform]">
            <Link
              href={buttonLink}
              data-cursor="button"
              className={`group inline-flex items-center gap-2 rounded-[16px] px-7 py-3.5 text-sm font-medium outline-none active:translate-y-0 active:duration-100 motion-safe:hover:-translate-y-[3px] ${BUTTON_SKIN}`}
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

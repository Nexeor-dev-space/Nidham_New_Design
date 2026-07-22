"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Magnetic from "@/src/components/CustomCursor/Magnetic";
import {
  FOOTER_COPYRIGHT,
  FOOTER_CTA,
  FOOTER_LEGAL,
  FOOTER_NAV,
  FOOTER_SOCIALS,
  FOOTER_VISION_HEADING,
  FOOTER_VISION_TEXT,
} from "./constants";
import type { FooterLink, FooterProps } from "./types";
import { GSAP_EASE, ST_START } from "@/src/lib/motion";

gsap.registerPlugin(ScrollTrigger);

/* ---- shared class tokens (the Figma palette) ---------------------------- */
const HEADING_CLS =
  "text-[14px] font-semibold uppercase tracking-[0.18em] text-[#C9BCC3]";

/* ---- icons -------------------------------------------------------------- */

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M14.05 2a9 9 0 0 1 8 7.94M14.05 6A5 5 0 0 1 18 10" />
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/* ---- reusable animated link -------------------------------------------- */

interface AnimatedLinkProps {
  link: FooterLink;
  /** Base text classes (size / spacing). */
  className?: string;
  /** Nudge right on hover (nav links). */
  translate?: boolean;
  /** Reveal a small arrow on hover (social links). */
  showArrow?: boolean;
}

/**
 * A link with an origin-left underline sweep, colour transition and optional
 * hover nudge / arrow reveal. Renders an external anchor or an internal
 * next/link based on `link.external`. Keyboard focus mirrors hover.
 */
function AnimatedLink({
  link,
  className = "",
  translate = false,
  showArrow = false,
}: AnimatedLinkProps) {
  const cls = [
    "group/l inline-flex items-center text-[#A99AA1] outline-none",
    "transition-[color,transform] duration-300 ease-out",
    "hover:text-[#F2ECEF] focus-visible:text-[#F2ECEF]",
    translate ? "hover:translate-x-1 focus-visible:translate-x-1" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const inner = (
    <>
      <span className="relative after:absolute after:-bottom-[3px] after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out group-hover/l:after:scale-x-100 group-focus-visible/l:after:scale-x-100">
        {link.label}
      </span>
      {showArrow && (
        <ArrowIcon className="ml-1.5 h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all duration-300 ease-out group-hover/l:translate-x-0 group-hover/l:opacity-100 group-focus-visible/l:translate-x-0 group-focus-visible/l:opacity-100" />
      )}
    </>
  );

  return link.external ? (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${link.label} (opens in a new tab)`}
      className={cls}
    >
      {inner}
    </a>
  ) : (
    <Link href={link.href} className={cls}>
      {inner}
    </Link>
  );
}

/* ---- footer ------------------------------------------------------------- */

export default function Footer({
  nav = FOOTER_NAV,
  socials = FOOTER_SOCIALS,
  legal = FOOTER_LEGAL,
  visionHeading = FOOTER_VISION_HEADING,
  visionText = FOOTER_VISION_TEXT,
  cta = FOOTER_CTA,
  copyright = FOOTER_COPYRIGHT,
}: FooterProps) {
  const rootRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const copyrightRef = useRef<HTMLParagraphElement>(null);
  const legalRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          isMobile: "(max-width: 767px)",
          isTablet: "(min-width: 768px) and (max-width: 1023px)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (mmCtx) => {
          const { isMobile, isTablet, reduce } = mmCtx.conditions as {
            isMobile: boolean;
            isTablet: boolean;
            reduce: boolean;
          };
          // Respect the OS preference — leave everything fully visible.
          if (reduce) return;

          const factor = isMobile ? 0.6 : isTablet ? 0.8 : 1;

          const tl = gsap.timeline({
            defaults: { ease: GSAP_EASE, force3D: true },
            scrollTrigger: { trigger: root, start: ST_START, once: true },
          });

          // Columns cascade left → center → right, then the bottom row.
          tl.fromTo(
            leftRef.current,
            { autoAlpha: 0, y: 26 * factor },
            { autoAlpha: 1, y: 0, duration: 0.7 },
            0,
          )
            .fromTo(
              centerRef.current,
              { autoAlpha: 0, y: 26 * factor },
              { autoAlpha: 1, y: 0, duration: 0.7 },
              "-=0.5",
            )
            .fromTo(
              rightRef.current,
              { autoAlpha: 0, y: 26 * factor },
              { autoAlpha: 1, y: 0, duration: 0.7 },
              "-=0.5",
            )
            .fromTo(
              copyrightRef.current,
              { autoAlpha: 0, y: 16 * factor },
              { autoAlpha: 1, y: 0, duration: 0.6 },
              "-=0.35",
            )
            .fromTo(
              legalRef.current,
              { autoAlpha: 0, y: 16 * factor },
              { autoAlpha: 1, y: 0, duration: 0.6 },
              "-=0.45",
            );
        },
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={rootRef}
      id="contact"
      data-particles="footer"
      className="w-full bg-[#3B2A3A] text-[#A99AA1]"
    >
      <div className="container-page py-16 sm:py-20 lg:py-24">
        {/* Top — three columns */}
        <div className="grid grid-cols-1 gap-14 text-center lg:grid-cols-3 lg:gap-10 lg:text-left">
          {/* Left — navigation */}
          <div ref={leftRef} className="flex flex-col items-center lg:items-start">
            <h2 className={HEADING_CLS}>Website</h2>
            <nav aria-label="Footer">
              <ul className="mt-8 flex flex-col items-center gap-6 lg:mt-10 lg:items-start">
                {nav.map((link) => (
                  <li key={link.href}>
                    <AnimatedLink link={link} translate className="text-[19px]" />
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Center — vision + CTA */}
          <div
            ref={centerRef}
            className="flex flex-col items-center lg:items-start"
          >
            <h2 className={HEADING_CLS}>{visionHeading}</h2>
            <p className="mt-6 max-w-sm text-[20px] font-light leading-[1.5] text-[#C0B2BA] lg:mt-8">
              {visionText}
            </p>
            <div className="mt-8 w-full sm:w-auto lg:mt-10">
              <Magnetic className="block w-full sm:inline-block sm:w-auto">
                <Link
                  href={cta.href}
                  data-cursor="button"
                  className="group/cta relative inline-flex w-full items-center justify-center gap-3 overflow-hidden border border-white/20 px-8 py-4 text-[16px] text-[#C9BCC3] transition-[transform,color,border-color,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:border-transparent hover:text-white hover:shadow-[0_20px_45px_-18px_rgba(107,100,121,0.95)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#3B2A3A] sm:w-auto"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-r from-[#6b6479] to-[#4a4457] opacity-0 transition-opacity duration-300 ease-out group-hover/cta:opacity-100"
                  />
                  <span className="relative z-10">{cta.label}</span>
                  <PhoneIcon className="relative z-10 h-5 w-5 transition-transform duration-300 ease-out group-hover/cta:translate-x-0.5" />
                </Link>
              </Magnetic>
            </div>
          </div>

          {/* Right — social */}
          <div ref={rightRef} className="flex flex-col items-center lg:items-end">
            <h2 className={HEADING_CLS}>Follow Us</h2>
            <ul className="mt-8 flex flex-col items-center gap-6 lg:mt-10 lg:items-end">
              {socials.map((link) => (
                <li key={link.href}>
                  <AnimatedLink link={link} showArrow className="text-[19px]" />
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom — divider + copyright + legal */}
        <div className="mt-16 border-t border-white/10 pt-8 lg:mt-20 lg:pt-9">
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-between">
            <p
              ref={copyrightRef}
              className="text-[13px] uppercase tracking-[0.16em] text-[#8E8087]"
            >
              {copyright}
            </p>
            <ul ref={legalRef} className="flex items-center gap-8">
              {legal.map((link) => (
                <li key={link.href}>
                  <AnimatedLink
                    link={link}
                    className="text-[13px] uppercase tracking-[0.14em]"
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

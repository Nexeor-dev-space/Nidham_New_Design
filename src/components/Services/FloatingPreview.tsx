"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import type { Service } from "./types";

interface FloatingPreviewProps {
  services: readonly Service[];
  /** Index of the hovered row, or -1 when nothing is hovered. */
  activeIndex: number;
}

/**
 * Desktop-only floating media that trails the cursor beside the hovered service.
 *
 * All motion is GPU transforms + opacity, driven imperatively so hover never
 * triggers a React re-render:
 *  - Position follows the pointer via GSAP `quickTo` (rAF-backed, eased) so the
 *    preview drifts "subtly with the cursor" rather than sticking to it.
 *  - Show/hide (opacity + scale) is a single tween toggled on `activeIndex`.
 *  - The per-service image crossfade is pure CSS opacity between stacked images.
 *
 * Gated to fine-pointer, non-reduced-motion, large screens — so it is fully
 * disabled on tablet/mobile (where it also isn't rendered by the CSS `hidden`).
 */
export default function FloatingPreview({
  services,
  activeIndex,
}: FloatingPreviewProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const enabledRef = useRef(false);
  const xTo = useRef<((v: number) => void) | null>(null);
  const yTo = useRef<((v: number) => void) | null>(null);

  // Pointer follow — set up once.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const large = window.matchMedia("(min-width: 1024px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || !large || reduced) return;

    enabledRef.current = true;
    gsap.set(wrap, { xPercent: -50, yPercent: -50, autoAlpha: 0, scale: 0.9 });

    xTo.current = gsap.quickTo(wrap, "x", { duration: 0.7, ease: "power3.out" });
    yTo.current = gsap.quickTo(wrap, "y", { duration: 0.7, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      // Offset the preview up-and-right of the cursor so it never sits under it.
      xTo.current?.(e.clientX + 28);
      yTo.current?.(e.clientY - 24);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      gsap.killTweensOf(wrap);
    };
  }, []);

  // Reveal / hide on hover.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || !enabledRef.current) return;
    const shown = activeIndex >= 0;
    gsap.to(wrap, {
      autoAlpha: shown ? 1 : 0,
      scale: shown ? 1 : 0.9,
      duration: shown ? 0.5 : 0.35,
      ease: "power3.out",
    });
  }, [activeIndex]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[60] hidden h-[380px] w-[300px] overflow-hidden rounded-[20px] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)] will-change-transform lg:block"
      style={{ visibility: "hidden" }}
    >
      {services.map((service, i) => (
        <div
          key={service.id}
          className="absolute inset-0 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ opacity: i === activeIndex ? 1 : 0 }}
        >
          <Image
            src={service.image}
            alt=""
            fill
            sizes="300px"
            className="object-cover"
          />
          {/* Subtle scrim for depth, consistent with the site's media treatment. */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
        </div>
      ))}
    </div>
  );
}

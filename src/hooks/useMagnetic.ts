"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap } from "gsap";

export interface UseMagneticOptions {
  /** Fraction of the cursor offset applied as movement (0–1). */
  strength?: number;
  /** Maximum displacement in px. Spec calls for a subtle 6–10px pull. */
  max?: number;
}

/**
 * Gives an element a subtle magnetic pull toward the cursor while hovered,
 * easing back to rest on leave. GSAP `quickTo` keeps it buttery; disabled on
 * touch devices and when the user prefers reduced motion.
 *
 * Attach the returned ref to a wrapper element (see the `Magnetic` component)
 * so its transform never fights the child's own hover transforms.
 */
export function useMagnetic<T extends HTMLElement = HTMLElement>({
  strength = 0.35,
  max = 8,
}: UseMagneticOptions = {}): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!fine || reduced) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });
    const clamp = (v: number) => Math.max(-max, Math.min(max, v));

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      xTo(clamp(dx * strength));
      yTo(clamp(dy * strength));
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      gsap.killTweensOf(el);
    };
  }, [strength, max]);

  return ref;
}

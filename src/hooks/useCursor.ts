"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";

/** The distinct looks the cursor can take. */
export type CursorVariant =
  | "default"
  | "button"
  | "link"
  | "card"
  | "image"
  | "video"
  | "text";

/** Visual definition of a single variant. Sizes are the ring's diameter in px. */
interface VariantStyle {
  size: number;
  borderWidth: number;
  borderColor: string;
  background: string;
  boxShadow: string;
  /** `difference` keeps the minimal ring visible over any background; content
   *  states switch to `normal` so their fill + label read correctly. */
  blend: "difference" | "normal";
  /** Ring opacity — 0 hides it (e.g. over text inputs). */
  opacity: number;
  /** Whether this variant shows a centered label. */
  showLabel: boolean;
}

const VARIANTS: Record<CursorVariant, VariantStyle> = {
  default: {
    size: 22,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.9)",
    background: "rgba(0,0,0,1)",
    boxShadow: "0 0 10px rgba(0,0,0,0.18)",
    // `normal` (not `difference`) so the black fill renders as true black
    // rather than inverting against the backdrop.
    blend: "normal",
    opacity: 1,
    showLabel: false,
  },
  button: {
    size: 40,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,1)",
    background: "rgba(255,255,255,0.18)",
    boxShadow: "0 0 0 rgba(0,0,0,0)",
    blend: "difference",
    opacity: 1,
    showLabel: false,
  },
  link: {
    size: 30,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,1)",
    background: "rgba(255,255,255,0)",
    boxShadow: "0 0 16px rgba(255,255,255,0.55)",
    blend: "difference",
    opacity: 1,
    showLabel: false,
  },
  card: {
    size: 86,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.95)",
    background: "rgba(0,0,0,0.32)",
    boxShadow: "0 10px 34px rgba(0,0,0,0.28)",
    blend: "normal",
    opacity: 1,
    showLabel: true,
  },
  image: {
    size: 92,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.95)",
    background: "rgba(0,0,0,0.28)",
    boxShadow: "0 10px 34px rgba(0,0,0,0.28)",
    blend: "normal",
    opacity: 1,
    showLabel: false,
  },
  video: {
    size: 96,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.95)",
    background: "rgba(0,0,0,0.42)",
    boxShadow: "0 10px 34px rgba(0,0,0,0.32)",
    blend: "normal",
    opacity: 1,
    showLabel: true,
  },
  text: {
    size: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0)",
    background: "rgba(255,255,255,0)",
    boxShadow: "none",
    blend: "difference",
    opacity: 0,
    showLabel: false,
  },
};

/** Fallback label text when a variant shows a label but the element omits one. */
const DEFAULT_LABELS: Partial<Record<CursorVariant, string>> = {
  card: "Explore",
  video: "▶ Play",
};

/** Selector for elements that influence the cursor (explicit + native). */
const INTERACTIVE =
  '[data-cursor],a,button,input,textarea,select,[role="button"],[contenteditable="true"]';

export interface UseCursorRefs {
  rootRef: RefObject<HTMLDivElement | null>;
  ringRef: RefObject<HTMLDivElement | null>;
  labelRef: RefObject<HTMLSpanElement | null>;
}

/**
 * Drives a high-performance custom cursor entirely through refs — no React
 * re-renders on movement or hover. Position is interpolated with GSAP
 * `quickTo` (rAF-backed) via `translate3d`; hover/click states animate the ring
 * and an optional label. Enabled only on fine-pointer devices.
 */
export function useCursor({ rootRef, ringRef, labelRef }: UseCursorRefs): void {
  useEffect(() => {
    const root = rootRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!root || !ring || !label) return;

    // Fine pointer only — touch devices keep native interaction.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    document.documentElement.dataset.customCursor = "on";

    const base = VARIANTS.default;
    gsap.set(ring, {
      xPercent: -50,
      yPercent: -50,
      width: base.size,
      height: base.size,
      borderWidth: base.borderWidth,
      borderColor: base.borderColor,
      backgroundColor: base.background,
      boxShadow: base.boxShadow,
    });
    gsap.set(label, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
    gsap.set(root, { autoAlpha: 0 });
    ring.style.mixBlendMode = base.blend;

    // ----- position interpolation (the "follow with subtle delay") -----
    const followDur = reduced ? 0 : 0.55;
    const xTo = gsap.quickTo(root, "x", { duration: followDur, ease: "power3.out" });
    const yTo = gsap.quickTo(root, "y", { duration: followDur, ease: "power3.out" });

    let revealed = false;
    const onMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      if (!revealed) {
        revealed = true;
        gsap.to(root, { autoAlpha: 1, duration: 0.3, ease: "power2.out" });
      }
    };

    // ----- hover state -----
    let currentKey = "default|";
    const applyVariant = (variant: CursorVariant, text: string) => {
      const s = VARIANTS[variant];
      ring.style.mixBlendMode = s.blend; // not animatable — set instantly
      gsap.to(ring, {
        width: s.size,
        height: s.size,
        borderWidth: s.borderWidth,
        borderColor: s.borderColor,
        backgroundColor: s.background,
        boxShadow: s.boxShadow,
        autoAlpha: s.opacity,
        duration: reduced ? 0 : 0.4,
        ease: "power3.out",
      });
      if (s.showLabel && text) label.textContent = text;
      gsap.to(label, {
        autoAlpha: s.showLabel && text ? 1 : 0,
        duration: reduced ? 0 : 0.3,
        ease: "power2.out",
      });
    };

    const resolve = (
      target: EventTarget | null,
    ): { variant: CursorVariant; label: string } => {
      const el =
        target instanceof Element ? target.closest(INTERACTIVE) : null;
      if (!(el instanceof HTMLElement)) return { variant: "default", label: "" };

      const attr = el.getAttribute("data-cursor") as CursorVariant | null;
      const labelText = el.getAttribute("data-cursor-label") ?? "";
      if (attr && attr in VARIANTS) return { variant: attr, label: labelText };

      const tag = el.tagName.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select" || el.isContentEditable) {
        return { variant: "text", label: "" };
      }
      if (tag === "button" || el.getAttribute("role") === "button") {
        return { variant: "button", label: labelText };
      }
      if (tag === "a") return { variant: "link", label: labelText };
      return { variant: "default", label: labelText };
    };

    const onOver = (e: MouseEvent) => {
      const { variant, label: text } = resolve(e.target);
      const resolvedText = text || DEFAULT_LABELS[variant] || "";
      const key = `${variant}|${resolvedText}`;
      if (key === currentKey) return;
      currentKey = key;
      applyVariant(variant, resolvedText);
    };

    // ----- click micro-interaction -----
    const onDown = () =>
      gsap.to(ring, { scale: 0.82, duration: 0.2, ease: "power2.out" });
    const onUp = () =>
      gsap.to(ring, {
        scale: 1,
        duration: reduced ? 0 : 0.4,
        ease: reduced ? "power2.out" : "elastic.out(1,0.6)",
      });

    // ----- window enter/leave -----
    const onLeaveWindow = (e: MouseEvent) => {
      if (!e.relatedTarget) gsap.to(root, { autoAlpha: 0, duration: 0.25 });
    };
    const onEnterWindow = () =>
      revealed && gsap.to(root, { autoAlpha: 1, duration: 0.25 });

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mousedown", onDown, { passive: true });
    window.addEventListener("mouseup", onUp, { passive: true });
    document.addEventListener("mouseout", onLeaveWindow, { passive: true });
    document.addEventListener("mouseover", onEnterWindow, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseout", onLeaveWindow);
      document.removeEventListener("mouseover", onEnterWindow);
      delete document.documentElement.dataset.customCursor;
      gsap.killTweensOf([root, ring, label]);
    };
  }, [rootRef, ringRef, labelRef]);
}

"use client";

import Link from "next/link";
import type { PointerEvent, ReactNode } from "react";
import { BUTTON_SKIN, BUTTON_SKIN_OUTLINE } from "@/src/lib/button";

/** Optional leading glyph rendered before the label. */
type LeadingIcon = "play" | "gallery";

interface EventButtonProps {
  children: ReactNode;
  variant: "primary" | "secondary";
  /** Route/anchor destination. Renders a Link. Mutually exclusive with onClick. */
  href?: string;
  /** Click handler (e.g. open the video modal). Renders a <button>. */
  onClick?: () => void;
  /** Leading glyph before the label — e.g. `play` for "Watch Highlights". */
  leadingIcon?: LeadingIcon;
  /** Trailing forward arrow. Defaults to on for `primary`, off for `secondary`. */
  arrow?: boolean;
  /** Accessible label when the text alone isn't descriptive enough. */
  ariaLabel?: string;
}

const PlayGlyph = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5 fill-current">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const GalleryGlyph = () => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="h-4 w-4"
  >
    <rect x="3" y="4" width="18" height="14" rx="2" />
    <path d="m3 15 4-4 4 4 3-3 4 4" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="9" cy="9" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);

const ArrowGlyph = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
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
);

/**
 * The site's shared premium action button, on the unified button skins (see
 * lib/button). `primary` is the filled amber→magenta button with a shine sweep
 * and a forward arrow; `secondary` is the outlined counterpart that fills in on
 * hover to land on the primary's resting state.
 *
 * Two shapes from one component so every event action reads identically whether
 * it navigates or triggers something in place:
 *   • pass `href`    → renders a Next.js <Link> (routes / anchors);
 *   • pass `onClick` → renders a <button> (e.g. opens the video modal).
 * Both keep the ripple-on-press, and `primary` keeps the sweep + arrow. The
 * hover lift/press live on the element itself; callers animate the *wrapper*, so
 * entrance transforms and hover transforms never collide.
 */
export default function EventButton({
  children,
  variant,
  href,
  onClick,
  leadingIcon,
  arrow,
  ariaLabel,
}: EventButtonProps) {
  const isPrimary = variant === "primary";
  const showArrow = arrow ?? isPrimary;

  const spawnRipple = (e: PointerEvent<HTMLElement>) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement("span");
    ripple.className =
      "pointer-events-none absolute z-0 rounded-full bg-current/25 [animation:ripple_600ms_ease-out]";
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    btn.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove());
  };

  const base =
    "group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-[16px] px-7 py-3.5 text-sm font-medium outline-none active:translate-y-0 active:duration-100 motion-safe:hover:-translate-y-[3px] sm:w-auto";

  const content = (
    <>
      <span className="relative z-10 inline-flex items-center gap-2">
        {leadingIcon === "play" && <PlayGlyph />}
        {leadingIcon === "gallery" && <GalleryGlyph />}
        {children}
        {showArrow && <ArrowGlyph />}
      </span>
      {isPrimary && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 -translate-x-[130%] skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[130%]"
        />
      )}
    </>
  );

  const className = `${base} ${isPrimary ? BUTTON_SKIN : BUTTON_SKIN_OUTLINE}`;

  if (href) {
    return (
      <Link
        href={href}
        data-cursor="button"
        aria-label={ariaLabel}
        onPointerDown={spawnRipple}
        className={className}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      data-cursor="button"
      aria-label={ariaLabel}
      onPointerDown={spawnRipple}
      className={className}
    >
      {content}
    </button>
  );
}

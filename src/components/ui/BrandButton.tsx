"use client";

import { useRef, type MouseEvent } from "react";
import Magnetic from "@/src/components/CustomCursor/Magnetic";
import { BUTTON_SKIN } from "@/src/lib/button";

/**
 * The site's primary button: the shared amber→magenta skin (see lib/button)
 * with a 2px magnetic lift + 1.02 scale, and a slow light sweep on hover, plus
 * the arrow that slides right.
 *
 * On top of that it adds the requested press **ripple** — an expanding, fading
 * circle spawned at the pointer, clipped to the pill by `overflow-hidden`
 * (keyframes `ripple` live in app/globals.css). Motion is disabled by the same
 * `motion-safe:` gating the rest of the site uses.
 */

const CTA_BASE =
  "group relative inline-flex items-center overflow-hidden rounded-[16px] font-semibold uppercase tracking-[0.14em] outline-none";

const CTA_SKIN = `grain-overlay ${BUTTON_SKIN} motion-safe:hover:-translate-y-[2px] motion-safe:hover:scale-[1.02]`;

interface BrandButtonProps {
  label: string;
  href?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  /** Larger padding for standalone CTA sections. */
  size?: "md" | "lg";
}

export default function BrandButton({
  label,
  href = "#contact",
  onClick,
  size = "md",
}: BrandButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  const spawnRipple = (event: MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement("span");
    // `currentColor` so the ripple reads against whichever way the face has
    // swapped — amber on the magenta hover fill, magenta on the amber rest fill.
    ripple.className = "pointer-events-none absolute rounded-full bg-current/25";
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
    ripple.style.animation = "ripple 0.6s ease-out forwards";
    ripple.addEventListener("animationend", () => ripple.remove());
    el.appendChild(ripple);
  };

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    spawnRipple(event);
    onClick?.(event);
  };

  const pad =
    size === "lg"
      ? "gap-3 px-8 py-4 text-[13px] sm:px-10 sm:py-[18px] sm:text-[15px]"
      : "gap-2.5 px-7 py-3 text-[13px] sm:text-[14px]";

  return (
    <Magnetic className="inline-block">
      <a
        ref={ref}
        href={href}
        data-cursor="button"
        onClick={handleClick}
        className={`${CTA_BASE} ${CTA_SKIN} ${pad}`}
      >
        {/* Light sweep on hover — a slow sheen across the fill. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.28)_50%,transparent_70%)] transition-transform duration-[900ms] ease-out group-hover:translate-x-full motion-reduce:hidden"
        />
        <span className="relative">{label}</span>
        <span
          aria-hidden="true"
          className="relative transition-transform duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:translate-x-[5px]"
        >
          &rarr;
        </span>
      </a>
    </Magnetic>
  );
}

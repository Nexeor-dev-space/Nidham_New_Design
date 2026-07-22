"use client";

import { useRef, type MouseEvent } from "react";
import Magnetic from "@/src/components/CustomCursor/Magnetic";

/**
 * The site's primary button, reused verbatim from the hero Navbar CTA so the
 * Events page's calls-to-action are visually identical to the homepage:
 * brand-magenta grain-filled pill, 2px magnetic lift + 1.02 scale, glow, and a
 * slow light sweep on hover, plus the arrow that slides right.
 *
 * On top of that it adds the requested press **ripple** — an expanding, fading
 * circle spawned at the pointer, clipped to the pill by `overflow-hidden`
 * (keyframes `ripple` live in app/globals.css). Motion is disabled by the same
 * `motion-safe:` gating the rest of the site uses.
 */

const CTA_BASE =
  "group relative inline-flex items-center overflow-hidden rounded-[16px] font-semibold uppercase tracking-[0.14em] outline-none transition-[translate,scale,box-shadow,background-color] duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6E1B45]";

const CTA_SKIN =
  "grain-overlay border border-[#5D0139] bg-[#5D0139] text-white shadow-[0_8px_20px_-10px_rgba(93,1,57,0.5)] hover:bg-[#6E1B45] hover:shadow-[0_20px_44px_-12px_rgba(110,27,69,0.7)] motion-safe:hover:-translate-y-[2px] motion-safe:hover:scale-[1.02]";

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
    ripple.className = "pointer-events-none absolute rounded-full bg-white/30";
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

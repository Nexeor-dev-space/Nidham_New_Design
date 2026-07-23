"use client";

import Link from "next/link";
import type { PointerEvent, ReactNode } from "react";
import { BUTTON_SKIN } from "@/src/lib/button";

interface EventButtonProps {
  href: string;
  children: ReactNode;
  variant: "primary" | "secondary";
}

/**
 * CTA with a premium ripple on press, on the shared amber→magenta skin (see
 * lib/button). The primary variant adds a shine sweep on hover and a forward
 * arrow. Hover/press transforms live on the anchor — the GSAP entrance animates
 * the wrapping container, so the two never collide.
 *
 * `variant` now only decides the arrow and the sweep: both variants carry the
 * same fill, because the site has one button colour.
 */
export default function EventButton({ href, children, variant }: EventButtonProps) {
  const isPrimary = variant === "primary";

  const spawnRipple = (e: PointerEvent<HTMLAnchorElement>) => {
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

  return (
    <Link
      href={href}
      data-cursor="button"
      onPointerDown={spawnRipple}
      className={`${base} ${BUTTON_SKIN}`}
    >
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
        {isPrimary && (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
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
        )}
      </span>

      {isPrimary && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 -translate-x-[130%] skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[130%]"
        />
      )}
    </Link>
  );
}

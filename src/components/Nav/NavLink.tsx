"use client";

import type { MouseEvent } from "react";

/**
 * The site's editorial navigation link — shared by the hero Navbar (dark) and
 * the FloatingNav pill (light) so both read as one navigation language.
 *
 * No chrome: no pill, no border, no background — just type and a hairline rule.
 * On hover/focus a 1px brand-magenta rule grows from the centre outward while
 * the label lifts 2px off it, leaving the rule anchored. The active section
 * keeps that rule persistently at reduced opacity, so "where I am" and "where
 * I'm pointing" are the same visual idea at two intensities.
 *
 * The label lift and the rule are separate elements on purpose: if the anchor
 * itself moved, the rule would ride up with it and the type would not appear to
 * lift *off* anything.
 */

/**
 * Signature easing as a CSS bezier — the `EASE_CSS` curve from src/lib/motion.ts.
 *
 * Two Tailwind v4 traps live in the transitions below — both fail silently:
 *
 *  1. `scale-*`/`translate-*` compile to the standalone `scale`/`translate` CSS
 *     properties, not the `transform` shorthand. An arbitrary
 *     `transition-[transform,…]` names a property that never changes, so the
 *     animation snaps. List `scale`/`translate`, or use the named
 *     `transition-transform` (it expands to transform, translate, scale, rotate).
 *  2. Motion is gated with `motion-safe:` rather than undone with
 *     `motion-reduce:`. `group-hover:x` is `.group:hover .child` (0,2,0) and a
 *     `motion-reduce:` override on the same element is (0,1,0) — media queries
 *     add no specificity, so the override can never win.
 */
const EASE_CLASS = "ease-[cubic-bezier(0.22,1,0.36,1)]";

/**
 * Brand magenta (#6E1B45) with a lighter tint of the same hue at the rule's
 * centre — at 1px on near-black the flat brand colour reads as almost nothing,
 * so the tint carries the highlight and the glow.
 */
const RULE_GRADIENT =
  "bg-[linear-gradient(90deg,transparent_0%,#6E1B45_22%,#A6386B_50%,#6E1B45_78%,transparent_100%)]";

/** Resting → hover colours per surface. */
const TONE = {
  dark: "text-neutral-300 hover:text-white focus-visible:text-white",
  light: "text-neutral-500 hover:text-neutral-900 focus-visible:text-neutral-900",
} as const;

interface NavLinkProps {
  href: string;
  label: string;
  /** Marks the current section: persistent rule + aria-current. */
  active?: boolean;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  /** Surface this link sits on — drives the text colours only. */
  tone?: keyof typeof TONE;
}

export default function NavLink({
  href,
  label,
  active = false,
  onClick,
  tone = "dark",
}: NavLinkProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      data-cursor="button"
      aria-current={active ? "page" : undefined}
      className={`group relative inline-flex items-center text-[17px] font-medium leading-none tracking-[0.005em] outline-none transition-colors duration-300 ${EASE_CLASS} ${TONE[tone]} focus-visible:outline-2 focus-visible:outline-offset-[6px] focus-visible:outline-[#6E1B45]`}
    >
      <span
        className={`block transition-transform duration-300 ${EASE_CLASS} motion-safe:group-hover:-translate-y-[2px] motion-safe:group-focus-visible:-translate-y-[2px]`}
      >
        {label}
      </span>

      {/* Hairline rule — scales from the centre out. Kept out of the a11y tree
          and out of hit-testing so it can sit below the anchor's box. */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 -bottom-[7px] h-px origin-center rounded-full ${RULE_GRADIENT} transition-[scale,opacity,box-shadow] duration-300 ${EASE_CLASS} group-hover:scale-x-100 group-hover:opacity-100 group-hover:shadow-[0_0_10px_rgba(166,56,107,0.55)] group-focus-visible:scale-x-100 group-focus-visible:opacity-100 motion-reduce:transition-none ${
          active ? "scale-x-100 opacity-60" : "scale-x-0 opacity-0"
        }`}
      />
    </a>
  );
}

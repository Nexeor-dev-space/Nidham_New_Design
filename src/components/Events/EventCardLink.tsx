"use client";

import Link from "next/link";
import type { ReactNode } from "react";

interface EventCardLinkProps {
  children: ReactNode;
  /** Destination — renders a Next.js <Link>. Mutually exclusive with onClick. */
  href?: string;
  /** Click handler (e.g. open the video modal) — renders a <button>. */
  onClick?: () => void;
  ariaLabel?: string;
}

/**
 * The site's minimal editorial action link — the "View Details →" treatment:
 * an uppercase, letter-spaced label, a magenta arrow that slides right, and a
 * gradient underline that grows from the left on hover/focus. Used for every
 * action on an {@link EventCard} in place of filled/outlined buttons.
 *
 * It owns a NAMED group (`group/link`) so its hover is independent of the card's
 * own `group` (image zoom/lift) — each link animates only when *it* is hovered.
 * Renders a <Link> when given `href`, or a <button> when given `onClick`.
 */
export default function EventCardLink({
  children,
  href,
  onClick,
  ariaLabel,
}: EventCardLinkProps) {
  const className =
    "group/link relative inline-flex items-center gap-2.5 pb-1 font-[family-name:var(--font-urbanist)] text-xs font-medium uppercase tracking-[0.18em] text-neutral-300 outline-none transition-colors duration-500 hover:text-white focus-visible:text-white";

  const inner = (
    <>
      {children}
      <span
        aria-hidden="true"
        className="text-[#A6386B] transition-transform duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover/link:translate-x-1.5"
      >
        &rarr;
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-[linear-gradient(90deg,#6E1B45,#A6386B)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/link:scale-x-100 group-focus-visible/link:scale-x-100"
      />
    </>
  );

  if (href) {
    return (
      <Link href={href} data-cursor="button" aria-label={ariaLabel} className={className}>
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} data-cursor="button" aria-label={ariaLabel} className={className}>
      {inner}
    </button>
  );
}

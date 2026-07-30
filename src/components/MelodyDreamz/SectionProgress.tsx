"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useActiveSection } from "@/src/hooks/useActiveSection";
import { scrollToId } from "@/src/lib/nav";
import { MD_SECTIONS } from "./constants";

const IDS = MD_SECTIONS.map((s) => s.id);

/**
 * Sticky reading-progress rail — a vertical list of the page's sections with the
 * current one marked.
 *
 * Reuses `useActiveSection`, the same scroll-spy the site nav already uses, so
 * "which section am I in" is answered one way across the whole site rather than
 * two.
 *
 * Desktop only (`hidden lg:flex`), and deliberately so: at tablet and below it
 * would either cover the content or collapse to unreadable dots, and the page's
 * own headings already give the reader their position. It is also
 * `pointer-events-none` on the rail with `pointer-events-auto` on the buttons,
 * so the fixed column can never swallow a click aimed at the page behind it.
 *
 * `aria-hidden` is wrong here — these are real navigation controls — so it is a
 * labelled `<nav>` with `aria-current` on the active item instead.
 *
 * **It hides once the footer is on screen.** The rail belongs to the article; the
 * footer is site-wide chrome outside the article's `rail-inset` wrapper, so it is
 * not indented and the rail would otherwise sit directly on its left column.
 * Detected with an IntersectionObserver, not a scroll listener — Lenis drives
 * scrolling from the GSAP ticker and the page emits no native `scroll` events at
 * all, so a listener here would simply never fire.
 */
export default function SectionProgress() {
  const reduce = useReducedMotion() ?? false;
  const active = useActiveSection(IDS, IDS[0]);
  const [atFooter, setAtFooter] = useState(false);

  useEffect(() => {
    // `body > footer`, not `footer`. This page has two: the site footer, and the
    // one inside the pull-quote's <blockquote> carrying its attribution — which
    // is correct markup for a citation and comes first in document order, so a
    // bare `querySelector("footer")` observes a 20px line of text mid-article
    // and the rail never hides.
    const footer = document.querySelector("body > footer");
    if (!footer || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      ([entry]) => setAtFooter(entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(footer);
    return () => io.disconnect();
  }, []);

  return (
    <nav
      aria-label="Case study sections"
      // `hidden` rather than opacity alone once the footer arrives: an
      // invisible-but-present rail would still take the reader's clicks.
      className={`pointer-events-none fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] xl:left-10 ${
        atFooter ? "lg:hidden" : "lg:flex"
      }`}
    >
      {/* No plate behind the rail. It used to carry one because the labels sat
          directly on whatever was passing beneath — photographs, type, gradient
          beds — and legibility changed section to section. That is no longer
          true: `rail-inset` reserves this column, so the rail now only ever
          passes over the sections' flat background beds. The one exception is
          the hero, where it crosses moving footage, and the labels' own
          `drop-shadow` covers that without a visible background. */}
      <ul className="pointer-events-auto flex flex-col gap-0.5 [filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.95))]">
        {MD_SECTIONS.map((section) => {
          const current = active === section.id;
          return (
            <li key={section.id}>
              <button
                type="button"
                onClick={() => scrollToId(section.id, reduce)}
                aria-current={current ? "true" : undefined}
                className="group flex w-full items-center gap-3 rounded-md py-2 pr-1 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF3D8F]"
              >
                {/* The rule grows and turns brand pink for the active section —
                    a length change reads at a glance where a colour change
                    alone would not. 2px, not a hairline: a 1px rule on these
                    near-black beds all but disappeared. */}
                <span
                  aria-hidden="true"
                  className={`h-0.5 shrink-0 rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    current
                      ? "w-9 bg-[#E00068]"
                      : "w-4 bg-white/45 group-hover:w-6 group-hover:bg-white/70"
                  }`}
                />
                {/* `neutral-300` at rest, not `neutral-500`. The old value was
                    ~3.4:1 on these backgrounds — under the 4.5:1 floor, and the
                    reason the rail read as barely there. */}
                <span
                  className={`whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.18em] transition-colors duration-500 ${
                    current
                      ? "text-white"
                      : "text-neutral-300 group-hover:text-white"
                  }`}
                >
                  {section.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

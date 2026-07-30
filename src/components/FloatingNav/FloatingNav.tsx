"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import NavLink from "@/src/components/Nav/NavLink";
import { useActiveSection } from "@/src/hooks/useActiveSection";
import { NAV_LINKS, REGISTER_CTA } from "@/src/components/Hero/constants";
import { EASE } from "@/src/lib/motion";
import { BUTTON_SKIN } from "@/src/lib/button";
import { navigateTo } from "@/src/lib/nav";

/**
 * Nav targets — Home plus the shared NAV_LINKS, so this nav and the hero navbar
 * can never drift apart. Each item carries the raw `href` (routed through
 * src/lib/nav.ts), a stable `key` used for the active state, and `section` — the
 * on-page element id for the scroll-spy, or `null` for route links that own no
 * section on the current page.
 */
const NAV_ITEMS: readonly {
  key: string;
  label: string;
  href: string;
  section: string | null;
}[] = [
  { key: "top", label: "Home", href: "#top", section: "top" },
  ...NAV_LINKS.map((link) => {
    const isHash = link.href.startsWith("#");
    return {
      key: isHash ? link.href.slice(1) : link.href,
      label: link.label,
      href: link.href,
      section: isHash ? link.href.slice(1) : null,
    };
  }),
];

/** Only real on-page section ids feed the scroll-spy. */
const SECTION_IDS = NAV_ITEMS.map((item) => item.section).filter(
  (s): s is string => s !== null,
);

/**
 * A floating, premium pill navigation pinned to the bottom-center of the
 * viewport, closing on the Register CTA — the pill's primary action, sharing the
 * hero navbar's signature button skin so the two stay identical. It hands off
 * from that navbar the instant it scrolls out of view (see the reveal effect),
 * so there is always exactly one navigation surface on screen and never two.
 * The active section is tracked on scroll and marked with a sliding
 * indicator
 * (framer-motion `layoutId`). Responsive; keyboard accessible; respects reduced
 * motion.
 */
export default function FloatingNav() {
  const reduce = useReducedMotion() ?? false;
  const router = useRouter();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const scrollActive = useActiveSection(SECTION_IDS, NAV_ITEMS[0].section ?? "");

  // Which item reads as "current". On a route with its own page (e.g.
  // /services) that route's link is active; on the homepage the scroll-spy
  // decides; elsewhere nothing is highlighted.
  const routeItem = NAV_ITEMS.find(
    (item) => item.section === null && pathname.startsWith(item.href),
  );
  const active = routeItem ? routeItem.key : pathname === "/" ? scrollActive : "";

  // When the pill appears: the moment the top navbar leaves the viewport, and
  // not before. `#hero-nav-sentinel` is a zero-height marker sitting directly
  // beneath that navbar on every page, so watching it *is* watching the navbar.
  //
  // On the homepage this also keeps the pill off the hero for free, with no
  // measuring of its own. The hero is pinned (see useHeroReveal), and a pinned
  // element is `position: fixed` — so the navbar, and the sentinel under it,
  // stay on screen for the entire pin. The sentinel only leaves once the pin has
  // released and the hero is genuinely scrolling away, which is exactly when the
  // navbar it stands for disappears.
  //
  // This is an IntersectionObserver and must stay one. Lenis drives scrolling
  // from gsap's ticker and the page never emits `scroll` events, so a scroll
  // listener here would simply never fire; IO is layout-driven and unaffected.
  useEffect(() => {
    const sentinel = document.getElementById("hero-nav-sentinel");

    // Nothing to anchor to (or no IO): leave the pill in its initial hidden
    // state rather than guessing — every real page carries the marker.
    if (!sentinel || !("IntersectionObserver" in window)) return;

    const io = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(sentinel);
    return () => io.disconnect();
  }, [pathname]);

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    navigateTo(event, href, router, pathname, reduce);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          key="floating-nav"
          aria-label="Section navigation"
          initial={{ opacity: 0, y: reduce ? 0 : 28 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduce ? 0 : 28 }}
          transition={{ duration: 0.55, ease: EASE }}
          className="fixed bottom-6 left-1/2 z-[70] max-w-[calc(100vw-2rem)] -translate-x-1/2 sm:bottom-8"
        >
          {/* Same editorial links as the hero navbar, on a light surface, then
              the Register CTA as the final action. Asymmetric padding
              (`pl` > `pr`) insets the filled button neatly inside the pill's
              right edge; the vertical padding is sized so the button — the
              tallest item — defines the pill height with an even margin all
              round. Gaps tighten on small screens so four items never crowd. */}
          <ul className="flex items-center gap-4 rounded-full border border-neutral-200/80 bg-white py-2 pl-6 pr-2 shadow-[0_22px_55px_-18px_rgba(0,0,0,0.30)] sm:gap-8 sm:py-2.5 sm:pl-9 sm:pr-2.5">
            {NAV_ITEMS.map((item) => (
              <li key={item.key}>
                <NavLink
                  href={item.href}
                  label={item.label}
                  active={active === item.key}
                  onClick={(e) => handleClick(e, item.href)}
                  tone="light"
                />
              </li>
            ))}

            {/* Register — the pill's primary action. Same BUTTON_SKIN as the hero
                navbar CTA (so the two never drift), sized a touch smaller and
                pill-shaped to sit inside the nav. Hover adds a 1.04 scale and
                slides the arrow; BUTTON_SKIN carries the colour swap, glow and
                shadow expansion on the shared 350ms curve. */}
            <li>
              <a
                href={REGISTER_CTA.href}
                onClick={(e) => handleClick(e, REGISTER_CTA.href)}
                data-cursor="button"
                className={`group relative inline-flex items-center gap-1.5 overflow-hidden rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] outline-none grain-overlay ${BUTTON_SKIN} motion-safe:hover:scale-[1.04] sm:px-5 sm:py-2.5 sm:text-[13px] sm:tracking-[0.12em]`}
              >
                <span className="relative">{REGISTER_CTA.label}</span>
                <span
                  aria-hidden="true"
                  className="relative transition-transform duration-[300ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:translate-x-[4px]"
                >
                  &rarr;
                </span>
              </a>
            </li>
          </ul>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

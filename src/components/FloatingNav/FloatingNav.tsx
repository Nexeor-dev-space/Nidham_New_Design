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
 * hero navbar's signature amber button skin so the two stay identical. It hands
 * off from the hero's top nav the instant that nav scrolls out of view (tracked
 * via the `#hero-nav-sentinel` marker), so navigation is always visible. The
 * active section is tracked on scroll and marked with a sliding indicator
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

  // Reveal exactly when the hero's top nav leaves the viewport (seamless handoff).
  useEffect(() => {
    const sentinel = document.getElementById("hero-nav-sentinel");

    if (sentinel && "IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        ([entry]) => setVisible(!entry.isIntersecting),
        { threshold: 0 },
      );
      io.observe(sentinel);
      return () => io.disconnect();
    }

    // Fallback: reveal shortly after scrolling begins.
    const onScroll = () => setVisible(window.scrollY > 120);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

            {/* Register — the pill's primary action. Same signature amber skin
                and shimmer as the hero navbar CTA (so the two never drift), sized
                a touch smaller and pill-shaped to sit inside the nav. Hover adds
                a 1.04 scale and slides the arrow; BUTTON_SKIN carries the colour
                swap, glow and shadow expansion on the shared 350ms curve. */}
            <li>
              <a
                href={REGISTER_CTA.href}
                onClick={(e) => handleClick(e, REGISTER_CTA.href)}
                data-cursor="button"
                className={`group relative inline-flex items-center gap-1.5 overflow-hidden rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] outline-none grain-overlay ${BUTTON_SKIN} motion-safe:hover:scale-[1.04] sm:px-5 sm:py-2.5 sm:text-[13px] sm:tracking-[0.12em]`}
              >
                {/* Soft diagonal light sweep on hover — a sheen, not a flash. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.28)_50%,transparent_70%)] transition-transform duration-[900ms] ease-out group-hover:translate-x-full motion-reduce:hidden"
                />
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

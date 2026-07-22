"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import NavLink from "@/src/components/Nav/NavLink";
import { useActiveSection } from "@/src/hooks/useActiveSection";
import { NAV_LINKS } from "@/src/components/Hero/constants";
import { EASE } from "@/src/lib/motion";
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
 * viewport. It hands off from the hero's top nav the instant that nav scrolls
 * out of view (tracked via the `#hero-nav-sentinel` marker), so navigation is
 * always visible. The active section is tracked on scroll and marked with a
 * sliding indicator (framer-motion `layoutId`). Responsive; keyboard
 * accessible; respects reduced motion.
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
          {/* Same editorial links as the hero navbar, on a light surface. The
              gap is tighter than the navbar's 48–64px: this pill floats over
              content, so it stays compact rather than spanning the viewport. */}
          <ul className="flex items-center gap-7 rounded-full border border-neutral-200/80 bg-white px-7 py-4 shadow-[0_22px_55px_-18px_rgba(0,0,0,0.30)] sm:gap-9 sm:px-9 sm:py-[18px]">
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
          </ul>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

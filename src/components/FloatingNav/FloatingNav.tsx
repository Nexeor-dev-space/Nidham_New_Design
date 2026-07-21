"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import NavLink from "@/src/components/Nav/NavLink";
import { useActiveSection } from "@/src/hooks/useActiveSection";
import { NAV_LINKS } from "@/src/components/Hero/constants";
import { EASE } from "@/src/lib/motion";

/**
 * Section targets — Home plus the shared NAV_LINKS, so this nav and the hero
 * navbar can never drift apart. `id` must match a real element id on the page
 * (Home → hero #top, and each NAV_LINKS href).
 */
const NAV_ITEMS: readonly { id: string; label: string }[] = [
  { id: "top", label: "Home" },
  ...NAV_LINKS.map((link) => ({ id: link.href.replace(/^#/, ""), label: link.label })),
];

const SECTION_IDS = NAV_ITEMS.map((item) => item.id);

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
  const [visible, setVisible] = useState(false);
  const active = useActiveSection(SECTION_IDS, NAV_ITEMS[0].id);

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
    id: string,
  ) => {
    event.preventDefault();
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      return;
    }
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
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
              <li key={item.id}>
                <NavLink
                  href={`#${item.id}`}
                  label={item.label}
                  active={active === item.id}
                  onClick={(e) => handleClick(e, item.id)}
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

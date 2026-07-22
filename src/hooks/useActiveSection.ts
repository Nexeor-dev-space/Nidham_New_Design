"use client";

import { useEffect, useState } from "react";

/**
 * Scroll-spy — returns the id of the last section whose top has crossed the
 * viewport's mid-line, which is what makes a section feel "current" rather than
 * merely on screen.
 *
 * Reads are rAF-coalesced so a burst of scroll events costs one layout read per
 * frame. Ids that are not on the page are skipped, so callers can pass a link
 * list whose targets render conditionally.
 *
 * @param ids     Element ids in document order.
 * @param fallback Returned before any section has been reached (e.g. the hero).
 */
export function useActiveSection(
  ids: readonly string[],
  fallback = "",
): string {
  const [active, setActive] = useState(fallback);

  // `ids` is typically a fresh array each render; key the effect on its
  // contents so it re-subscribes only when the list actually changes.
  const key = ids.join(",");

  useEffect(() => {
    const list = key ? key.split(",") : [];
    let raf = 0;

    const update = () => {
      const mid = window.scrollY + window.innerHeight * 0.5;
      let current = fallback;
      for (const id of list) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= mid) current = id;
      }
      setActive(current);
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [key, fallback]);

  return active;
}

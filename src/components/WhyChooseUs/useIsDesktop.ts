"use client";

import { useEffect, useState } from "react";

/**
 * Tracks whether the viewport is at least `minWidth` px wide. Used to gate the
 * horizontal expand interaction, which only runs on large (pointer) screens —
 * on mobile the cards stack and reveal their descriptions inline instead.
 *
 * Starts `false` so server and first client render agree (no hydration flash);
 * the real value is applied in an effect on the client.
 */
export function useIsDesktop(minWidth = 1024): boolean {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(`(min-width: ${minWidth}px)`);
    const update = () => setIsDesktop(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [minWidth]);

  return isDesktop;
}

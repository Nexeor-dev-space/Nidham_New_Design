"use client";

import { useEffect, useLayoutEffect } from "react";

/**
 * `useLayoutEffect` on the client, `useEffect` on the server — the standard
 * shim that keeps React from warning that layout effects do nothing during SSR.
 *
 * Use this instead of `useEffect` for any effect that lets a library MOVE a
 * React-owned DOM node, and undoes that move in its cleanup. GSAP ScrollTrigger
 * pinning is the case that matters here: `pin: true` creates a `pin-spacer` div,
 * inserts it where the pinned element sat, and re-parents the element inside it.
 * React's fiber tree still believes the element is a child of its original
 * parent.
 *
 * That only stays safe if the un-pin runs before React detaches the subtree, and
 * the two effect types differ on exactly that point. React commits a deletion by
 * walking the doomed subtree, firing *layout* effect cleanups as it goes, and
 * only then calling `removeChild` on the topmost host node. *Passive* (`useEffect`)
 * cleanups are queued and flushed after the commit — so with `useEffect` React
 * removes the node first and GSAP restores it second, and the removal throws
 * `NotFoundError: The object can not be found here` because the node's real
 * parent is the pin-spacer. On a route change that surfaces as a hard crash;
 * a full page load never hits it because nothing unmounts.
 *
 * See useHeroScroll and useAboutScroll — both pin, and both must use this.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

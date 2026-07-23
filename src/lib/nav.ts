import type { MouseEvent } from "react";
import { smoothScrollTo } from "@/src/lib/smoothScroll";

/**
 * One navigation brain shared by every nav surface (hero Navbar, mobile drawer,
 * FloatingNav) so they can never drift apart, and so the same link behaves
 * correctly whether it targets a section or a route, and whether or not the
 * homepage is currently mounted.
 *
 * Three cases, resolved from the `href` alone:
 *
 *  1. Route link  (`/services`)         → client-side navigate to that route.
 *  2. Section link (`#events`, `#top`)  → on the homepage, smooth-scroll to the
 *     element (the original homepage behaviour, unchanged). On any other route
 *     the section lives on the homepage, so route to `/#events` (or `/` for the
 *     top/home sentinel) and let the browser settle on the anchor.
 *
 * The homepage path is byte-for-byte the old smooth-scroll, so the homepage nav
 * feels exactly as before; only off-homepage and route links add new behaviour.
 */
export function navigateTo(
  event: MouseEvent<HTMLAnchorElement>,
  href: string,
  router: { push: (href: string) => void },
  pathname: string,
  reduce: boolean,
  onDone?: () => void,
): void {
  // 1. Route link (anything starting with "/" that is not a bare hash).
  if (href.startsWith("/")) {
    event.preventDefault();
    router.push(href);
    onDone?.();
    return;
  }

  const id = href.replace(/^#/, "");
  const isTop = id === "top" || id === "";

  // 2. Section link, but we are not on the homepage where the section lives.
  if (pathname !== "/") {
    event.preventDefault();
    router.push(isTop ? "/" : `/#${id}`);
    onDone?.();
    return;
  }

  // 3. Section link on the homepage — smooth-scroll, routed through Lenis when
  // it is running so the jump shares the wheel's eased momentum (and native
  // otherwise, including under reduced motion).
  event.preventDefault();
  if (isTop) {
    smoothScrollTo(0, { immediate: reduce });
  } else {
    smoothScrollTo(id, { immediate: reduce });
  }
  onDone?.();
}

/**
 * Same-page smooth scroll to an element id (used by in-page affordances like the
 * service rows' "Explore", which target the footer's `#contact` on whatever page
 * they're rendered on). Falls back to a no-op if the target isn't present.
 */
export function scrollToId(id: string, reduce = false): void {
  smoothScrollTo(id, { immediate: reduce });
}

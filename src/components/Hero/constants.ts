import type { NavLink, HeroSlide } from "./types";

/** Brand logo shown in the navigation bar. */
export const LOGO = {
  src: "/images/logo.png",
  alt: "Nidham Consultancy LLC",
  width: 200,
  height: 77,
} as const;

/** Primary navigation links (left of the logo). */
export const NAV_LINKS: readonly NavLink[] = [
  { label: "Service", href: "#service" },
  { label: "Contact", href: "#contact" },
] as const;

/** Register call-to-action shown on the right of the navbar. */
export const REGISTER_CTA = {
  label: "Register",
  href: "#register",
} as const;

/** Announcement bar copy + registration CTA. */
export const ANNOUNCEMENT = {
  emoji: "\u{1F4C5}",
  cta: { label: "Reserve Your Seat", href: "#register" },
  message: "Now Registering: Dance Competition Forum 2026",
} as const;

/**
 * Target datetime the announcement-bar countdown ticks down to (ISO 8601).
 * Update this to the real event date/time.
 */
export const EVENT_DATE = "2026-07-25T00:13:00Z";

/**
 * Hero carousel slides. Swap the `src` values for the final artwork; keep
 * descriptive `alt` text for accessibility.
 */
export const HERO_SLIDES: readonly HeroSlide[] = [
  {
    src: "/images/hero/banner-1.jpg",
    alt: "Live band and vocalist performing on stage under purple lighting",
  },
  {
    src: "/images/hero/banner-2.jpg",
    alt: "Hosts and guests speaking on stage during a media event",
  },
  {
    src: "/images/hero/banner-3.webp",
    alt: "Vocalist performing energetically with a live band behind",
  },
  {
    src: "/images/hero/banner-4.jpg",
    alt: "Audience filming a concert on their phones amid stage lights",
  },
] as const;

/** Carousel timing configuration. */
export const CAROUSEL_AUTOPLAY_MS = 5000;
export const CAROUSEL_FADE_MS = 800;

/** Minimum horizontal travel (px) to register a swipe on touch devices. */
export const SWIPE_THRESHOLD = 50;

import type { NavLink, HeroSlide } from "./types";

/**
 * Brand logo shown in the navigation bar (desktop nav + mobile drawer).
 *
 * `width`/`height` must stay the file's true pixel size. The nav renders it at a
 * fixed CSS width with `h-auto`, so the browser derives the height from *these*
 * numbers, not from the file — if they disagree with the asset, the logo is
 * silently stretched to fit.
 *
 * This points at the *trimmed* asset, not the raw `new-nidham-logo.png`. The raw
 * export is 1536×1024 with the mark filling only 32% of the height, so any width
 * the nav sets is mostly transparent padding — the logo reads far smaller than
 * its box and inflates the nav's height for nothing. The trimmed file is that
 * export cropped to the alpha bounding box plus an even 16px margin, which is
 * why the aspect is ~3.57:1 and the CSS width now maps to visible logo.
 */
export const LOGO = {
  src: "/images/new-nidham-logo-trimmed.png",
  alt: "Nidham Consultancy LLC",
  width: 1290,
  height: 361,
} as const;

/**
 * Primary navigation links. Two kinds of `href`:
 *   • a route (`/services`) → navigates to that page (its own premium page).
 *   • a hash (`#events` → CorporateEvents, `#contact` → Footer) → smooth-scrolls
 *     to that section on the homepage (or routes back to it from another page).
 * All nav surfaces (hero Navbar, mobile drawer, FloatingNav) derive from this
 * list and route through src/lib/nav.ts, so adding a link here surfaces it
 * everywhere with correct behaviour — add the target (route or id) first.
 */
export const NAV_LINKS: readonly NavLink[] = [
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
  // "Events" is intentionally omitted while there is a single featured event on
  // the home page (no listing to browse). The /events route and page remain in
  // the project — restore this link when more events are added.
] as const;

/** Register call-to-action shown on the right of the navbar — the dedicated
 *  registration page (its own premium onboarding experience). */
export const REGISTER_CTA = {
  label: "Register",
  href: "/register",
} as const;

/** Announcement bar copy + registration CTA (routes to the register page). */
export const ANNOUNCEMENT = {
  emoji: "\u{1F4C5}",
  cta: { label: "Reserve Your Seat", href: "/register" },
  message: "Now Registering: Dance Competition Forum 2026",
} as const;

/**
 * Target datetime both countdowns tick down to (ISO 8601) — the announcement
 * ribbon and the featured event's CountdownCard, via `EVENTS_DATE`.
 *
 * This is a *fixed* instant, so the displayed remainder shrinks in real time:
 * set 20 days out from 2026-07-30, it will read 20 days only on that date.
 * Update it to the real event datetime.
 */
export const EVENT_DATE = "2026-08-19T18:00:00Z";

/**
 * The homepage hero's background film — the page's primary visual, played
 * full-screen behind the tagline. Muted, looping and decorative, so it carries
 * no audio track worth exposing and needs no captions; `alt` describes it for
 * assistive tech only.
 */
export const HERO_VIDEO = {
  src: "/video/nidham-banner-video.mp4",
  type: "video/mp4",
  alt: "Nidham event highlights",
} as const;

/**
 * The hero tagline — the *only* copy over the film, set on a single line.
 *
 * Exactly two words, by design: the pair emerges as one held beat, and a third
 * would turn that beat into a sentence the viewer has to read. Two words is
 * also what lets the line stay unbroken down to a 320px screen; anything longer
 * would wrap and lose the composition. If this ever needs more, it belongs in a
 * section below the hero, not here.
 */
export const HERO_TAGLINE_TEXT = "Imagine More";

/**
 * Hero reveal choreography — one scrubbed timeline (see useHeroReveal), so
 * scroll position is the playhead and the exit is literally the entrance read
 * backwards.
 *
 * The positions below are *timeline seconds*, but under a scrub what they
 * really express is each beat's share of the pin distance.
 *
 * **The two tweens overlap, and that is the point.** Running them back to back
 * — tagline, then a gap, then CTA — makes a lovely descent and a broken ascent:
 * the tagline's tween finishes in the middle of the timeline, so scrolling back
 * up leaves the largest element on screen frozen for the whole last third of
 * the pin before anything touches it. Measured on a laptop that was 348px of
 * motionless "Imagine More" *inside* the pin, on top of the ~720px the hero
 * spends un-pinned and re-entering the viewport — a full thousand pixels of
 * scrolling up with nothing moving, which is exactly the reported complaint.
 *
 * Overlapping them so both *land* at progress 1 fixes the ascent without
 * costing anything on the descent: the CTA still starts well after the tagline
 * (so the sequence still reads), the two simply settle together instead of one
 * waiting for the other to finish. Scrolling up, both start sinking at once.
 */
export const HERO_REVEAL = {
  /**
   * The opening hold: the film alone, before anything begins to appear.
   *
   * Read it from the *reverse* direction and it is the more important number —
   * it is the stretch of pin over which the copy is already completely gone but
   * the hero has not yet unpinned, which is what lets the exit land instead of
   * being cut off by the section scrolling away.
   */
  leadIn: 0.4,
  /** Where the tagline's rise begins, and how long it runs. */
  taglineDuration: 1.1,
  /**
   * Where the CTA's rise begins — an absolute position, not an offset from the
   * tagline's end. It lands at 1.6, the same instant the tagline does.
   */
  ctaStart: 0.75,
  ctaDuration: 0.85,

  /**
   * How far the tagline and CTA travel up into place, in px. One distance for
   * both: the offset start is what makes them read as a sequence, so different
   * throws would only make the pair look mismatched. Not scaled per breakpoint
   * either — the block sits low in the frame, so the full travel stays inside
   * the composition even on the shortest phone.
   */
  rise: 80,
  /** Starting blur, in px — the same for both, so their motion is identical. */
  blur: 12,
  /** Starting scale. A very slight shrink — enough to read as depth, far short
   *  of anything that looks like a zoom. */
  scaleFrom: 0.98,
} as const;

/**
 * The timeline's length — the later of the two tweens' end points, since they
 * overlap. Nothing follows it: a hold at the *end* of a scrubbed timeline is
 * dead scroll on the way back up, a threshold to cross before the exit
 * responds.
 *
 * At the current values that is 1.6, which over the pin works out as roughly:
 * 25% opening hold, tagline running 25%→94%, CTA running 47%→100%.
 *
 * Exported for reasoning about the shape, not consumed by the hook — GSAP
 * derives the same number from the tweens it is given.
 */
export const HERO_REVEAL_TOTAL = Math.max(
  HERO_REVEAL.leadIn + HERO_REVEAL.taglineDuration,
  HERO_REVEAL.ctaStart + HERO_REVEAL.ctaDuration,
);


/**
 * How far the hero stays pinned, as a multiple of viewport height.
 *
 * The brief specifies the pin in seconds; a pin is measured in pixels. These
 * multipliers are that translation, at roughly one viewport of deliberate
 * scrolling per second — so desktop's 1.7 is the ~2–3s asked for, and mobile's
 * 0.9 is the shorter ~1.5–2s, where a long pin reads as a broken page rather
 * than as drama.
 */
export const HERO_PIN_FACTOR = {
  desktop: 1.7,
  laptop: 1.45,
  tablet: 1.15,
  mobile: 0.9,
} as const;

/** Seconds before the sound control fades in — it belongs to Stage 1, so it is
 *  available while the film plays alone, just not instantly. */
export const VOLUME_DELAY = 1.2;

/**
 * The hero's single call to action — a plain underline link, not the site's
 * brand-pink `BUTTON_SKIN`. That skin is the page's one *primary* action
 * (Register, in the navbar directly above this); a second filled or outlined
 * button a few hundred pixels below it would split the emphasis and read as a
 * competing CTA rather than a quiet "keep going" prompt.
 */
export const HERO_CTA = {
  label: "Discover",
  href: "/services",
} as const;

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

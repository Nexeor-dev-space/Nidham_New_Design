import type { AboutMedia, AboutStat } from "./types";

/**
 * Default About-section content. Everything is overridable via props — these
 * are only the sensible defaults for the Nidham home page.
 */
export const ABOUT_SUBTITLE = "About Nidham";

/**
 * One entry per rendered line, and one stagger step in the reveal.
 *
 * The break falls before the ampersand rather than after it: ending a line on
 * a dangling "&" separates the conjunction from what it joins, and this split
 * also balances the two measures much more evenly (13.3em against 11.9em,
 * versus 14.2em against 11.0em the other way).
 *
 * This is a desktop composition. The longer line is ~13.3em, so below roughly
 * 700px it cannot fit the container at any size a display heading can be set
 * in, and the browser re-wraps each entry inside its own row — two authored
 * lines reading as three or four on a phone. That is the intended degradation:
 * the reveal still staggers per authored line, only the measure changes.
 */
export const ABOUT_TITLE_LINES = [
  "Where Entertainment, Technology",
  "& Human Creativity Converge.",
] as const;

/**
 * The existing About copy, unchanged in substance and split at its own natural
 * sentence break for readability. The source ran the two sentences together
 * with no space ("…in the UAE.Within a short time…"); that is repaired here.
 */
export const ABOUT_PARAGRAPHS = [
  "Welcome to Nidham Consultancy, a leading name in event management, artist & influencer management, and branding solutions in the UAE.",
  "Within a short time, we’ve built a reputation for delivering creative, flawless, and unforgettable experiences across various events, from corporate functions to entertainment spectacles.",
] as const;

/** The statistics row. `value: null` opts a figure out of the count-up. */
export const ABOUT_STATS: readonly AboutStat[] = [
  { value: 12, suffix: "+", label: "Years" },
  { value: 6, suffix: "+", label: "Business Verticals" },
  { value: null, display: "Global", label: "USA • UAE • India" },
] as const;

export const ABOUT_BUTTON_TEXT = "Explore Our Services";

export const ABOUT_BUTTON_LINK = "/services";

/**
 * The centrepiece showreel. Plays muted and loops, and only once scrolled into
 * view (see AboutSection) — it is a multi-MB file well below the fold, so it
 * must not compete with the hero video for bandwidth on first paint.
 */
export const ABOUT_MEDIA: AboutMedia = {
  src: "/video/youtube-bg-1.mp4",
  alt: "Fireworks over the Dubai skyline at a Nidham event",
};

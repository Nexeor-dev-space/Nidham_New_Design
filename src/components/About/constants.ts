import type { AboutMedia } from "./types";

/**
 * Default About-section content. Everything is overridable via props — these
 * are only the sensible defaults for the Nidham home page.
 */
export const ABOUT_SUBTITLE = "About Us";

export const ABOUT_TITLE = "We love what we do";

export const ABOUT_DESCRIPTION =
  "Welcome to Nidham Consultancy, a leading name in event management, artist & influencer management, and branding solutions in the UAE.Within a short time, we’ve built a reputation for delivering creative, flawless, and unforgettable experiences across various events, from corporate functions to entertainment spectacles.";

export const ABOUT_BUTTON_TEXT = "View Our Services";

export const ABOUT_BUTTON_LINK = "/services";

/**
 * Left-column showreel. Plays muted and loops, and only once scrolled into view
 * (see AboutSection) — it is a multi-MB file well below the fold, so it must not
 * compete with the hero video for bandwidth on first paint.
 */
export const ABOUT_MEDIA: AboutMedia = {
  src: "/video/youtub-bg-3.mp4",
  alt: "Showreel of Nidham Consultancy events",
};

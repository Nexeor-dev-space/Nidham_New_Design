import type { AboutImage } from "./types";

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
 * Placeholder team photo lives in `public/images/about/`. Swap `team.jpg` for
 * the official on-stage team shot — the container keeps the design's ratio.
 */
export const ABOUT_IMAGE: AboutImage = {
  src: "/images/about/team.jpg",
  alt: "The Nidham Consultancy team on stage at a live event",
  width: 986,
  height: 842,
};

import type { Feature } from "./types";

/** Default heading — overridable via props. */
export const WHY_CHOOSE_US_TITLE = "Why Choose Us";

/**
 * Default feature cards for the Nidham home page. The artwork lives in
 * `public/images/why-choose-us/` and is shared with the Events and Services
 * pages, so replacing a file there changes it in all three — keep the `alt`
 * strings here (and the gallery ones in EventsPage/constants) in step with
 * whatever the images actually depict.
 *
 * The cards crop to a fixed aspect via `object-cover`, so source dimensions do
 * not have to match each other; the layout keeps the Figma proportions
 * regardless.
 *
 * `weight` reproduces the Figma's resting composition (the middle card is wider
 * than the two flanking cards).
 */
export const WHY_CHOOSE_US_FEATURES: readonly Feature[] = [
  {
    id: "execution",
    title: "Execution",
    description:
      "Creative, full-service event solutions with flawless execution.",
    image: {
      src: "/images/why-choose-us/execution.jpg",
      alt: "Long-exposure streaks of red, green and blue light running in parallel",
    },
    cursorLabel: "Explore",
    weight: 1,
  },
  {
    id: "talent",
    title: "Talent",
    description: "Access to top artists, influencers, and performers.",
    image: {
      src: "/images/why-choose-us/talent.jpg",
      alt: "Figures moving through a hall washed in saturated stage colour",
    },
    cursorLabel: "Discover",
    weight: 1.6,
  },
  {
    id: "expertise",
    title: "Expertise",
    description: "Strong industry expertise and global connections.",
    image: {
      src: "/images/why-choose-us/expertise.jpg",
      alt: "Loops of light painted against a night sky in a long exposure",
    },
    cursorLabel: "Read More",
    weight: 1,
  },
] as const;

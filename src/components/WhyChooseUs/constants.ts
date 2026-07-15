import type { Feature } from "./types";

/** Default heading — overridable via props. */
export const WHY_CHOOSE_US_TITLE = "Why Choose Us";

/**
 * Default feature cards for the Nidham home page. Placeholder renders live in
 * `public/images/why-choose-us/` — swap them for the final Execution / Talent /
 * Expertise artwork; the layout keeps the Figma proportions regardless.
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
      alt: "Sculptural glass and metal forms representing precise execution",
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
      alt: "Vivid arrangement of coloured glass shards representing creative talent",
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
      alt: "Row of glass spheres framed by architectural planes representing expertise",
    },
    cursorLabel: "Read More",
    weight: 1,
  },
] as const;

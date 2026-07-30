/**
 * Melody Dreamz case-study data shapes. Content lives in constants.ts and is
 * verbatim from the page this replaces — see the note there.
 */

/** One alternating image + text block in the story. */
export interface StoryBlock {
  id: string;
  heading: string;
  text: string;
  image: string;
  imageAlt: string;
  /** Which side the photograph sits on at `lg`. Drives the page's rhythm. */
  side: "left" | "right";
}

/** One numbered highlight card. */
export interface Highlight {
  id: string;
  title: string;
  text: string;
}

/**
 * One statistic card. Either `count` (animated by a scroll-triggered counter) or
 * `display` (a static string) — never both. `display` exists so a card can show
 * a venue or category without a number being invented for it.
 */
export interface StatCard {
  id: string;
  label: string;
  count?: number;
  suffix?: string;
  display?: string;
}

/**
 * One gallery photograph, with its slot in the composition.
 *
 * `col` and `height` are Tailwind class strings rather than semantic tokens
 * because this is a bespoke five-image composition, not a generic grid — the
 * slots are assigned from each file's real pixel ratio (see constants.ts), so
 * expressing them as "half"/"third" would hide the one thing that matters.
 *
 * Every row's plates share the same `height`, which is what makes the rows
 * align. Changing one plate's height without its row-mate's is what produces a
 * ragged edge.
 */
export interface GalleryPlate {
  src: string;
  alt: string;
  /** Column span on the 12-col bed at `lg`, plus the 2-col span at `md`. */
  col: string;
  /** Shared row height. Row-mates must match. */
  height: string;
}

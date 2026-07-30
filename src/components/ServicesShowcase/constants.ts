import { SERVICES } from "@/src/components/Services/constants";
import type { ShowcaseTile } from "./types";

/**
 * The homepage services gallery — derived from the Services page's `SERVICES`
 * list, never re-declared. Titles and imagery therefore cannot drift between
 * the two surfaces: change a service in Services/constants.ts and it changes
 * here too.
 *
 * The layout is two rows — three tiles, then two — so the split below is by
 * position, not by identity. If a sixth service is ever added it lands in the
 * bottom row automatically and that row's proportions (see BOTTOM_ROW_GROW)
 * would need revisiting; five is the shape this composition is designed for.
 */
const TOP_ROW_COUNT = 3;

/**
 * `sizes` per tile, so the optimizer is asked for roughly the pixels each tile
 * actually gets rather than a full-width image for all five. The desktop bound
 * is 60vw: a tile is 22–56% of the container while its neighbours are hovered,
 * and 60vw covers the widest of those plus the container's own gutters.
 */
const SIZES_DEFAULT = "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 60vw";
/** The third tile spans both columns at tablet, so it needs the full width there. */
const SIZES_WIDE_ON_TABLET = "(max-width: 1023px) 100vw, 60vw";

export const SHOWCASE_TOP: readonly ShowcaseTile[] = SERVICES.slice(
  0,
  TOP_ROW_COUNT,
).map((service, i) => ({
  id: service.id,
  title: service.title,
  image: service.image,
  // The last of the three fills the tablet row on its own, so the 2-column
  // layout never leaves a hole where a third column would be.
  spanOnTablet: i === TOP_ROW_COUNT - 1,
  sizes: i === TOP_ROW_COUNT - 1 ? SIZES_WIDE_ON_TABLET : SIZES_DEFAULT,
}));

export const SHOWCASE_BOTTOM: readonly ShowcaseTile[] = SERVICES.slice(
  TOP_ROW_COUNT,
).map((service) => ({
  id: service.id,
  title: service.title,
  image: service.image,
  spanOnTablet: false,
  sizes: SIZES_DEFAULT,
}));

/**
 * Top row proportions, expressed as `flex-grow` values against `flex-basis: 0`
 * — so each tile's width is simply its share of the total grow.
 *
 * At rest all three are equal (33/33/33). Hovering one takes it to 56% and
 * leaves 22% each for its neighbours, which is where 2.5455 comes from:
 *
 *     grow / (grow + 1 + 1) = 0.56   ⇒   grow = 2·0.56 / (1 − 0.56) = 2.5455
 *
 * Deriving it rather than hard-coding three widths is what keeps the row
 * summing to exactly 100% with no rounding gap, at any container width.
 */
export const TOP_ROW_GROW = { rest: 1, expanded: 2.5455 } as const;

/**
 * Bottom row proportions — 65/35, and hovering either tile gives *that* tile
 * the 65. Hovering the already-large tile is therefore a no-op rather than a
 * further expansion, which is what stops the row from lurching when the pointer
 * crosses it on the way to something else.
 */
export const BOTTOM_ROW_GROW = { major: 65, minor: 35 } as const;

/** Where a tile leads. No per-service anchors exist on the services page, so
 *  every tile opens the page itself. */
export const SHOWCASE_HREF = "/services";

/**
 * Reveal choreography (see useServicesReveal). Seconds and pixels.
 *
 * The three durations overlap on purpose: the image runs longer than its frame
 * so the photograph is still settling as the panel finishes arriving, and the
 * title starts `titleDelay` after both so it reads as the last thing to land.
 */
export const SHOWCASE_REVEAL = {
  /** Panel frame: opacity, rise and blur. */
  duration: 1.1,
  rise: 80,
  blur: 12,
  /** Photograph: a longer, slower settle out of an over-scale. */
  imageDuration: 1.4,
  imageScale: 1.12,
  /** Starting opacity of the reveal-only dimmer, which lifts to 0. */
  dimFrom: 0.55,
  /** Title, held back behind its own image. */
  titleDuration: 0.9,
  titleDelay: 0.15,
  titleRise: 20,
  titleBlur: 6,
  /** Gap between consecutive panels in the cascade. */
  stagger: 0.1,
} as const;

/**
 * Scrubbed parallax travel per row, in px — the bottom row moves further than
 * the top, and that difference is the whole effect. Equal values would read as
 * the section sliding rather than as depth between the two rows.
 */
export const SHOWCASE_PARALLAX = { topRow: 20, bottomRow: 35 } as const;

/** The width-expansion interaction is desktop-only; below this the tiles use
 *  zoom + overlay alone (see ServicesShowcase). */
export const SHOWCASE_EXPAND_MIN_WIDTH = 1024;

/**
 * One panel in the homepage services gallery.
 *
 * Deliberately narrower than the Services page's `Service`: this surface shows
 * a name over a photograph and nothing else, so it carries no description,
 * index or note. Built from `SERVICES` in constants.ts rather than authored
 * separately — see the note there about the two surfaces not drifting.
 */
export interface ShowcaseTile {
  /** Stable id from the services list — used as the React key and hover key. */
  id: string;
  /** Service name. The only copy on the panel. */
  title: string;
  /** Background photograph, from the services list. */
  image: string;
  /** Whether this tile spans both columns in the tablet layout. */
  spanOnTablet: boolean;
  /** `sizes` for next/image — see constants.ts for how these are chosen. */
  sizes: string;
}

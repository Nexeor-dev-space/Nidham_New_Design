/**
 * A single service in the editorial list. All copy is verbatim from the live
 * Nidham services page (nidham.ae/services) — do not rewrite it here.
 */
export interface Service {
  /** Stable id (used for keys + the floating-preview crossfade). */
  id: string;
  /** Two-digit ordinal shown at the left of the row, e.g. "01". */
  index: string;
  /** Service title, verbatim. */
  title: string;
  /** Service description / subtitle, verbatim. */
  description: string;
  /** Optional extra line shown beneath the description (verbatim). */
  note?: string;
  /** Portrait image revealed as the floating preview on desktop hover. */
  image: string;
  /** Accessible description of the preview image. */
  imageAlt: string;
}

/**
 * Social-proof data shapes — client testimonials + the trusted-by logo row.
 * Content lives in constants.ts; every field here is placeholder-ready so the
 * client can swap copy without touching the components.
 */

/** A single client testimonial shown in the carousel. */
export interface Testimonial {
  /** Stable unique key. */
  id: string;
  /** The quote body (no surrounding quotation marks — the card draws its own). */
  quote: string;
  /** Client's full name — also drives the monogram avatar initials. */
  name: string;
  /** Client's role/title. Optional. */
  position?: string;
  /** Client's company / organisation. */
  company: string;
  /** White-on-transparent company logo path (from the shared logo set). */
  logo?: string;
  /** Intrinsic logo size, so next/image keeps the true aspect ratio. */
  logoWidth?: number;
  logoHeight?: number;
}

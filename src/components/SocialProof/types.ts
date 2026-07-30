/**
 * Social-proof data shapes — client testimonials + the trusted-by logo row.
 * Content lives in constants.ts; every field here is placeholder-ready so the
 * client can swap copy without touching the components.
 */

/**
 * A single client testimonial shown in the carousel.
 *
 * Attribution is the name alone — no role, employer or logo. The card is built
 * to put the quote first, and a title/company line plus a brand mark turned the
 * footer into three competing attributions. The trusted-by wall
 * (see PartnersSection) is where company marks belong.
 */
export interface Testimonial {
  /** Stable unique key. */
  id: string;
  /** The quote body (no surrounding quotation marks — the card draws its own). */
  quote: string;
  /** Client's full name — also drives the monogram avatar initials. */
  name: string;
}

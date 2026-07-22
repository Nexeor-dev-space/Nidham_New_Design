/**
 * Types for the /events page content. All copy is realistic *sample* content
 * (the live site has no events page yet), authored to match Nidham's services
 * and brand — kept in constants.ts as the single source of truth.
 */

/** A hero/featured event shown in the alternating editorial showcase. */
export interface FeaturedEvent {
  id: string;
  title: string;
  category: string;
  location: string;
  date: string;
  description: string;
  /** CTA label for the row (destination is the in-page contact/footer). */
  cta: string;
  image: string;
  imageAlt: string;
}

/** A service/event category, rendered as an editorial text block. */
export interface CategoryItem {
  id: string;
  name: string;
  /** One-line descriptor shown beside/under the name. */
  blurb: string;
}

/** An entry on the upcoming-events vertical timeline. */
export interface TimelineItem {
  id: string;
  date: string;
  location: string;
  name: string;
  description: string;
  /** e.g. "Registration Open", "Invitation Only", "Coming Soon". */
  status: string;
}

/** A gallery image with a masonry span hint. */
export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  /** Tailwind row/col emphasis: "wide" | "tall" | "regular". */
  span: "wide" | "tall" | "regular";
}

/**
 * A single event in the editorial filtering portfolio (the redesigned page).
 * `category` matches exactly one {@link EVENT_FILTERS} entry (excluding "All").
 */
export interface PortfolioEvent {
  id: string;
  /** One of EVENT_FILTERS (not "All"). Drives filtering + the meta label. */
  category: string;
  title: string;
  location: string;
  year: string;
  description: string;
  image: string;
  imageAlt: string;
  /** Masonry emphasis — varies the item's aspect ratio. */
  span: "wide" | "tall" | "regular";
  /** Optional looping video; when present it plays over the image poster. */
  video?: string;
}

/** An animated statistic. */
export interface StatItem {
  id: string;
  value: number;
  suffix: string;
  label: string;
}

/** A single editorial testimonial. */
export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
}

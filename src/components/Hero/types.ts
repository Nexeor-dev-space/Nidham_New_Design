/** A single primary navigation entry. */
export interface NavLink {
  label: string;
  href: string;
}

/** A single slide in the hero carousel. */
export interface HeroSlide {
  src: string;
  alt: string;
}

/** Remaining time broken into padded, display-ready parts. */
export interface TimeLeft {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

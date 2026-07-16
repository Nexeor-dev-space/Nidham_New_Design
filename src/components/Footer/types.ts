/** A single footer link. */
export interface FooterLink {
  /** Visible label. */
  label: string;
  /** Destination (route, tel:, mailto: or external URL). */
  href: string;
  /** Set for off-site links so they open in a new tab with rel safety. */
  external?: boolean;
}

/** Content-driven props for {@link Footer}. Everything has a sensible default. */
export interface FooterProps {
  /** Left column — site navigation. */
  nav?: readonly FooterLink[];
  /** Right column — social profiles. */
  socials?: readonly FooterLink[];
  /** Bottom-right legal links. */
  legal?: readonly FooterLink[];
  /** Center column heading. */
  visionHeading?: string;
  /** Center column supporting paragraph. */
  visionText?: string;
  /** Center column call-to-action. */
  cta?: FooterLink;
  /** Bottom-left copyright line. */
  copyright?: string;
}

/** A single partner/brand shown in the marquee. */
export interface Partner {
  /** Stable unique key. */
  id: string;
  /** Accessible name — used for the logo's alt text. */
  name: string;
  /** Path (or import) to the logo image. */
  logo: string;
}

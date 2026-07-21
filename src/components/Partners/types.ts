/** A single partner/brand shown in the logo wall. */
export interface Partner {
  /** Stable unique key. */
  id: string;
  /** Accessible name — used for the logo's alt text. */
  name: string;
  /** Path to the logo image. SVG preferred. */
  logo: string;
  /**
   * The asset's intrinsic size — its viewBox extent, cropped tight to the
   * artwork. These feed next/image so the browser derives the true aspect
   * ratio, letting `h-[…] w-auto` normalise every logo to the same *optical*
   * height with no stretching.
   *
   * Because the wall normalises height, a logo renders at (aspect × height).
   * Artwork with slack padding inside its viewBox would render visually short
   * and overly wide, so crop new assets tight — see the note in constants.ts.
   */
  width: number;
  height: number;
}

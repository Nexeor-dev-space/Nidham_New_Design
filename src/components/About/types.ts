/** Image shown in the left column of the About section. */
export interface AboutImage {
  /** Path (or import) to the image. */
  src: string;
  /** Accessible description — used for the image's alt text. */
  alt: string;
  /** Intrinsic width in px (aspect-ratio hint). */
  width: number;
  /** Intrinsic height in px (aspect-ratio hint). */
  height: number;
}

/** Content-driven props for {@link AboutSection}. Nothing is hardcoded. */
export interface AboutSectionProps {
  /** Small uppercase eyebrow rendered inside parentheses, e.g. "About Us". */
  subtitle?: string;
  /** Large heading. Use "\n" to split it into staggered lines. */
  title?: string;
  /** Description paragraph. */
  description?: string;
  /** CTA button label. */
  buttonText?: string;
  /** CTA destination. */
  buttonLink?: string;
  /** Left-column image. */
  image?: AboutImage;
}

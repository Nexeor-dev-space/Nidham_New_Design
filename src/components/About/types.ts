/**
 * Media shown in the left column of the About section.
 *
 * No width/height: the column's aspect ratio is fixed by the `aspect-[986/842]`
 * container in AboutSection and the media is object-cover'd into it, so
 * intrinsic dimensions were never read.
 */
export interface AboutMedia {
  /** Path to the video file. */
  src: string;
  /** Accessible description of what the footage shows. */
  alt: string;
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
  /** Left-column media. */
  media?: AboutMedia;
}

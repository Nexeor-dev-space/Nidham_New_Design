/**
 * The About section's centrepiece video.
 *
 * No width/height: the frame owns a fixed aspect ratio and the footage is
 * object-cover'd into it, so intrinsic dimensions are never read.
 */
export interface AboutMedia {
  /** Path to the video file. */
  src: string;
  /** Accessible description of what the footage shows. */
  alt: string;
}

/**
 * One figure in the statistics row.
 *
 * `value` drives the count-up. A stat that is not a number (e.g. "Global")
 * sets `value: null` and supplies `display` instead — it renders identically
 * but is skipped by the counting animation, since there is nothing to count
 * toward and a half-rendered word reads as a glitch rather than a reveal.
 */
export interface AboutStat {
  /** Numeric target for the count-up, or null for a non-numeric figure. */
  value: number | null;
  /** Rendered verbatim when `value` is null. */
  display?: string;
  /** Appended after the number, outside the animated node (e.g. "+"). */
  suffix?: string;
  /** Caption beneath the figure. */
  label: string;
}

/** Content-driven props for {@link AboutSection}. Nothing is hardcoded. */
export interface AboutSectionProps {
  /** Small uppercase eyebrow rendered inside parentheses. */
  subtitle?: string;
  /**
   * The display headline, authored as one line per array entry so the
   * line-by-line reveal is driven by the intended composition rather than by
   * wherever the browser happens to wrap.
   */
  titleLines?: readonly string[];
  /** Intro copy, one entry per paragraph. */
  paragraphs?: readonly string[];
  /** The animated statistics row. */
  stats?: readonly AboutStat[];
  /** CTA button label. */
  buttonText?: string;
  /** CTA destination. */
  buttonLink?: string;
  /** The centrepiece video. */
  media?: AboutMedia;
}

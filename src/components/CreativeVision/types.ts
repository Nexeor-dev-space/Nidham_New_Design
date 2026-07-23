export interface CreativeVisionSectionProps {
  /** Small uppercase label above the heading. Omitted in the Figma. */
  label?: string;
  /**
   * The editorial heading. Pass a `string[]` to control the exact line breaks
   * used by the line-by-line reveal (the Figma composes three lines); a plain
   * string is treated as a single line.
   */
  title?: string | string[];
  /** Supporting paragraph under the heading. Omitted in the Figma. */
  description?: string;
  /** Background video source (full-bleed, object-cover, muted + looping). */
  video?: string;
  /** Poster still shown before playback and whenever autoplay is refused. */
  poster?: string;
  /** CTA label. When omitted, no button renders. */
  buttonText?: string;
  /** CTA destination. */
  buttonLink?: string;
  /** Optional element id for deep-linking. */
  id?: string;
}

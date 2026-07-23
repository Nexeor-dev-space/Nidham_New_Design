/**
 * Default content for the Creative Vision banner. The heading is authored as
 * an array so the three-line composition from the Figma drives the line-by-line
 * reveal directly (rather than depending on where the browser happens to wrap).
 */
export const CREATIVE_VISION_TITLE: string[] = [
  "We turn creative vision into",
  "extraordinary experiences that inspire,",
  "engage, and leave a lasting impression.",
];

/** Full-bleed background footage for the banner. */
export const CREATIVE_VISION_VIDEO = "/video/youtube-bg.mp4";

/**
 * First-frame still. Carries the banner until the footage is decodable, and
 * remains the background outright wherever autoplay is refused or reduced
 * motion pauses playback — so it should stay visually close to the video's
 * opening frame rather than being any pleasant image.
 */
export const CREATIVE_VISION_POSTER = "/images/creative-vision-poster.jpg";

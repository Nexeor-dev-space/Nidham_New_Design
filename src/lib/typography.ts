/**
 * Typography design system — single source of truth.
 *
 * `SECTION_HEADING` is the one and only style for every main <h2> section
 * heading across the site. It mirrors the reference heading
 * ("For brands that create experiences people never forget.") exactly:
 *   • font family  — DM Sans (var(--font-dm-sans))
 *   • weight       — normal (400)
 *   • size         — clamp(1.85rem, 4.6vw, 3.5rem) responsive scaling
 *   • line-height  — 1.12
 *   • letter-space — -0.02em
 *   • colour       — neutral-900
 *   • width / wrap — centered, max-w-4xl, natural wrapping
 *
 * Only the text content should change between sections. Apply this to the
 * heading element itself; add a leading `mt-6` where an eyebrow sits directly
 * above (see SECTION_HEADING_GAP) so the spacing above the heading is uniform.
 */
export const SECTION_HEADING =
  "mx-auto max-w-4xl text-center font-[family-name:var(--font-dm-sans)] text-[clamp(1.85rem,4.6vw,3.5rem)] font-normal leading-[1.12] tracking-[-0.02em] text-neutral-900";

/** Uniform gap between an eyebrow label and the heading below it. */
export const SECTION_HEADING_GAP = "mt-6";

/** Uniform gap between the heading and the first block of content below it. */
export const SECTION_CONTENT_GAP = "mt-14 sm:mt-16 lg:mt-20";

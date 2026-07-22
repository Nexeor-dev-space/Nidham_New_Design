/**
 * Typography design system — single source of truth.
 *
 * Display type (this file) is Cabinet Grotesk; everything else inherits
 * Switzer from `body`. Both are loaded in src/lib/fonts.ts.
 *
 * `SECTION_HEADING` is the one and only style for every main <h2> section
 * heading across the site. It mirrors the reference heading
 * ("For brands that create experiences people never forget.") exactly:
 *   • font family  — Cabinet Grotesk (var(--font-cabinet))
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
  "mx-auto max-w-4xl text-center font-[family-name:var(--font-cabinet)] text-[clamp(1.85rem,4.6vw,3.5rem)] font-normal leading-[1.12] tracking-[-0.02em] text-neutral-100";

/**
 * `HERO_HEADING` — the oversized editorial headline at the top of the page.
 * Distinct from `SECTION_HEADING`: it carries far more weight and scale so it
 * reads with the bold, confident presence of a modern creative-agency hero.
 *   • font family  — Cabinet Grotesk (var(--font-cabinet))
 *   • weight       — normal (400) — clean and editorial; presence comes from
 *                    scale, not weight, matching high-end creative-agency heads
 *   • size         — clamp(2.7rem, 8.5vw, 9.5rem) — one continuous fluid ramp,
 *                    no per-breakpoint jumps. ~43px on the smallest phones,
 *                    ~122px on a 1440px desktop, scaling on up to ~152px on
 *                    larger monitors. The slope and floor are tuned so the
 *                    longest line never overflows on mobile, nor at the lg
 *                    breakpoint where the headline shares a row with the
 *                    supporting paragraph — which is why that paragraph column
 *                    is kept narrow (see Hero.tsx) to hand the headline room.
 *   • line-height  — 0.85 (very tight stacking so the lines nearly touch)
 *   • letter-space — -0.035em (tightened for a denser editorial set)
 *   • colour       — neutral-900
 *
 * Layout classes (flex sizing, will-change) stay on the element itself so this
 * token remains purely typographic.
 */
export const HERO_HEADING =
  "font-[family-name:var(--font-cabinet)] text-[clamp(2.7rem,8.5vw,9.5rem)] font-normal leading-[0.85] tracking-[-0.035em] text-neutral-100";

/** Uniform gap between an eyebrow label and the heading below it. */
export const SECTION_HEADING_GAP = "mt-6";

/** Uniform gap between the heading and the first block of content below it. */
export const SECTION_CONTENT_GAP = "mt-14 sm:mt-16 lg:mt-20";

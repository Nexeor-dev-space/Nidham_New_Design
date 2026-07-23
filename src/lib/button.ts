/**
 * The site's single primary-action skin.
 *
 * Amber face with brand-magenta content at rest; hover swaps the two outright —
 * magenta face, amber content. The swap is the whole idea, so the border swaps
 * with them: without it the button's silhouette would jump between "amber edge"
 * and "no edge" mid-transition.
 *
 * This is colour only. Every call site keeps its own layout — padding, width,
 * radius, gap, type scale — and its own lift/scale hover, which is why
 * `translate` and `scale` are named in the transition here: Tailwind v4 compiles
 * those utilities to standalone CSS properties, not to `transform`, so a call
 * site's `hover:-translate-y-[2px]` would snap if this list omitted them.
 *
 * The shadow follows the face: a warm amber glow at rest, magenta once the fill
 * turns. A single fixed shadow would read as dirt under one of the two states.
 *
 * Use this for every button on the site. If a new one needs a different fill,
 * that is a design decision to make here, once — not a fresh class string in a
 * component, which is exactly how ten buttons ended up with six different skins.
 */
export const BUTTON_SKIN =
  "border border-[#FFD83D] bg-[#FFD83D] text-[#6E1B45] " +
  "shadow-[0_8px_20px_-10px_rgba(255,216,61,0.55)] " +
  "transition-[background-color,border-color,color,box-shadow,translate,scale] " +
  "duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] " +
  "hover:border-[#6E1B45] hover:bg-[#6E1B45] hover:text-[#FFD83D] " +
  "hover:shadow-[0_20px_44px_-12px_rgba(110,27,69,0.7)] " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD83D]";

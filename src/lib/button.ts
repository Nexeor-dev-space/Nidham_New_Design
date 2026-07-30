/**
 * Brand palette for actions — taken from the logo itself, not picked by eye.
 *
 *   #E00068  the dominant colour of the nidham mark (sampled from
 *            /images/new-nidham-logo-trimmed.png), so the primary button and the
 *            logo are literally the same pink.
 *   #8C003B  the announcement ribbon's colour, reused as the hover state — the
 *            fill deepens into a tone already on the page rather than jumping to
 *            an unrelated one.
 *   #FF3D8F  a lighter tint, used only for focus rings. The ring is drawn
 *            *outside* the button, on whatever surface the button sits on, and
 *            #E00068 clears 3:1 against white but not against the dark sections,
 *            whereas this tint clears both.
 *
 * These are written out literally in the class strings below, never composed by
 * template interpolation: Tailwind scans source *text* for class names, so a
 * `bg-[${BRAND}]` would simply never generate any CSS.
 */

/**
 * The site's single primary-action skin.
 *
 * Brand-pink face with white content at rest; hover deepens the face to
 * `BRAND_DEEP` and keeps the content white. The content colour deliberately does
 * *not* change — the earlier amber/magenta pair swapped face and text outright,
 * which reads as two different buttons when the fill is a saturated brand
 * colour. The border still moves with the face: without it the silhouette would
 * jump between "pink edge" and "no edge" mid-transition.
 *
 * This is colour only. Every call site keeps its own layout — padding, width,
 * radius, gap, type scale — and its own lift/scale hover, which is why
 * `translate` and `scale` are named in the transition here: Tailwind v4 compiles
 * those utilities to standalone CSS properties, not to `transform`, so a call
 * site's `hover:-translate-y-[2px]` would snap if this list omitted them.
 *
 * The shadow follows the face: a pink glow at rest, the deeper tone once the
 * fill turns. A single fixed shadow would read as dirt under one of the two.
 *
 * Use this for every button on the site. If a new one needs a different fill,
 * that is a design decision to make here, once — not a fresh class string in a
 * component, which is exactly how ten buttons ended up with six different skins.
 */
export const BUTTON_SKIN =
  "border border-[#E00068] bg-[#E00068] text-white " +
  "shadow-[0_8px_20px_-10px_rgba(224,0,104,0.55)] " +
  "transition-[background-color,border-color,color,box-shadow,translate,scale] " +
  "duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] " +
  "hover:border-[#8C003B] hover:bg-[#8C003B] hover:text-white " +
  "hover:shadow-[0_20px_44px_-12px_rgba(140,0,59,0.7)] " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF3D8F]";

/**
 * The secondary, outlined counterpart — for the lesser of two side-by-side
 * actions, where two filled buttons would compete for the same emphasis.
 *
 * It resolves *into* the primary rather than away from it: the brand-pink
 * outline fills in on hover to become exactly `BUTTON_SKIN`'s resting state —
 * pink face, white label. That keeps one hover language across both buttons and
 * means the pair never shows two different pink treatments at once.
 *
 * The label is white at rest rather than pink, and that is a contrast decision
 * rather than a stylistic one: these sit on the dark sections, where #E00068
 * text lands around 2.6:1. The pink stays on the border, which carries the
 * brand without having to be readable as type.
 *
 * Deliberately unshadowed at rest — a glow around an unfilled button reads as a
 * rendering artefact. It picks up the primary's pink glow only once filled.
 */
export const BUTTON_SKIN_OUTLINE =
  "border border-[#E00068] bg-transparent text-white " +
  "transition-[background-color,border-color,color,box-shadow,translate,scale] " +
  "duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] " +
  "hover:bg-[#E00068] hover:text-white " +
  "hover:shadow-[0_8px_20px_-10px_rgba(224,0,104,0.55)] " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF3D8F]";

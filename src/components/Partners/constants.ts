import type { Partner } from "./types";

/**
 * Default partner list. These are placeholder wordmarks — swap them in
 * `public/images/partners/` for the official brand SVGs; the wall renders any
 * number of entries.
 *
 * `width`/`height` are each asset's viewBox extent. The wall normalises optical
 * height, which only holds when a viewBox is cropped tight to its artwork: a
 * mark sitting in a padded box renders small and off-centre, because the
 * padding scales along with it. These placeholders carried ~50% asymmetric
 * padding and were re-cropped to their artwork (viewBox only — the artwork
 * itself is untouched, so proportions are unchanged).
 *
 * Adding a logo: crop its viewBox to the artwork, then record the resulting
 * size here. In a browser: document.querySelector("svg").getBBox()
 */
export const PARTNERS: readonly Partner[] = [
  { id: "invisible", name: "Invisible", logo: "/images/partners/invisible.svg", width: 131, height: 34 },
  { id: "cbs", name: "CBS", logo: "/images/partners/cbs.svg", width: 118, height: 40 },
  { id: "moma", name: "MoMA", logo: "/images/partners/moma.svg", width: 91, height: 39 },
  { id: "guess", name: "Guess", logo: "/images/partners/guess.svg", width: 132, height: 37 },
  { id: "seel", name: "Seel", logo: "/images/partners/seel.svg", width: 95, height: 36 },
  { id: "nbc", name: "NBC", logo: "/images/partners/nbc.svg", width: 121, height: 39 },
  { id: "verve", name: "Verve", logo: "/images/partners/verve.svg", width: 112, height: 35 },
  { id: "lumen", name: "Lumen", logo: "/images/partners/lumen.svg", width: 162, height: 35 },
] as const;

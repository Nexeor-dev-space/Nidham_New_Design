import type { Partner } from "./types";

/**
 * Default partner list. Swap these placeholder wordmarks in
 * `public/images/partners/` for the official brand SVGs — the section renders
 * any number of entries.
 */
export const PARTNERS: readonly Partner[] = [
  { id: "invisible", name: "Invisible", logo: "/images/partners/invisible.svg" },
  { id: "cbs", name: "CBS", logo: "/images/partners/cbs.svg" },
  { id: "moma", name: "MoMA", logo: "/images/partners/moma.svg" },
  { id: "guess", name: "Guess", logo: "/images/partners/guess.svg" },
  { id: "seel", name: "Seel", logo: "/images/partners/seel.svg" },
  { id: "nbc", name: "NBC", logo: "/images/partners/nbc.svg" },
  { id: "verve", name: "Verve", logo: "/images/partners/verve.svg" },
  { id: "lumen", name: "Lumen", logo: "/images/partners/lumen.svg" },
] as const;

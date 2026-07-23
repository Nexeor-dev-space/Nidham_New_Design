import type { Partner } from "./types";

/**
 * Default partner list.
 *
 * These point at `public/images/logos/white/` — white-on-transparent PNGs
 * generated from the raw brand assets in `public/images/logos/` by
 * `scripts/normalize-partner-logos.mjs`. The raw assets are a mix of
 * transparent PNGs, white-background JPEGs, a black-background JPEG and a PDF,
 * which cannot go straight onto the dark wall; the script strips each
 * background, flattens the artwork to white, and crops tight to the mark. Edit
 * the asset table in that script and re-run it rather than hand-editing the
 * PNGs — then update the sizes below to match its output.
 *
 * `width`/`height` are the generated PNG's pixel size. Every file is 200px tall
 * by construction, so the width alone carries each mark's aspect ratio. The
 * wall fits each logo inside a shared box (see PartnersSection), so these feed
 * next/image purely so the browser knows the true ratio and never distorts.
 */
export const PARTNERS: readonly Partner[] = [
  { id: "lensman", name: "Lensman", logo: "/images/logos/white/lensman.png", width: 784, height: 200 },
  { id: "fcfilmwerks", name: "FC Filmwerks", logo: "/images/logos/white/fcfilmwerks.png", width: 232, height: 200 },
  { id: "arn", name: "ARN", logo: "/images/logos/white/arn.png", width: 585, height: 200 },
  { id: "hit967", name: "Hit 96.7", logo: "/images/logos/white/hit967.png", width: 239, height: 200 },
  { id: "ubl", name: "UBL HD", logo: "/images/logos/white/ubl.png", width: 308, height: 200 },
  { id: "crudelink", name: "Crude Link360", logo: "/images/logos/white/crudelink.png", width: 228, height: 200 },
  { id: "mediafactory", name: "Media Factory", logo: "/images/logos/white/mediafactory.png", width: 93, height: 200 },
  { id: "urbanaxis", name: "Urban Axis Ventures", logo: "/images/logos/white/urbanaxis.png", width: 257, height: 200 },
  { id: "silly", name: "Silly", logo: "/images/logos/white/silly.png", width: 99, height: 200 },
  { id: "scoops", name: "Scoops", logo: "/images/logos/white/scoops.png", width: 472, height: 200 },
] as const;

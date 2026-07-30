import localFont from "next/font/local";
import { Urbanist } from "next/font/google";

/**
 * Font system — single source of truth.
 *
 * Both families are self-hosted through `next/font/local`, which emits the
 * @font-face rules, hashes + preloads the files, and derives a size-adjusted
 * fallback metric so the swap causes no layout shift. Never declare @font-face
 * for these by hand and never hardcode the family names in CSS: reference the
 * generated variables (`--font-cabinet`, `--font-switzer`) instead, so the
 * hashed filenames stay an implementation detail of next/font.
 *
 * `src` paths resolve relative to THIS file, not the project root.
 *
 * Variable files over static cuts: one 44K file per family instead of ~128K
 * across six, since next/font preloads *every* face declared in `src`. The
 * `weight` range spans each file's real wght axis (fvar reports 100–900 for
 * both), so every weight the UI uses renders as a true instance — including
 * 600, which Cabinet Grotesk ships no static cut for.
 */

/** Display family — hero headline, section titles, large display headings. */
export const cabinet = localFont({
  src: "../../public/fonts/CabinetGrotesk-Variable.woff2",
  weight: "100 900",
  style: "normal",
  variable: "--font-cabinet",
  display: "swap",
});

/**
 * Feature display face — currently the homepage hero tagline, and nothing else.
 *
 * Unlike the two families above this is a single static cut, not a variable
 * file: the OTF reports `usWeightClass 400`, no `fvar` axis, and one Regular
 * subfamily. So it is declared at exactly `400`, and call sites must ask for
 * `font-normal`. Asking for any other weight would make the browser synthesise
 * one — faux-bolding a display face by smearing its outlines, which is very
 * visible at the sizes this is used at.
 *
 * The matching `Begies Italic.otf` is deliberately not declared: next/font
 * preloads every face listed in `src`, and nothing uses the italic.
 */
export const begies = localFont({
  src: "../../public/fonts/Begies.otf",
  weight: "400",
  style: "normal",
  variable: "--font-begies",
  display: "swap",
});

/** Text/UI family — body, nav, buttons, cards, footer, forms, labels. */
export const switzer = localFont({
  src: "../../public/fonts/Switzer-Variable.woff2",
  weight: "100 900",
  style: "normal",
  variable: "--font-switzer",
  display: "swap",
});

/**
 * Text/UI family — the site-wide default for all body + UI text (body, nav,
 * buttons, cards, footer, forms, labels) and the /services + /events chapters'
 * supporting copy. Loaded through `next/font/google`, which self-hosts +
 * preloads the files and derives a no-shift fallback metric, so reference the
 * generated `--font-urbanist` variable (resolves to `"Urbanist", "Urbanist
 * Fallback"`) rather than the family name. The full 300–700 weight range is
 * declared because, as the body default, the UI uses everything from light
 * copy to semibold buttons and bold labels. Display headings stay on Cabinet
 * (see src/lib/typography.ts).
 */
export const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-urbanist",
  display: "swap",
});

/**
 * Normalises the raw partner assets in public/images/logos/ into white-on-
 * transparent PNGs cropped tight to their artwork, ready for the logo wall.
 *
 * Rules, picked per asset from what the artwork actually is:
 *   silhouette  — keep the existing alpha, force every pixel white. For clean
 *                 transparent PNGs with no internal knockouts.
 *   knockWhite  — drop near-white pixels to transparent, force the rest white.
 *                 Removes white backgrounds AND preserves internal knockout
 *                 text (which becomes a hole showing the dark section through).
 *   knockBlack  — the inverse, for artwork sitting on a black background.
 *
 * Run from the repo root: `node scripts/normalize-partner-logos.mjs`. It only
 * reads the raw assets and writes public/images/logos/white/, so it is safe to
 * re-run. Copy the printed output sizes into src/components/Partners/constants.ts.
 *
 * logo-9 arrives as a PDF; rasterise it first (macOS):
 *   sips -s format png -Z 1400 public/images/logos/logo-9.pdf \
 *     --out public/images/logos/logo-9.png
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const SRC = "public/images/logos";
const OUT = "public/images/logos/white";
/** Working height — ~2.5× the wall's 84px box, so it stays crisp on retina. */
const OUT_H = 200;
/** Alpha below this counts as empty when finding the crop box. */
const EMPTY = 8;

/**
 * `lo`/`hi` bound the knockout ramp in luminance. `gain` lifts faint anti-
 * aliased artwork that would otherwise wash out at wall size; `dilate` thickens
 * hairline strokes (in output pixels) for line-art marks.
 */
const ASSETS = [
  { id: "lensman", name: "Lensman", src: "logo-1.png", rule: "silhouette" },
  { id: "fcfilmwerks", name: "FC Filmwerks", src: "logo-2.jpg", rule: "knockBlack" },
  // ARN's letterforms are one connected shape — only the near-white bevel
  // separates them, so knocking white out is what keeps "ARN" readable.
  { id: "arn", name: "ARN", src: "logo-3.png", rule: "knockWhite", lo: 0.70, hi: 0.76 },
  { id: "hit967", name: "Hit 96.7", src: "logo-4.png", rule: "knockWhite" },
  // The source's "entertainment unleashed" tagline is faded AND clipped by the
  // image edge — it can only ever render as noise, so drop it and keep the mark.
  { id: "ubl", name: "UBL HD", src: "logo-5.png", rule: "silhouette", trimBottom: 0.08 },
  { id: "crudelink", name: "Crude Link360", src: "logo-6.jpg", rule: "knockWhite" },
  { id: "mediafactory", name: "Media Factory", src: "logo-7.jpg", rule: "knockWhite" },
  { id: "urbanaxis", name: "Urban Axis Ventures", src: "logo-8.jpg", rule: "knockWhite" },
  // Hand-drawn hairline outline — vanishes at wall size without thickening.
  { id: "silly", name: "Silly", src: "logo-9.png", rule: "knockWhite", gain: 1.8, dilate: 2 },
  { id: "scoops", name: "Scoops", src: "logo-10.png", rule: "silhouette" },
];

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

function applyRule(data, w, h, asset) {
  const { rule, lo = 0.72, hi = 0.9, gain = 1 } = asset;
  for (let i = 0; i < w * h; i++) {
    const o = i * 4;
    const r = data[o];
    const g = data[o + 1];
    const b = data[o + 2];
    const a = data[o + 3];
    const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    let k = 1;
    if (rule === "knockWhite") k = clamp01((hi - lum) / (hi - lo));
    else if (rule === "knockBlack") k = clamp01((lum - 0.06) / 0.18);
    data[o] = 255;
    data[o + 1] = 255;
    data[o + 2] = 255;
    data[o + 3] = Math.min(255, Math.round(a * k * gain));
  }
}

/** Separable max-filter on the alpha channel — grows strokes by `r` pixels. */
function dilateAlpha(data, w, h, r) {
  const src = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) src[i] = data[i * 4 + 3];
  const tmp = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let m = 0;
      for (let d = -r; d <= r; d++) {
        const xx = x + d;
        if (xx < 0 || xx >= w) continue;
        const v = src[y * w + xx];
        if (v > m) m = v;
      }
      tmp[y * w + x] = m;
    }
  }
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let m = 0;
      for (let d = -r; d <= r; d++) {
        const yy = y + d;
        if (yy < 0 || yy >= h) continue;
        const v = tmp[yy * w + x];
        if (v > m) m = v;
      }
      data[(y * w + x) * 4 + 3] = m;
    }
  }
}

/** Tight bounding box of everything with meaningful alpha. */
function bbox(data, w, h) {
  let x0 = w, y0 = h, x1 = -1, y1 = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * 4 + 3] > EMPTY) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  if (x1 < 0) return null;
  return { left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 };
}

await mkdir(OUT, { recursive: true });

for (const asset of ASSETS) {
  const src = path.join(SRC, asset.src);
  // Cap the working size — logo-2 is 4500² and the extra pixels buy nothing.
  const { data, info } = await sharp(src)
    .resize({ width: 1200, height: 1200, fit: "inside", withoutEnlargement: true })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  applyRule(data, info.width, info.height, asset);
  if (asset.trimBottom) {
    const cut = Math.round(info.height * (1 - asset.trimBottom));
    for (let i = cut * info.width; i < info.width * info.height; i++) {
      data[i * 4 + 3] = 0;
    }
  }
  const box = bbox(data, info.width, info.height);
  if (!box) throw new Error(`${asset.src}: nothing left after ${asset.rule}`);

  // Crop + scale first, then dilate — so the thickening is measured in output
  // pixels and reads the same on every asset regardless of source resolution.
  const scaled = await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .extract(box)
    .resize({ height: OUT_H, fit: "inside", withoutEnlargement: false })
    .raw()
    .toBuffer({ resolveWithObject: true });

  if (asset.dilate) {
    dilateAlpha(scaled.data, scaled.info.width, scaled.info.height, asset.dilate);
  }

  const out = path.join(OUT, `${asset.id}.png`);
  const meta = await sharp(scaled.data, {
    raw: { width: scaled.info.width, height: scaled.info.height, channels: 4 },
  })
    .png({ compressionLevel: 9 })
    .toFile(out);

  console.log(
    `${asset.id.padEnd(13)} ${asset.rule.padEnd(11)} ` +
      `${info.width}×${info.height} → crop ${box.width}×${box.height} ` +
      `→ ${out} ${meta.width}×${meta.height}`,
  );
}

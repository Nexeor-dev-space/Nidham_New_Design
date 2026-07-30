import Image from "next/image";
import Link from "next/link";
import { REVEAL } from "@/src/hooks/useEditorialReveal";
import { MD_RELATED, MD_RELATED_HEADING } from "./constants";

/**
 * "Continue Exploring" — a compact related-event row, the redesign's answer to
 * the old page's WordPress "Recent Posts" sidebar widget.
 *
 * **Not a section.** It renders a bare block and is embedded inside
 * `MelodyClose` ("Join the Melody Dreamz Movement"), so it inherits that
 * section's bed, gutter and vertical rhythm and adds no new band to the page.
 * It carries no `SectionDivider` for the same reason: the divider is the site's
 * *section-title* motif, and using it here would announce a full section where
 * the intent is a small closing aside. A quiet label does that job instead.
 *
 * This replaced a full-width horizontal card with a large image and a pill
 * button. At that size it read as another chapter of the article competing with
 * the closing statement above it, rather than as a pointer to somewhere else.
 * Same content, a fraction of the footprint: 96×72 thumbnail, date, title.
 *
 * No arrow and no button: the whole row is one `<Link>` — nesting a button or a
 * second anchor inside an anchor is invalid HTML — and at this size the card's
 * own lift plus the thumbnail's zoom carry the affordance on their own. Hover
 * motion uses `transition-[scale]` / `transition-[translate]`, never
 * `transition-transform`:
 * Tailwind v4 compiles those utilities to the standalone `scale` and `translate`
 * properties, whereas `transition-transform` expands to
 * `transform, translate, scale, rotate` and would have the browser interpolating
 * the `transform` that GSAP writes during the entrance reveal.
 */
export default function MelodyContinue() {
  return (
    <div className="mt-16 sm:mt-20">
      <p
        className={`${REVEAL.up} text-center font-[family-name:var(--font-urbanist)] text-[11px] font-medium uppercase tracking-[0.28em] text-neutral-400`}
      >
        {MD_RELATED_HEADING}
      </p>

      <div className="mt-6 flex flex-col items-center gap-4">
        {MD_RELATED.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={`${REVEAL.up} group inline-flex w-full max-w-md items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3 pe-6 text-left outline-none transition-[translate,box-shadow,border-color] duration-[500ms] ease-[cubic-bezier(0.165,0.84,0.44,1)] hover:border-white/[0.16] hover:shadow-[0_20px_44px_-28px_rgba(0,0,0,0.9)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF3D8F] motion-safe:hover:-translate-y-0.5 sm:w-auto`}
          >
            {/* Fixed 96×72 (4:3). A square thumb — the old widget's shape —
                would crop 40% off a 1.68 stage photograph; this takes 21%. */}
            <span className="relative block h-[72px] w-[96px] shrink-0 overflow-hidden rounded-xl bg-neutral-900">
              <Image
                src={item.image}
                alt={item.imageAlt}
                fill
                sizes="96px"
                quality={85}
                className="object-cover transition-[scale] duration-[900ms] ease-[cubic-bezier(0.165,0.84,0.44,1)] motion-safe:group-hover:scale-[1.08]"
              />
            </span>

            <span className="min-w-0 flex-1">
              <span className="block font-[family-name:var(--font-urbanist)] text-[10px] font-medium uppercase tracking-[0.2em] text-[#FF3D8F]">
                {item.date}
              </span>
              <span className="mt-1.5 block truncate font-[family-name:var(--font-cabinet)] text-[19px] font-normal leading-[1.2] tracking-[-0.01em] text-neutral-100">
                {item.title}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

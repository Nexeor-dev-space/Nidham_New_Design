"use client";

import { useState } from "react";
import Image from "next/image";
import SectionDivider from "@/src/components/ui/SectionDivider";
import { REVEAL } from "@/src/hooks/useEditorialReveal";
import { SECTION_HEADING, SECTION_HEADING_GAP } from "@/src/lib/typography";
import GalleryLightbox from "./GalleryLightbox";
import { MD_GALLERY, MD_GALLERY_ID } from "./constants";

/**
 * The merged Album — every Melody Dreamz photograph, as an editorial gallery.
 *
 * This section replaces the separate Album page. The hero's "Explore Gallery"
 * button and the progress rail both scroll here, so nothing navigates away.
 *
 * **A composed bed, not a pattern.** Twelve columns at `lg`, three rows of
 * 8+4 / 6+6 / 12. Each plate's slot is chosen from its real pixel ratio and each
 * row's plates share one height, so the rows align and the bed fills exactly —
 * see the note in constants.ts, including what the previous attempt got wrong.
 *
 * Deliberately *not* `items-start` masonry. Ragged row bottoms on five large
 * photographs of differing ratios read as broken rather than as art direction;
 * equal-height rows with asymmetric widths give the same editorial variety and
 * stay aligned at every breakpoint.
 */
export default function MelodyGallery() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      id={MD_GALLERY_ID}
      aria-labelledby="md-gallery-heading"
      data-particles="gallery"
      className="w-full bg-[#111111] section-y"
    >
      <div className="container-page">
        <SectionDivider label="Album" />

        <h2
          id="md-gallery-heading"
          className={`${SECTION_HEADING_GAP} ${SECTION_HEADING} ${REVEAL.up}`}
        >
          The Gallery
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:mt-14 md:grid-cols-2 lg:mt-16 lg:grid-cols-12 lg:gap-6">
          {MD_GALLERY.map((plate, i) => (
            <figure
              key={plate.src}
              className={`${plate.col} ${REVEAL.plate} group relative m-0`}
            >
              <button
                type="button"
                onClick={() => setOpen(i)}
                aria-label={`View image ${i + 1} of ${MD_GALLERY.length} full screen`}
                className={`relative block w-full overflow-hidden rounded-2xl bg-neutral-900 outline-none ring-1 ring-white/[0.06] focus-visible:ring-2 focus-visible:ring-[#FF3D8F] ${plate.height}`}
              >
                <Image
                  src={plate.src}
                  alt={plate.alt}
                  fill
                  sizes="(max-width: 1023px) 100vw, 60vw"
                  quality={85}
                  className="object-cover transition-[scale,filter] duration-[900ms] ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:scale-[1.05] group-hover:brightness-[1.04] motion-reduce:transition-none"
                />

                {/* Resting wash, deepening on hover so the "View" cue reads. */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-black/[0.22] transition-colors duration-[900ms] ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:bg-black/[0.42]"
                />

                {/* The cursor affordance, as an in-frame chip rather than a real
                    custom cursor: the site's CustomCursor component is not
                    mounted anywhere, so `data-cursor` attributes are inert. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 grid place-items-center"
                >
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-black/40 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white opacity-0 backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:opacity-100 group-focus-visible:opacity-100 motion-safe:translate-y-2 motion-safe:group-hover:translate-y-0">
                    View
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                      <path d="M15 3h6v6M21 3l-9 9M10 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-6" />
                    </svg>
                  </span>
                </span>
              </button>
            </figure>
          ))}
        </div>
      </div>

      <GalleryLightbox
        plates={MD_GALLERY}
        index={open}
        onClose={() => setOpen(null)}
        onNavigate={setOpen}
      />
    </section>
  );
}

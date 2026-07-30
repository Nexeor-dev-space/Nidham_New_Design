"use client";

import { useRef } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import AnnouncementBar from "@/src/components/Hero/AnnouncementBar";
import Navbar from "@/src/components/Hero/Navbar";
import { useIsomorphicLayoutEffect } from "@/src/hooks/useIsomorphicLayoutEffect";
import { scrollToId } from "@/src/lib/nav";
import {
  MD_EYEBROW,
  MD_FILM_ID,
  MD_FULL_TITLE,
  MD_GALLERY_ID,
  MD_HERO_IMAGE,
  MD_HERO_IMAGE_ALT,
  MD_LOCATION,
  MD_YEAR,
} from "./constants";

/**
 * Fullscreen cinematic hero for the Melody Dreamz case study.
 *
 * Structurally the same as the site's other page heroes: the nav chrome sits in
 * normal flow on the hero's own dark surface with `#hero-nav-sentinel` beneath
 * it, so FloatingNav's handoff behaves identically here to every other route.
 * The film then takes the remaining viewport (`flex-1`).
 *
 * Motion is one GSAP timeline rather than Framer variants, because the reveal
 * has to wait on the *backdrop* — the copy fades up out of a blur only once the
 * photograph has decoded, so on a slow connection the type does not arrive over
 * an empty rectangle. Three ways in, whichever comes first: the image is already
 * complete (cached, or decoded before this effect ran), its `load` event, or a
 * 1.2s backstop. The hero can never be left empty.
 *
 * This replaced a looping `<video>` backdrop. The gate used to be the video's
 * `playing` event with the same fallback; swapping the media kept the structure
 * and only changed what is waited on.
 */
export default function MelodyHero() {
  const reduce = useReducedMotion() ?? false;
  const imageRef = useRef<HTMLImageElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  useIsomorphicLayoutEffect(() => {
    const copy = copyRef.current;
    const image = imageRef.current;
    if (!copy) return;

    if (reduce) {
      gsap.set(copy.children, { opacity: 1, y: 0, filter: "blur(0px)" });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(copy.children, { opacity: 0, y: 40, filter: "blur(14px)" });

      const run = () => {
        if (startedRef.current) return;
        startedRef.current = true;
        gsap.to(copy.children, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.25,
          ease: "power3.out",
          stagger: 0.12,
          force3D: true,
        });
      };

      // `complete` first: with an eager, high-priority hero image this is often
      // already true by the time a layout effect runs, and waiting on a `load`
      // that has already fired would hold the copy until the 1.2s backstop.
      if (image?.complete) run();
      else image?.addEventListener("load", run, { once: true });
      const fallback = window.setTimeout(run, 1200);

      return () => {
        window.clearTimeout(fallback);
        image?.removeEventListener("load", run);
      };
    }, copy);

    return () => ctx.revert();
  }, [reduce]);

  return (
    <header
      id="md-hero"
      className="relative flex h-[100svh] w-full flex-col overflow-hidden bg-[#0B0B0B] text-white"
    >
      {/* Nav chrome — in flow above the film, unchanged from every other page. */}
      <div className="relative z-30 shrink-0">
        <AnnouncementBar />
        <Navbar />
        <div id="hero-nav-sentinel" aria-hidden="true" className="h-0 w-full" />
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden">
        {/* `loading="eager"` + `fetchPriority="high"`, not `priority` — that prop
            is deprecated as of Next 16, and the docs point at these (or
            `preload`) instead. This is the LCP element, so it must not be lazy.
            `object-top` keeps the faces: see MD_HERO_IMAGE for the crop maths. */}
        <Image
          ref={imageRef}
          src={MD_HERO_IMAGE}
          alt={MD_HERO_IMAGE_ALT}
          fill
          sizes="100vw"
          quality={85}
          loading="eager"
          fetchPriority="high"
          className="object-cover object-top"
        />

        {/* Dark grade — flat wash plus a bottom weight so the copy holds at any
            frame without burying the footage. */}
        <div aria-hidden="true" className="absolute inset-0 bg-black/45" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/30"
        />

        <div className="absolute inset-0 z-20 flex items-end pb-14 pt-24 sm:pb-20">
          <div className="container-page w-full">
            <div ref={copyRef} className="max-w-4xl">
              <p className="text-[11px] font-medium uppercase tracking-[0.34em] text-[#FF3D8F] sm:text-[12px]">
                {MD_EYEBROW}
              </p>

              <h1 className="mt-5 font-[family-name:var(--font-cabinet)] font-normal leading-[0.95] tracking-[-0.02em] text-white text-[clamp(2.5rem,9vw,4rem)] md:text-[clamp(3.5rem,7vw,5rem)] lg:text-[clamp(4.5rem,6vw,6.5rem)]">
                {MD_FULL_TITLE}
              </h1>

              <p className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 font-[family-name:var(--font-urbanist)] text-[15px] font-light text-neutral-200 sm:text-[17px]">
                <span>{MD_LOCATION}</span>
                <span aria-hidden="true" className="h-1 w-1 rounded-full bg-[#E00068]" />
                <span className="tabular-nums">{MD_YEAR}</span>
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <button
                  type="button"
                  onClick={() => scrollToId(MD_FILM_ID, reduce)}
                  className="group inline-flex items-center justify-center gap-3 rounded-[14px] border border-[#E00068] bg-[#E00068] px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-white outline-none transition-[background-color,border-color,box-shadow] duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-[#8C003B] hover:bg-[#8C003B] hover:shadow-[0_18px_40px_-14px_rgba(224,0,104,0.7)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF3D8F]"
                >
                  Watch Highlights
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-3 w-3">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>

                {/* This is the merged Album affordance: it scrolls to the
                    gallery on this page rather than opening a second route. */}
                <button
                  type="button"
                  onClick={() => scrollToId(MD_GALLERY_ID, reduce)}
                  className="group inline-flex items-center justify-center gap-3 rounded-[14px] border border-white/45 bg-transparent px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-white outline-none backdrop-blur-[2px] transition-[background-color,border-color,color] duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-white hover:bg-white hover:text-[#0B0B0B] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  Explore Gallery
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="h-3.5 w-3.5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:translate-y-0.5"
                  >
                    <path d="M12 5v14M5 12l7 7 7-7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

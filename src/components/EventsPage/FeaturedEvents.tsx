"use client";

import { useRef, type MouseEvent } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { useGsapReveal } from "@/src/hooks/useGsapReveal";
import { useGsapParallax } from "@/src/hooks/useGsapParallax";
import { scrollToId } from "@/src/lib/nav";
import {
  CONTACT_TARGET_ID,
  FEATURED_EVENTS,
  FEATURED_TITLE,
} from "./constants";

/**
 * Featured events — a premium editorial showcase, not cards. Each event is a
 * full-width two-column composition that alternates sides down the page: a large
 * cinematic image on one side, its story on the other. GSAP reveals the copy
 * (`data-reveal="up"`) and mask-wipes the images (`data-reveal="mask"`) as they
 * enter; a scrubbed parallax drifts each image; hover adds a slight zoom,
 * brightness lift and soft shadow.
 */
export default function FeaturedEvents() {
  const reduce = useReducedMotion() ?? false;
  const scopeRef = useRef<HTMLElement>(null);

  useGsapReveal(scopeRef);
  useGsapParallax(scopeRef, ".feat-parallax", 6);

  const openContact = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    scrollToId(CONTACT_TARGET_ID, reduce);
  };

  return (
    <section
      ref={scopeRef}
      aria-label="Featured events"
      data-particles="gallery"
      className="relative w-full bg-[#1F1F1F] section-y"
    >
      <div className="container-page">
        <header className="max-w-4xl">
          <p
            data-reveal="up"
            className="text-xs font-medium uppercase tracking-[0.28em] text-neutral-500 sm:text-sm"
          >
            {FEATURED_TITLE}
          </p>
        </header>

        <div className="mt-16 flex flex-col gap-24 sm:mt-20 sm:gap-28 lg:gap-40">
          {FEATURED_EVENTS.map((ev, i) => {
            const reverse = i % 2 === 1;
            return (
              <article
                key={ev.id}
                className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16 xl:gap-24"
              >
                {/* Image */}
                <div className={reverse ? "lg:order-2" : "lg:order-1"}>
                  <a
                    href="#contact"
                    onClick={openContact}
                    data-cursor="image"
                    aria-label={`${ev.title} — explore`}
                    data-reveal="mask"
                    className="group relative block aspect-[4/3] overflow-hidden rounded-[20px] shadow-[0_20px_50px_-30px_rgba(0,0,0,0.6)] outline-none transition-shadow duration-500 hover:shadow-[0_40px_90px_-30px_rgba(0,0,0,0.75)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6E1B45]"
                  >
                    <div className="feat-parallax absolute inset-x-0 -top-[8%] h-[116%] will-change-transform">
                      <Image
                        src={ev.image}
                        alt={ev.imageAlt}
                        fill
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="object-cover transition-[transform,filter] duration-[700ms] ease-out will-change-transform group-hover:scale-[1.05] group-hover:brightness-110"
                      />
                    </div>
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"
                    />
                  </a>
                </div>

                {/* Content */}
                <div className={reverse ? "lg:order-1" : "lg:order-2"}>
                  <div
                    data-reveal="up"
                    className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-[#A6386B] sm:text-sm"
                  >
                    <span className="font-[family-name:var(--font-cabinet)] tabular-nums text-neutral-500">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="h-px w-8 bg-white/20" />
                    <span>{ev.category}</span>
                  </div>

                  <h3
                    data-reveal="up"
                    className="mt-5 font-[family-name:var(--font-cabinet)] text-[clamp(1.8rem,4.4vw,3.4rem)] font-normal leading-[1.06] tracking-[-0.02em] text-neutral-100"
                  >
                    {ev.title}
                  </h3>

                  <div
                    data-reveal="up"
                    className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-neutral-400"
                  >
                    <span>{ev.location}</span>
                    <span aria-hidden="true" className="h-1 w-1 rounded-full bg-neutral-600" />
                    <span>{ev.date}</span>
                  </div>

                  <p
                    data-reveal="up"
                    className="mt-6 max-w-xl text-[16px] leading-relaxed text-neutral-300 sm:text-[17px]"
                  >
                    {ev.description}
                  </p>

                  {/* CTA — elegant underline link with an animated arrow. */}
                  <a
                    href="#contact"
                    onClick={openContact}
                    data-cursor="link"
                    data-reveal="up"
                    className="group mt-8 inline-flex items-center gap-2.5 text-sm font-medium uppercase tracking-[0.16em] text-neutral-200 outline-none transition-colors duration-300 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6E1B45]"
                  >
                    <span className="relative">
                      {ev.cta}
                      <span
                        aria-hidden="true"
                        className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-[#A6386B] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
                      />
                    </span>
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:translate-x-[6px]"
                    >
                      &rarr;
                    </span>
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

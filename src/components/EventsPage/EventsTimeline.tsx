"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsapReveal } from "@/src/hooks/useGsapReveal";
import { TIMELINE_EVENTS, TIMELINE_TITLE } from "./constants";

gsap.registerPlugin(ScrollTrigger);

/**
 * Upcoming events as a modern vertical timeline. A hairline rail runs the height
 * of the list; a magenta progress line grows down it as the section scrolls
 * (scrubbed, transform-only). Each entry — date, location, name, description,
 * status — reveals with the shared fade/rise as it enters. Under reduced motion
 * the progress line is simply shown full and entries stay visible.
 */
export default function EventsTimeline() {
  const scopeRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  useGsapReveal(scopeRef);

  useEffect(() => {
    const list = listRef.current;
    const progress = progressRef.current;
    if (!list || !progress) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(progress, { scaleY: 1 });
      });
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          progress,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: list,
              start: "top 65%",
              end: "bottom 75%",
              scrub: true,
            },
          },
        );
      });
    }, list);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={scopeRef}
      aria-label="Upcoming events"
      data-particles="services"
      className="relative w-full bg-[#1F1F1F] section-y"
    >
      <div className="container-page">
        <p
          data-reveal="up"
          className="text-xs font-medium uppercase tracking-[0.28em] text-neutral-500 sm:text-sm"
        >
          {TIMELINE_TITLE}
        </p>

        <div className="relative mt-12 sm:mt-16">
          {/* Rail + growing progress line. */}
          <span
            aria-hidden="true"
            className="absolute left-[6px] top-3 bottom-3 w-px bg-white/12"
          />
          <span
            ref={progressRef}
            aria-hidden="true"
            className="absolute left-[6px] top-3 bottom-3 w-px origin-top scale-y-0 bg-gradient-to-b from-[#A6386B] to-[#6E1B45] shadow-[0_0_12px_rgba(166,56,107,0.5)]"
          />

          <ol ref={listRef} className="space-y-12 sm:space-y-14 lg:space-y-16">
            {TIMELINE_EVENTS.map((item) => (
              <li
                key={item.id}
                data-reveal="up"
                className="relative pl-9 sm:pl-14"
              >
                {/* Node on the rail. */}
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-[5px] flex h-3 w-3 items-center justify-center rounded-full border border-white/30 bg-[#1F1F1F]"
                >
                  <span className="h-1 w-1 rounded-full bg-[#A6386B]" />
                </span>

                <div className="grid gap-3 lg:grid-cols-[minmax(0,14rem)_1fr] lg:gap-12">
                  {/* Meta */}
                  <div className="flex flex-col gap-1">
                    <span className="font-[family-name:var(--font-cabinet)] text-lg tracking-tight text-neutral-100">
                      {item.date}
                    </span>
                    <span className="text-sm text-neutral-500">{item.location}</span>
                  </div>

                  {/* Detail */}
                  <div>
                    <h3 className="font-[family-name:var(--font-cabinet)] text-[clamp(1.35rem,2.6vw,2rem)] font-normal leading-[1.1] tracking-[-0.015em] text-neutral-100">
                      {item.name}
                    </h3>
                    <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-neutral-400 sm:text-base">
                      {item.description}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-[#A6386B]">
                      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#A6386B]" />
                      {item.status}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

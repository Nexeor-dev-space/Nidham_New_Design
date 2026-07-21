"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ServiceRow from "./ServiceRow";
import FloatingPreview from "./FloatingPreview";
import { SERVICES, SERVICE_TARGET_ID } from "./constants";
import { scrollToId } from "@/src/lib/nav";
import { DUR, GSAP_EASE, ST_START, STAGGER } from "@/src/lib/motion";

gsap.registerPlugin(ScrollTrigger);

/**
 * The editorial services list — the page's core. Owns the hovered-row state that
 * drives the desktop {@link FloatingPreview}, and the GSAP ScrollTrigger reveal
 * that lifts each row in (opacity 0→1, y 60→0, staggered, signature ease). Under
 * `prefers-reduced-motion` the rows are simply left visible.
 */
export default function ServicesList() {
  const reduce = useReducedMotion() ?? false;
  const rootRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray<HTMLElement>(".service-row");
      const mm = gsap.matchMedia();

      // Only animate when motion is welcome; otherwise rows stay fully visible.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(rows, { autoAlpha: 0, y: 60 });
        ScrollTrigger.batch(rows, {
          start: ST_START,
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              duration: DUR.base,
              ease: GSAP_EASE,
              stagger: STAGGER,
              overwrite: true,
              force3D: true,
            }),
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  const handleOpen = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    scrollToId(SERVICE_TARGET_ID, reduce);
  };

  return (
    <section
      ref={rootRef}
      aria-label="Services"
      data-particles="services"
      className="relative w-full bg-[#1F1F1F] section-y"
    >
      <div className="container-page">
        <ul className="flex flex-col border-b border-white/10">
          {SERVICES.map((service, index) => (
            <li key={service.id}>
              <ServiceRow
                service={service}
                index={index}
                onEnter={setActive}
                onLeave={(i) => setActive((cur) => (cur === i ? -1 : cur))}
                onOpen={handleOpen}
              />
            </li>
          ))}
        </ul>
      </div>

      {/* Desktop-only floating media beside the hovered service. */}
      <FloatingPreview services={SERVICES} activeIndex={active} />
    </section>
  );
}

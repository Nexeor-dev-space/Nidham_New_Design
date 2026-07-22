"use client";

import { type MouseEvent } from "react";
import { useReducedMotion } from "framer-motion";
import ServiceChapter from "./ServiceChapter";
import { SERVICES, SERVICE_TARGET_ID } from "./constants";
import { scrollToId } from "@/src/lib/nav";

/**
 * The editorial services experience — a full-width vertical story where each
 * service is a ~full-height "chapter" that alternates text/media left-to-right
 * for rhythm. Deliberately unlike the Events page's bordered-row lists: here
 * typography, imagery, whitespace and scroll motion carry the experience, with
 * no cards, grids, boxes or accordions.
 *
 * This wrapper owns the shared dark cinematic atmosphere (large blurred ambient
 * glows, a soft overhead spotlight and faint film grain) that sits behind every
 * chapter so nothing ever reads as flat black; each {@link ServiceChapter}
 * carries its own scroll choreography.
 *
 * `data-particles="services"` keeps the global ambient dust field at its
 * services intensity across this whole section.
 */
export default function ServicesList() {
  const reduce = useReducedMotion() ?? false;

  const handleOpen = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    scrollToId(SERVICE_TARGET_ID, reduce);
  };

  return (
    <section
      aria-label="Services"
      data-particles="services"
      className="relative w-full overflow-hidden bg-[#1F1F1F]"
    >
      {/* Ambient cinematic backdrop — large, slow, blurred magenta/amber glows,
          a soft overhead spotlight and faint grain. Purely decorative, backmost;
          keeps the surface from ever reading as flat black. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-x-0 top-0 h-[60vh] bg-[radial-gradient(60%_100%_at_50%_0%,rgba(255,255,255,0.05)_0%,transparent_70%)]" />
        <div className="absolute -left-40 top-[6%] h-[38rem] w-[38rem] rounded-full bg-[#6E1B45]/[0.10] blur-[120px]" />
        <div className="absolute -right-48 top-[34%] h-[42rem] w-[42rem] rounded-full bg-amber-300/[0.06] blur-[130px]" />
        <div className="absolute -left-32 top-[62%] h-[40rem] w-[40rem] rounded-full bg-[#6E1B45]/[0.09] blur-[125px]" />
        <div className="absolute -right-40 top-[88%] h-[36rem] w-[36rem] rounded-full bg-amber-300/[0.05] blur-[120px]" />
        <div className="hero-grain absolute inset-0 opacity-[0.035] mix-blend-soft-light" />
      </div>

      <div className="relative z-10">
        {SERVICES.map((service, index) => (
          <ServiceChapter
            key={service.id}
            service={service}
            index={index}
            onOpen={handleOpen}
          />
        ))}
      </div>
    </section>
  );
}

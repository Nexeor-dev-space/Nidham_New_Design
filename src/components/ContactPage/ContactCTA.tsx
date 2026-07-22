"use client";

import { useRef, type MouseEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import BrandButton from "@/src/components/ui/BrandButton";
import { useGsapReveal } from "@/src/hooks/useGsapReveal";
import { scrollToId } from "@/src/lib/nav";
import {
  CTA_BUTTON_LABEL,
  CTA_HEADLINE_LINES,
  FORM_TARGET_ID,
} from "./constants";

/**
 * Closing CTA — a large, cinematic section that mirrors the homepage brand
 * button exactly (magnetic + shimmer + ripple + arrow). The headline reveals on
 * scroll; ambient magenta glow keeps it consistent with the rest of the page.
 * The action glides back up to the form on this page.
 */
export default function ContactCTA() {
  const reduce = useReducedMotion() ?? false;
  const scopeRef = useRef<HTMLElement>(null);
  useGsapReveal(scopeRef);

  const toForm = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    scrollToId(FORM_TARGET_ID, reduce);
  };

  return (
    <section
      ref={scopeRef}
      aria-label="Start your project"
      data-particles="footer"
      className="relative w-full overflow-hidden bg-[#1F1F1F] section-y"
    >
      {!reduce && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <motion.div
            className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6E1B45]/[0.12] blur-3xl"
            animate={{ opacity: [0.4, 0.75, 0.4], scale: [1, 1.06, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      )}

      <div className="container-page relative flex flex-col items-center py-8 text-center sm:py-12 lg:py-16">
        <h2
          data-reveal="up"
          className="font-[family-name:var(--font-cabinet)] text-[clamp(2.2rem,6.2vw,5rem)] font-normal leading-[1.02] tracking-[-0.03em] text-neutral-100"
        >
          {CTA_HEADLINE_LINES.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>

        <div data-reveal="up" className="mt-10 sm:mt-12">
          <BrandButton label={CTA_BUTTON_LABEL} size="lg" onClick={toForm} />
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import { useGsapReveal } from "@/src/hooks/useGsapReveal";
import { CONTACT_REASONS, WHY_TITLE } from "./constants";

/**
 * "Why work with us" — three reasons presented as editorial content, not feature
 * cards: an index, a large Cabinet title and a supporting paragraph, split by
 * hairline rules. Each column fades/rises in on scroll via the shared GSAP hook.
 */
export default function WhyContactUs() {
  const scopeRef = useRef<HTMLElement>(null);
  useGsapReveal(scopeRef);

  return (
    <section
      ref={scopeRef}
      aria-label="Why work with us"
      data-particles="services"
      className="relative w-full bg-[#1F1F1F] section-y"
    >
      <div className="container-page">
        <p
          data-reveal="up"
          className="text-xs font-medium uppercase tracking-[0.28em] text-neutral-500 sm:text-sm"
        >
          {WHY_TITLE}
        </p>

        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden sm:mt-16 lg:grid-cols-3">
          {CONTACT_REASONS.map((reason) => (
            <div
              key={reason.id}
              data-reveal="up"
              className="group relative border-t border-white/12 py-8 lg:border-t-0 lg:border-l lg:px-8 lg:py-2 lg:first:border-l-0 lg:first:pl-0"
            >
              <span className="font-[family-name:var(--font-cabinet)] text-sm tabular-nums text-[#A6386B]">
                {reason.index}
              </span>
              <h3 className="mt-5 font-[family-name:var(--font-cabinet)] text-[clamp(1.6rem,3vw,2.4rem)] font-normal leading-[1.05] tracking-[-0.02em] text-neutral-100 transition-colors duration-500">
                {reason.title}
              </h3>
              <p className="mt-4 max-w-sm text-[20px] font-light leading-relaxed text-neutral-400">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

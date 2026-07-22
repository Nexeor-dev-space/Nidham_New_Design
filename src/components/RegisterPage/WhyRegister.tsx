"use client";

import { useRef } from "react";
import { useGsapReveal } from "@/src/hooks/useGsapReveal";
import { REGISTER_BENEFITS, WHY_TITLE } from "./constants";

/**
 * "Why register" — the benefits as editorial content, not feature cards. Each
 * benefit is a wide row (index · large Cabinet title · supporting line) split by
 * hairline dividers, with a magenta accent that wipes across the rule on hover.
 * Rows reveal on scroll via the shared GSAP hook.
 */
export default function WhyRegister() {
  const scopeRef = useRef<HTMLElement>(null);
  useGsapReveal(scopeRef);

  return (
    <section
      ref={scopeRef}
      aria-label="Why register"
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

        <div className="mt-12 border-b border-white/10 sm:mt-16">
          {REGISTER_BENEFITS.map((benefit) => (
            <div
              key={benefit.id}
              data-reveal="up"
              className="group relative grid grid-cols-1 gap-2 border-t border-white/10 py-7 sm:grid-cols-[auto_1fr] sm:items-baseline sm:gap-10 sm:py-8 lg:py-10"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 -top-px h-px origin-left scale-x-0 bg-[linear-gradient(90deg,#6E1B45_0%,#A6386B_55%,transparent_100%)] transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
              />
              <div className="flex items-baseline gap-5 sm:gap-8">
                <span className="font-[family-name:var(--font-cabinet)] text-sm tabular-nums text-[#A6386B]">
                  {benefit.index}
                </span>
                <h3 className="font-[family-name:var(--font-cabinet)] text-[clamp(1.5rem,3vw,2.6rem)] font-normal leading-[1.04] tracking-[-0.02em] text-neutral-200 transition-colors duration-500 group-hover:text-white">
                  {benefit.title}
                </h3>
              </div>
              <p className="max-w-xl text-[15px] leading-relaxed text-neutral-400 sm:text-base">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

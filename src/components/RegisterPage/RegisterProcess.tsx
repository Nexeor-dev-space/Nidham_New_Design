"use client";

import { useRef } from "react";
import { useGsapReveal } from "@/src/hooks/useGsapReveal";
import { PROCESS_STEPS, PROCESS_TITLE } from "./constants";

/**
 * The registration journey — a minimal four-step timeline (Submit → Review →
 * Confirmation → Welcome). Vertical on mobile with connecting arrows, a clean
 * horizontal rhythm on desktop. Each step fades/rises in on scroll (staggered)
 * via the shared GSAP hook.
 */
export default function RegisterProcess() {
  const scopeRef = useRef<HTMLElement>(null);
  useGsapReveal(scopeRef);

  const last = PROCESS_STEPS.length - 1;

  return (
    <section
      ref={scopeRef}
      aria-label="How registration works"
      data-particles="services"
      className="relative w-full bg-[#1F1F1F] section-y"
    >
      <div className="container-page">
        <p
          data-reveal="up"
          className="text-xs font-medium uppercase tracking-[0.28em] text-neutral-500 sm:text-sm"
        >
          {PROCESS_TITLE}
        </p>

        <ol className="mt-12 grid grid-cols-1 gap-10 sm:mt-16 lg:grid-cols-4 lg:gap-6">
          {PROCESS_STEPS.map((step, i) => (
            <li
              key={step.id}
              data-reveal="up"
              className="relative border-t border-white/12 pt-6"
            >
              <span className="font-[family-name:var(--font-cabinet)] text-[clamp(2rem,4vw,3rem)] font-normal leading-none tracking-[-0.02em] text-[#6E1B45]">
                {step.index}
              </span>
              <h3 className="mt-5 font-[family-name:var(--font-cabinet)] text-[clamp(1.3rem,2.4vw,1.75rem)] font-normal leading-tight tracking-[-0.015em] text-neutral-100">
                {step.title}
              </h3>
              <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-neutral-400">
                {step.description}
              </p>

              {/* Connector — down arrow on mobile, right arrow on desktop. */}
              {i !== last && (
                <span
                  aria-hidden="true"
                  className="mt-6 flex justify-center text-neutral-600 lg:absolute lg:right-[-1.1rem] lg:top-7 lg:mt-0"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 lg:hidden">
                    <path d="M12 5v14M6 13l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="hidden h-5 w-5 lg:block">
                    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

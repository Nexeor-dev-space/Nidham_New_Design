"use client";

import { useRef } from "react";
import { useGsapReveal } from "@/src/hooks/useGsapReveal";
import { CONTACT_DETAILS } from "./constants";

/**
 * Contact details as an editorial index — not one big card. Each detail (Phone,
 * Email, Working Hours) is its own block: a hairline top rule with an
 * animated magenta accent on hover, a large Cabinet title, the actual value
 * (a tel:/mailto: link where relevant, with an underline sweep), and a quiet
 * supporting line. Blocks fade/rise in on scroll via the shared GSAP hook.
 */
export default function ContactInfo() {
  const scopeRef = useRef<HTMLElement>(null);
  useGsapReveal(scopeRef);

  return (
    <section
      ref={scopeRef}
      aria-label="Contact details"
      data-particles="services"
      className="relative w-full bg-[#1F1F1F] section-y"
    >
      <div className="container-page">
        <div className="grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {CONTACT_DETAILS.map((detail) => {
            const value = (
              <div className="mt-4 flex flex-col gap-0.5">
                {detail.lines.map((line) => (
                  <span
                    key={line}
                    className="text-[17px] text-neutral-200 sm:text-lg"
                  >
                    {line}
                  </span>
                ))}
              </div>
            );

            return (
              <div
                key={detail.id}
                data-reveal="up"
                className="group relative border-t border-white/12 pt-6"
              >
                {/* Animated accent on the top rule. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 -top-px h-px origin-left scale-x-0 bg-[linear-gradient(90deg,#6E1B45_0%,#A6386B_55%,transparent_100%)] transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
                />

                <h2 className="font-[family-name:var(--font-cabinet)] text-[clamp(1.4rem,2.4vw,1.9rem)] font-normal leading-tight tracking-[-0.015em] text-neutral-100">
                  {detail.title}
                </h2>

                {detail.href ? (
                  <a
                    href={detail.href}
                    data-cursor="link"
                    className="group/v inline-block outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6E1B45]"
                  >
                    <span className="relative mt-4 inline-flex flex-col gap-0.5 text-[17px] text-neutral-200 transition-colors duration-300 group-hover/v:text-white sm:text-lg">
                      {detail.lines.map((line) => (
                        <span key={line} className="relative w-fit">
                          {line}
                          <span
                            aria-hidden="true"
                            className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-[#A6386B] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/v:scale-x-100"
                          />
                        </span>
                      ))}
                    </span>
                  </a>
                ) : (
                  value
                )}

                <p className="mt-4 max-w-[26ch] text-sm leading-relaxed text-neutral-500">
                  {detail.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

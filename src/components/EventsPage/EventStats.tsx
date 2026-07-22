"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsapReveal } from "@/src/hooks/useGsapReveal";
import { STATS } from "./constants";

gsap.registerPlugin(ScrollTrigger);

/**
 * Event statistics — large animated counters that tick up from zero when they
 * enter the viewport (once). No cards: four figures on a single rhythm line,
 * split by hairline rules on desktop. Counting mutates textContent only (no
 * re-renders); under reduced motion the final value is shown immediately.
 */
export default function EventStats() {
  const scopeRef = useRef<HTMLElement>(null);
  useGsapReveal(scopeRef);

  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(scope);
      const nums = q<HTMLElement>(".stat-number");
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      nums.forEach((el) => {
        const value = Number(el.dataset.value ?? "0");
        const suffix = el.dataset.suffix ?? "";
        if (reduced) {
          el.textContent = `${value}${suffix}`;
          return;
        }
        el.textContent = `0${suffix}`;
        const obj = { v: 0 };
        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          once: true,
          onEnter: () =>
            gsap.to(obj, {
              v: value,
              duration: 1.6,
              ease: "power2.out",
              onUpdate: () => {
                el.textContent = `${Math.floor(obj.v)}${suffix}`;
              },
            }),
        });
      });
    }, scope);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={scopeRef}
      aria-label="Nidham by the numbers"
      data-particles="services"
      className="relative w-full bg-[#1F1F1F] section-y"
    >
      <div className="container-page">
        <dl className="grid grid-cols-2 gap-x-8 gap-y-14 lg:grid-cols-4 lg:gap-x-10">
          {STATS.map((stat) => (
            <div
              key={stat.id}
              data-reveal="up"
              className="flex flex-col lg:border-l lg:border-white/10 lg:pl-8 lg:first:border-l-0 lg:first:pl-0"
            >
              <dd
                className="stat-number font-[family-name:var(--font-cabinet)] text-[clamp(2.5rem,7vw,5rem)] font-normal leading-none tracking-[-0.02em] text-neutral-100 tabular-nums"
                data-value={stat.value}
                data-suffix={stat.suffix}
              >
                {`${stat.value}${stat.suffix}`}
              </dd>
              <dt className="mt-4 text-sm uppercase tracking-[0.16em] text-neutral-400 sm:text-[15px]">
                {stat.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

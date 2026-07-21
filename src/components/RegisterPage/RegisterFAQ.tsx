"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useGsapReveal } from "@/src/hooks/useGsapReveal";
import { EASE } from "@/src/lib/motion";
import { FAQ_ITEMS, FAQ_TITLE } from "./constants";

/**
 * FAQ — an elegant, minimal accordion. One panel open at a time, with a smooth
 * height + fade transition (Framer) and a rotating plus/chevron. Rows are hairline
 * -divided and reveal on scroll via the shared GSAP hook.
 */
export default function RegisterFAQ() {
  const reduce = useReducedMotion() ?? false;
  const scopeRef = useRef<HTMLElement>(null);
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0]?.id ?? null);
  useGsapReveal(scopeRef);

  return (
    <section
      ref={scopeRef}
      aria-label="Frequently asked questions"
      data-particles="services"
      className="relative w-full bg-[#1F1F1F] section-y"
    >
      <div className="container-page">
        <p
          data-reveal="up"
          className="text-xs font-medium uppercase tracking-[0.28em] text-neutral-500 sm:text-sm"
        >
          {FAQ_TITLE}
        </p>

        <div className="mx-auto mt-12 max-w-3xl border-b border-white/10 sm:mt-16">
          {FAQ_ITEMS.map((item) => {
            const open = openId === item.id;
            return (
              <div key={item.id} data-reveal="up" className="border-t border-white/10">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? null : item.id)}
                    aria-expanded={open}
                    data-cursor="button"
                    className="group flex w-full items-center justify-between gap-6 py-6 text-left outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6E1B45] sm:py-7"
                  >
                    <span className="font-[family-name:var(--font-cabinet)] text-[clamp(1.15rem,2.2vw,1.6rem)] font-normal leading-snug tracking-[-0.01em] text-neutral-100 transition-colors duration-300 group-hover:text-white">
                      {item.question}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                        open
                          ? "border-[#6E1B45] text-[#E8A9C6]"
                          : "border-white/15 text-neutral-400 group-hover:border-white/30"
                      }`}
                    >
                      {/* Plus that becomes a minus. */}
                      <span className="absolute h-px w-3.5 bg-current" />
                      <span
                        className={`absolute h-3.5 w-px bg-current transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          open ? "scale-y-0" : "scale-y-100"
                        }`}
                      />
                    </span>
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: reduce ? 0 : 0.4, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-7 pr-12 text-[15px] leading-relaxed text-neutral-400 sm:text-base">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

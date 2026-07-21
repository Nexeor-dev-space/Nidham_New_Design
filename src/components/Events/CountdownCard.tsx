"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCountdown } from "@/src/components/Hero/useCountdown";
import { EASE } from "@/src/lib/motion";

interface CountdownCardProps {
  /** ISO datetime the countdown targets (single-sourced to the top bar). */
  eventDate: string;
  title: string;
  linkText: string;
  linkHref: string;
}

/** Unit labels — identical to the announcement-bar countdown. */
const LABELS = ["Days", "Hrs", "Mins", "Secs"] as const;

/**
 * Premium live-event countdown that overlaps the event image. A frosted-glass
 * card with a soft purple tint and a slow glass sheen; the numbers are driven
 * by the shared `useCountdown` hook against the same date as the top bar, so the
 * two always agree. Each value slides on change (matching the ribbon), and when
 * the target passes the card swaps to a "Registration Closed" status.
 */
export default function CountdownCard({
  eventDate,
  title,
  linkText,
  linkHref,
}: CountdownCardProps) {
  const reduce = useReducedMotion();
  const t = useCountdown(eventDate);

  const values = t
    ? [t.days, t.hours, t.minutes, t.seconds]
    : (["--", "--", "--", "--"] as const);
  const done =
    !!t &&
    t.days === "00" &&
    t.hours === "00" &&
    t.minutes === "00" &&
    t.seconds === "00";

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-white/70 bg-white p-5 shadow-[0_30px_80px_-28px_rgba(58,42,58,0.6)] ring-1 ring-black/[0.04] sm:p-6 lg:p-7"
      aria-label={
        done
          ? `${title}: registration closed`
          : `${title}: ${values[0]} days, ${values[1]} hours, ${values[2]} minutes, ${values[3]} seconds remaining`
      }
    >
      {/* Glass layers — subtle purple tint + a top highlight for depth. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#6E1B45]/[0.07] via-transparent to-[#6E1B45]/[0.03]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-2/3 bg-gradient-to-b from-white/55 to-transparent"
      />
      {/* Slow, subtle moving reflection. */}
      {!reduce && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-y-[40%] left-[-30%] w-1/4 rotate-12 bg-gradient-to-r from-transparent via-white/35 to-transparent blur-lg"
          animate={{ x: ["0%", "560%"] }}
          transition={{
            duration: 7,
            repeat: Infinity,
            repeatDelay: 4.5,
            ease: "easeInOut",
          }}
        />
      )}

      <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        {/* Left — label, title, countdown. */}
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#6E1B45]">
            <span className="relative flex h-1.5 w-1.5">
              {!reduce && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#6E1B45]/60" />
              )}
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#6E1B45]" />
            </span>
            Live Event
          </p>

          <h4 className="mt-2.5 text-[clamp(1.15rem,1.7vw,1.6rem)] font-semibold leading-tight tracking-[-0.01em] text-neutral-900">
            {title}
          </h4>

          {done ? (
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#6E1B45]/10 px-4 py-2 text-sm font-semibold text-[#6E1B45]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#6E1B45]" />
              Registration Closed
            </p>
          ) : (
            <div
              className="mt-4 flex flex-nowrap items-start gap-2 sm:gap-3"
              aria-hidden="true"
            >
              {values.map((value, i) => (
                <div key={LABELS[i]} className="flex items-start">
                  {i > 0 && (
                    <span className="select-none px-1 text-[clamp(1.5rem,2.2vw,2.1rem)] font-light leading-none text-neutral-300 sm:px-1.5">
                      :
                    </span>
                  )}
                  <div className="text-center">
                    <div className="relative flex justify-center overflow-hidden text-[clamp(1.65rem,2.4vw,2.25rem)] font-semibold leading-none tabular-nums text-neutral-900">
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span
                          key={value}
                          initial={{ y: "-70%", opacity: 0 }}
                          animate={{ y: "0%", opacity: 1 }}
                          exit={{ y: "70%", opacity: 0 }}
                          transition={{ duration: 0.32, ease: EASE }}
                        >
                          {value}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                    <div className="mt-2 text-[9px] font-medium uppercase tracking-[0.16em] text-neutral-500 sm:text-[10px]">
                      {LABELS[i]}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right — premium CTA. */}
        <Link
          href={linkHref}
          data-cursor="button"
          className="group inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-full bg-[#6E1B45] px-6 py-3.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-white shadow-[0_14px_34px_-12px_rgba(110,27,69,0.65)] transition-[transform,box-shadow,background-color] duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#5a1639] hover:shadow-[0_20px_44px_-14px_rgba(110,27,69,0.75)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E1B45] focus-visible:ring-offset-2 focus-visible:ring-offset-white active:translate-y-0 sm:w-auto"
        >
          {linkText}
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1"
          >
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

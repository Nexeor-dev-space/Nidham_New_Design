"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ANNOUNCEMENT, EVENT_DATE } from "./constants";
import { useCountdown } from "./useCountdown";
import type { TimeLeft } from "./types";

const COUNTDOWN_UNITS: ReadonlyArray<{ key: keyof TimeLeft; label: string }> = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hrs" },
  { key: "minutes", label: "Mins" },
  { key: "seconds", label: "Secs" },
];

export default function AnnouncementBar() {
  const timeLeft = useCountdown(EVENT_DATE);

  return (
    <motion.aside
      aria-label="Event announcement"
      className="w-full bg-[#251d30] text-white/90"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto flex min-h-[52px] max-w-[1600px] flex-col items-center justify-center gap-2 px-6 py-2.5 text-center text-[13px] sm:flex-row sm:gap-5 sm:py-0 lg:px-10">
        <p className="flex w-full flex-wrap items-center justify-center gap-x-2 gap-y-1 sm:w-auto">
          <span aria-hidden="true">{ANNOUNCEMENT.emoji}</span>
          <a
            href={ANNOUNCEMENT.cta.href}
            className="font-medium text-white underline decoration-white/50 underline-offset-4 transition-colors hover:decoration-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {ANNOUNCEMENT.cta.label} &rarr;
          </a>
          <span aria-hidden="true" className="hidden text-white/30 sm:inline">
            |
          </span>
          <span className="text-white/65">{ANNOUNCEMENT.message}</span>
        </p>

        <div className="flex w-full justify-center sm:w-auto">
          <span className="sr-only">Time remaining until registration closes:</span>
          <span
            aria-hidden={timeLeft === null}
            className="inline-flex items-center gap-1.5 rounded-md border border-white/15 px-3 py-1 font-medium tabular-nums"
          >
            {timeLeft ? (
              COUNTDOWN_UNITS.map((unit, index) => (
                <span key={unit.key} className="inline-flex items-baseline gap-1">
                  {index > 0 && (
                    <span className="mr-1 text-white/25">:</span>
                  )}
                  <span className="relative inline-flex overflow-hidden">
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span
                        key={timeLeft[unit.key]}
                        className="font-semibold text-white"
                        initial={{ y: "-70%", opacity: 0 }}
                        animate={{ y: "0%", opacity: 1 }}
                        exit={{ y: "70%", opacity: 0 }}
                        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                      >
                        {timeLeft[unit.key]}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                  <span className="text-[0.65rem] uppercase tracking-wider text-white/55">
                    {unit.label}
                  </span>
                </span>
              ))
            ) : (
              <span className="text-white/50">-- : -- : -- : --</span>
            )}
          </span>
        </div>
      </div>
    </motion.aside>
  );
}

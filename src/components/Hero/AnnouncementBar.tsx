"use client";

import Image from "next/image";
import { useState } from "react";
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

const EASE = [0.22, 1, 0.36, 1] as const;

export default function AnnouncementBar() {
  const timeLeft = useCountdown(EVENT_DATE);
  const [open, setOpen] = useState(true);

  return (
    <AnimatePresence initial={false}>
      {open && (
    <motion.aside
      key="announcement"
      aria-label="Event announcement"
      className="w-full overflow-hidden bg-[#251d30] text-white/90"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.55, ease: EASE }}
    >
      <div className="relative mx-auto flex min-h-[56px] max-w-[1760px] flex-col items-center justify-center gap-2 px-3 py-2.5 text-center text-[15px] sm:flex-row sm:gap-5 sm:px-12 sm:py-0 sm:pr-16 lg:px-14 lg:pr-20">
        <p className="flex w-full flex-wrap items-center justify-center gap-x-2 gap-y-1 sm:w-auto">
          <Image
            src="/images/calendar-icon.png"
            alt=""
            aria-hidden="true"
            width={20}
            height={20}
            className="h-[18px] w-[18px] shrink-0 object-contain sm:h-5 sm:w-5"
          />
          <a
            href={ANNOUNCEMENT.cta.href}
            className="font-medium text-white underline decoration-white/50 underline-offset-4 transition-colors hover:decoration-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {ANNOUNCEMENT.cta.label} &rarr;
          </a>
          <span aria-hidden="true" className="hidden text-white/30 sm:inline">
            |
          </span>
          <span className="whitespace-nowrap text-white/65">
            {ANNOUNCEMENT.message}
          </span>
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
                  <span className="text-[0.72rem] uppercase tracking-wider text-white/55">
                    {unit.label}
                  </span>
                </span>
              ))
            ) : (
              <span className="text-white/50">-- : -- : -- : --</span>
            )}
          </span>
        </div>

        {/* Dismiss — collapses the ribbon for the current session. */}
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Dismiss announcement"
          data-cursor="button"
          className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full text-white/60 transition-colors duration-200 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:top-1/2 sm:right-3 sm:-translate-y-1/2 lg:right-5"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="h-4 w-4"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </motion.aside>
      )}
    </AnimatePresence>
  );
}

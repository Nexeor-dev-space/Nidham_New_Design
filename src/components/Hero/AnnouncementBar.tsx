"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ANNOUNCEMENT } from "./constants";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The top ribbon.
 *
 * It used to carry a live countdown to `EVENT_DATE` beside the message. That was
 * removed with the switch to Dance off Dubai: the event has no announced date —
 * the featured section reads "To Be Announced" — and a ticking clock is a date
 * claim, so the two contradicted each other on the same screen. It also no
 * longer links anywhere — see `ANNOUNCEMENT.label`. Everything else about the
 * bar is unchanged: colour, height, entrance/exit, dismiss.
 *
 * To bring it back once a date exists, restore `useCountdown(EVENT_DATE)` and
 * the unit list; both are still in the codebase.
 */
export default function AnnouncementBar() {
  const [open, setOpen] = useState(true);

  return (
    <AnimatePresence initial={false}>
      {open && (
    <motion.aside
      key="announcement"
      aria-label="Event announcement"
      className="w-full overflow-hidden bg-[#8c003b] text-white/90"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.55, ease: EASE }}
    >
      <div className="relative mx-auto flex min-h-[56px] max-w-[1760px] flex-col items-center justify-center gap-2 px-3 py-2.5 text-center text-[15px] sm:flex-row sm:gap-5 sm:px-12 sm:py-0 sm:pr-16 lg:px-14 lg:pr-20">
        <p className="flex w-full flex-wrap items-center justify-center gap-x-2 gap-y-1 sm:w-auto">
          {/* Sparkle, drawn rather than fetched. The calendar PNG that was here
              promised a date this event does not have yet, and cost a request
              for a 20px mark. `#FFD83D` is the same amber as the announcement
              card's "Coming Soon" dot, so the ribbon and the card read as one
              announcement. */}
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-[18px] w-[18px] shrink-0 text-[#FFD83D] sm:h-5 sm:w-5"
            fill="currentColor"
          >
            <path d="M12 1.8l2.35 6.35a1 1 0 0 0 .59.59L21.3 11.1a.75.75 0 0 1 0 1.4l-6.36 2.36a1 1 0 0 0-.59.59L12 21.8a.75.75 0 0 1-1.4 0l-2.36-6.35a1 1 0 0 0-.59-.59L1.3 12.5a.75.75 0 0 1 0-1.4l6.35-2.36a1 1 0 0 0 .59-.59L10.6 1.8a.75.75 0 0 1 1.4 0z" />
            <path d="M19.2 2.6l.62 1.68 1.68.62-1.68.62-.62 1.68-.62-1.68-1.68-.62 1.68-.62.62-1.68z" opacity="0.65" />
          </svg>

          {/* Plain text, not a link — there is nowhere for it to send anyone
              yet. It previously routed to /register with a hover-underline and
              a sliding arrow; both were link affordances on non-interactive
              text, which reads as a broken link. */}
          <span className="font-semibold tracking-[0.01em] text-white">
            {ANNOUNCEMENT.label}
          </span>
          <span aria-hidden="true" className="hidden text-white/30 sm:inline">
            |
          </span>
          <span className="whitespace-nowrap text-white/65">
            {ANNOUNCEMENT.message}
          </span>
        </p>

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

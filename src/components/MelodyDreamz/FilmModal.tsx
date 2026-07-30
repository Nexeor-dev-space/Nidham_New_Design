"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EASE } from "@/src/lib/motion";
import { lockScroll, unlockScroll } from "@/src/lib/smoothScroll";

interface FilmModalProps {
  open: boolean;
  onClose: () => void;
  /** YouTube embed URL, without an `autoplay` param. */
  src: string;
  title: string;
}

/**
 * Fullscreen modal for the event film.
 *
 * Replaces an earlier inline swap where pressing play simply exchanged the
 * poster for the iframe. That had no way back: no close control, no Escape, and
 * clicking away did nothing, so once playing the reader was stuck with it.
 *
 * Three things here are deliberate, and two of them are the site's existing
 * video modals' bugs, not repeated:
 *
 * • **The frame is sized so its height can never exceed the viewport.**
 *   `max-w-[min(72rem,calc((100svh-8rem)*16/9))]` caps the *width* from the
 *   available height, so `aspect-video` still holds and the whole 16:9 frame —
 *   including YouTube's own control bar along its bottom edge — stays on screen.
 *   The site's `CinematicVideoModal` and `VideoModal` derive height from
 *   `aspect-video` with no cap, which is why on a landscape phone their controls
 *   sit below the window edge and cannot be reached.
 *
 * • **The close button sits inside the frame's own bounds**, not floating above
 *   it on a negative offset. `VideoModal` uses `-top-11`, which on a short
 *   viewport puts the only way out off-screen entirely.
 *
 * • **The iframe only exists while open.** Nothing is requested from YouTube —
 *   no script, no cookie, no thumbnail — until the reader presses play, and
 *   unmounting on close stops playback outright rather than leaving audio
 *   running behind a hidden element. `autoplay=1` is appended only here, so the
 *   section itself never autoplays.
 */
export default function FilmModal({ open, onClose, src, title }: FilmModalProps) {
  const reduce = useReducedMotion() ?? false;

  // Escape to close, and freeze the page behind. Lenis has to be stopped
  // explicitly — `overflow: hidden` alone does not stop it (see lockScroll).
  useEffect(() => {
    if (!open) return;
    lockScroll();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      unlockScroll();
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="md-film-modal"
          role="dialog"
          aria-modal="true"
          aria-label={title}
          tabIndex={-1}
          ref={(node) => node?.focus()}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          // Clicking the backdrop closes. The frame below stops propagation, so
          // a click on the video itself never reaches this.
          onClick={onClose}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/93 p-4 outline-none backdrop-blur-sm sm:p-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: reduce ? 1 : 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: reduce ? 1 : 0.99 }}
            transition={{ duration: reduce ? 0.2 : 0.4, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
            className="flex w-full max-w-[min(72rem,calc((100svh-8rem)*16/9))] flex-col"
          >
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black ring-1 ring-white/10">
              <iframe
                src={`${src}&autoplay=1`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>

            {/* Caption row, inside the modal's own flow — so the close control
                is always on screen whatever the viewport height. */}
            <div className="mt-4 flex items-center justify-between gap-4">
              <p className="min-w-0 truncate font-[family-name:var(--font-urbanist)] text-[13px] text-neutral-400">
                {title}
              </p>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close video"
                className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-200 outline-none transition-colors duration-300 hover:border-white/45 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Close
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

"use client";

import { useCallback, useEffect } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EASE } from "@/src/lib/motion";
import { lockScroll, unlockScroll } from "@/src/lib/smoothScroll";
import type { GalleryPlate } from "./types";

const SWIPE_THRESHOLD = 60;

interface GalleryLightboxProps {
  plates: readonly GalleryPlate[];
  /** Index of the open plate, or `null` when closed. */
  index: number | null;
  onClose: () => void;
  onNavigate: (next: number) => void;
}

/**
 * Fullscreen lightbox for the gallery.
 *
 * Portaled to `<body>` so `fixed` positions against the viewport rather than
 * any transformed ancestor — the case study is full of GSAP transforms, and a
 * transformed parent silently turns `fixed` into `absolute`.
 *
 * Height is capped at `max-h-[calc(100svh-7rem)]` and the close button lives
 * *inside* the frame. Both are deliberate: the audit found the site's two
 * existing video modals unusable on a landscape phone precisely because they had
 * neither — the panel overflowed and the close button sat off-screen. This does
 * not repeat that.
 *
 * Interaction: Escape closes, ←/→ navigate, the backdrop closes, and a
 * horizontal drag past `SWIPE_THRESHOLD` pages on touch. Focus is moved to the
 * dialog on open so the keyboard bindings are live without the reader hunting
 * for them.
 */
export default function GalleryLightbox({
  plates,
  index,
  onClose,
  onNavigate,
}: GalleryLightboxProps) {
  const reduce = useReducedMotion() ?? false;
  const open = index !== null;
  const plate = open ? plates[index] : null;

  const step = useCallback(
    (delta: number) => {
      if (index === null) return;
      onNavigate((index + delta + plates.length) % plates.length);
    },
    [index, plates.length, onNavigate],
  );

  // Scroll lock + keyboard. Lenis has to be stopped explicitly; `overflow:
  // hidden` alone does not stop it (see lockScroll).
  useEffect(() => {
    if (!open) return;
    lockScroll();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      unlockScroll();
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, step]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && plate && (
        <motion.div
          key="md-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${plate.alt} — image ${(index ?? 0) + 1} of ${plates.length}`}
          tabIndex={-1}
          ref={(node) => node?.focus()}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/92 p-4 outline-none backdrop-blur-sm sm:p-8"
          onClick={onClose}
        >
          <motion.figure
            key={plate.src}
            initial={{ opacity: 0, scale: reduce ? 1 : 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: reduce ? 1 : 0.99 }}
            transition={{ duration: reduce ? 0.2 : 0.45, ease: EASE }}
            drag={reduce || plates.length < 2 ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.14}
            onDragEnd={(_, info) => {
              if (info.offset.x < -SWIPE_THRESHOLD) step(1);
              else if (info.offset.x > SWIPE_THRESHOLD) step(-1);
            }}
            // Stop clicks on the picture itself from reaching the backdrop.
            onClick={(e) => e.stopPropagation()}
            className="relative m-0 flex max-h-[calc(100svh-7rem)] w-full max-w-6xl flex-col"
          >
            <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl bg-neutral-900">
              <Image
                src={plate.src}
                alt={plate.alt}
                width={1600}
                height={1200}
                quality={85}
                className="h-full max-h-[calc(100svh-11rem)] w-full object-contain"
              />
            </div>

            <figcaption className="mt-4 flex items-center justify-between gap-4">
              <span className="font-[family-name:var(--font-urbanist)] text-[13px] text-neutral-400">
                {(index ?? 0) + 1} / {plates.length}
              </span>

              <span className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous image"
                  className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/[0.04] text-neutral-200 outline-none transition-colors duration-300 hover:border-[#E00068]/60 hover:text-[#FF3D8F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF3D8F]"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 5l-7 7 7 7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next image"
                  className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/[0.04] text-neutral-200 outline-none transition-colors duration-300 hover:border-[#E00068]/60 hover:text-[#FF3D8F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF3D8F]"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                {/* Inside the frame, not floating above it — see the docblock. */}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close gallery"
                  className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/[0.04] text-neutral-200 outline-none transition-colors duration-300 hover:border-white/45 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </span>
            </figcaption>
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

"use client";

import { useEffect, useRef } from "react";

interface VideoModalProps {
  open: boolean;
  onClose: () => void;
  /** Embed URL without autoplay; autoplay is appended when opened. */
  videoUrl: string;
  title: string;
}

/**
 * Fullscreen video modal. The iframe mounts only while open (so playback starts
 * on open and stops on close), the backdrop and ESC close it, body scroll locks
 * while open, and focus moves to the close button and is restored on close.
 */
export default function VideoModal({ open, onClose, videoUrl, title }: VideoModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const prevFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    prevFocus.current = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      prevFocus.current?.focus?.();
    };
  }, [open, onClose]);

  const src =
    open && videoUrl
      ? `${videoUrl}${videoUrl.includes("?") ? "&" : "?"}autoplay=1&rel=0`
      : "";

  return (
    <div
      aria-hidden={!open}
      className={`fixed inset-0 z-[120] flex items-center justify-center p-4 transition-opacity duration-300 ease-out ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative z-10 w-full max-w-5xl transition-transform duration-300 ease-out ${
          open ? "scale-100" : "scale-95"
        }`}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          data-cursor="button"
          aria-label="Close video"
          className="absolute -top-11 right-0 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/30 backdrop-blur transition-colors duration-200 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
          >
            <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
          </svg>
        </button>

        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black shadow-[0_40px_120px_-30px_rgba(0,0,0,0.85)]">
          {open && src && (
            <iframe
              src={src}
              title={title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          )}
        </div>
      </div>
    </div>
  );
}

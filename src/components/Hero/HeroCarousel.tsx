"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  CAROUSEL_AUTOPLAY_MS,
  CAROUSEL_FADE_MS,
  HERO_SLIDES,
  SWIPE_THRESHOLD,
} from "./constants";
import type { HeroSlide } from "./types";

interface HeroCarouselProps {
  slides?: readonly HeroSlide[];
}

export default function HeroCarousel({ slides = HERO_SLIDES }: HeroCarouselProps) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const count = slides.length;

  const goTo = useCallback(
    (next: number) => setIndex((next + count) % count),
    [count],
  );
  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  // Autoplay — paused on hover/focus and when the tab is hidden.
  useEffect(() => {
    if (isPaused || count <= 1) return;
    const id = window.setInterval(next, CAROUSEL_AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [isPaused, next, count]);

  // Touch swipe support.
  const onTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0].clientX;
  };
  const onTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      if (delta < 0) next();
      else prev();
    }
    touchStartX.current = null;
  };

  const fadeSeconds = CAROUSEL_FADE_MS / 1000;
  // Slow "Ken Burns" zoom that runs for the full time a slide is on screen.
  const zoomSeconds = (CAROUSEL_AUTOPLAY_MS + CAROUSEL_FADE_MS) / 1000;
  const activeSlide = slides[index];

  return (
    <div
      className="group relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-neutral-200 sm:aspect-[16/9] lg:aspect-[1280/672]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      role="region"
      aria-roledescription="carousel"
      aria-label="Nidham event highlights"
    >
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: fadeSeconds, ease: "easeInOut" },
            scale: { duration: zoomSeconds, ease: "linear" },
          }}
        >
          <Image
            src={activeSlide.src}
            alt={activeSlide.alt}
            fill
            priority={index === 0}
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Live region for screen readers */}
      <p className="sr-only" aria-live="polite">
        Slide {index + 1} of {count}: {activeSlide.alt}
      </p>

      {/* Previous / Next controls */}
      <button
        type="button"
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 text-neutral-900 shadow-sm backdrop-blur-sm transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
      >
        <ChevronIcon className="h-5 w-5 rotate-180" />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 text-neutral-900 shadow-sm backdrop-blur-sm transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
      >
        <ChevronIcon className="h-5 w-5" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
        {slides.map((slide, dot) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => goTo(dot)}
            aria-label={`Go to slide ${dot + 1}`}
            aria-current={dot === index}
            className={`h-2 rounded-full transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
              dot === index ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

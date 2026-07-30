"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { motion } from "framer-motion";
import { EASE_CSS, EASE_POWER3 } from "@/src/lib/motion";

/** Where the level lands the first time sound is turned on. */
export const DEFAULT_VOLUME = 0.6;

export interface AudioSettings {
  muted: boolean;
  volume: number;
}

interface VolumeControlProps {
  /**
   * Called whenever the visitor changes something. This component deliberately
   * never touches the <video> itself — Hero owns that element, so Hero owns
   * every write to it, and this stays a control that only reports intent.
   */
  onChange: (settings: AudioSettings) => void;
  /** Seconds before fading in — after the tagline and button, never during them. */
  delay: number;
  reduce: boolean;
}

/**
 * Sound control for the hero film.
 *
 * The film has to start muted — every browser blocks autoplay with audio — so
 * this is the visitor's way in. It is a mute toggle first and a level control
 * second, which is why the slider is not always on show: at rest the control is
 * a single small circle, and the track slides out either when the pointer is
 * over it or once sound is actually on (when a level to adjust exists). That
 * keeps a media control from becoming a piece of UI sitting on the film.
 *
 * Dragging to zero mutes, and un-muting from zero restores a usable level, so
 * the button and the slider can never disagree about whether sound is on.
 */
export default function VolumeControl({
  onChange,
  delay,
  reduce,
}: VolumeControlProps) {
  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(DEFAULT_VOLUME);

  useEffect(() => {
    onChange({ muted, volume });
  }, [muted, volume, onChange]);

  const on = !muted;

  const handleSlider = (next: number) => {
    setVolume(next);
    // The two controls stay in agreement: silence is mute, and any level is not.
    setMuted(next === 0);
  };

  const toggle = () => {
    if (muted && volume === 0) setVolume(DEFAULT_VOLUME);
    setMuted((m) => !m);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduce ? 0.4 : 0.8,
        ease: EASE_POWER3,
        delay: reduce ? 0.5 : delay,
      }}
      // Mid height on the left flank — the one part of the frame the
      // bottom-anchored tagline never reaches, at any width. `pointer-events-none`
      // on the full-height wrapper so this strip can't swallow clicks meant for
      // the film; the control itself takes them back.
      className="pointer-events-none absolute inset-y-0 left-0 z-30 flex items-center"
    >
      {/* Same gutter as every other section, so the control lands on the page's
          left edge line rather than at an arbitrary offset. */}
      <div className="container-page pointer-events-auto">
        <div
          className="group/vol flex w-fit items-center rounded-full border border-white/35 bg-black/25 p-1 backdrop-blur-md transition-[border-color,background-color] duration-500 hover:border-white/70 hover:bg-black/40 focus-within:border-white/70"
          style={{ transitionTimingFunction: EASE_CSS }}
        >
          <button
            type="button"
            onClick={toggle}
            data-cursor="button"
            aria-pressed={on}
            aria-label={on ? "Mute video" : "Unmute video"}
            className={`relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full outline-none transition-[background-color,color] duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF3D8F] motion-safe:active:scale-95 sm:h-10 sm:w-10 ${
              on
                ? "bg-[#E00068] text-white hover:bg-[#8C003B]"
                : "text-white/85 hover:bg-white/15 hover:text-white"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="h-[18px] w-[18px]"
            >
              <path d="M11 5 6 9H3v6h3l5 4V5Z" />
              {on ? (
                <>
                  <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                  <path d="M18.5 5.5a9 9 0 0 1 0 13" />
                </>
              ) : (
                <path d="m16 9 5 6m0-6-5 6" />
              )}
            </svg>
          </button>

          {/* Collapsed to zero width until it is wanted. The `0fr → 1fr` grid
              track is what makes that animate: `width: auto` is not
              interpolable, a grid track is. The inner wrapper must keep
              `overflow-hidden` or the slider spills out while collapsed. */}
          <div
            data-open={on}
            className="grid grid-cols-[0fr] transition-[grid-template-columns] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/vol:grid-cols-[1fr] group-focus-within/vol:grid-cols-[1fr] data-[open=true]:grid-cols-[1fr] motion-reduce:transition-none"
          >
            <div className="overflow-hidden">
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={volume}
                onChange={(e) => handleSlider(Number(e.target.value))}
                aria-label="Volume"
                data-cursor="button"
                className="volume-slider ml-2 mr-3 block"
                style={{ "--vol": `${volume * 100}%` } as CSSProperties}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

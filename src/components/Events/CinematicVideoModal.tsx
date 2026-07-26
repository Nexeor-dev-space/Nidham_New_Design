"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { lockScroll, unlockScroll } from "@/src/lib/smoothScroll";
import { EASE_CSS } from "@/src/lib/motion";

interface CinematicVideoModalProps {
  /**
   * Called once the closing animation has finished — so the caller can render
   * this conditionally and simply drop it. See the note on ownership below.
   */
  onClose: () => void;
  /** Path to a self-hosted file, e.g. "/video/nidham_yt.mp4". */
  src: string;
  /** Dialog name + the caption above the frame. */
  title: string;
  /** Held frame shown while the file buffers — pass the card's own thumbnail so
   *  the lightbox opens on the exact image the user just clicked. */
  poster: string;
  posterAlt: string;
}

/**
 * The site's cinematic video lightbox — a self-hosted <video> with hand-built
 * controls, not a default player and not an embed.
 *
 * ── Ownership: mounted means open ────────────────────────────────────────────
 * There is no `open` prop. The caller renders this component to open it and
 * stops rendering it to close it, which means every session starts from a clean
 * slate — no spinner state or "ready" flag survives from the last run, and no
 * effect has to reset anything. The catch that shape has to solve is the exit
 * animation, so closing is inverted: every close path calls `requestClose()`,
 * which pauses instantly, plays the outro, and only *then* calls `onClose` for
 * the parent to unmount us.
 *
 * A consequence worth stating: the <video> element does not exist until this
 * component does. "Don't fetch 45 MB until the user asks" is therefore
 * structural, not a `preload` hint we hope the browser honours. On the way out
 * the element is paused on the same tick as the click (audio must not outlive
 * the gesture by 340ms), then its `src` is dropped so a half-finished buffer
 * stops downloading.
 *
 * ── The playhead never re-renders React ──────────────────────────────────────
 * `timeupdate` fires ~4×/s (visibly chunky) and a rAF loop calling setState
 * would re-render this tree 60×/s. Instead the loop writes straight to the DOM —
 * `transform: scaleX()` on the two fill bars, `textContent` on the time label,
 * `left` on the thumb. React state is kept for discrete things only (playing,
 * muted, buffering…). That is what the four extra refs are for.
 *
 * ── Accessibility ────────────────────────────────────────────────────────────
 * `role="dialog"` + `aria-modal` + a labelled title; focus moves into the panel
 * on open, is trapped there, and returns to the trigger on close (with
 * `preventScroll`, so restoring focus can never move the page). Four ways out —
 * backdrop, ESC, the ✕ on the frame, the labelled Close button. Player shortcuts
 * (space/K, ←/→, M, F) stand down whenever a slider has focus, so the arrow keys
 * still belong to the seek and volume ranges.
 */
export default function CinematicVideoModal({
  onClose,
  src,
  title,
  poster,
  posterAlt,
}: CinematicVideoModalProps) {
  const titleId = useId();

  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Written by the rAF loop, never by React.
  const playedRef = useRef<HTMLDivElement>(null);
  const bufferedRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);
  const seekRef = useRef<HTMLInputElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);

  const prevFocus = useRef<HTMLElement | null>(null);
  const scrubbing = useRef(false);
  const hideTimer = useRef<number | null>(null);
  /** Makes `requestClose` idempotent — ESC during the outro must not restart it. */
  const closing = useRef(false);
  /**
   * Was the control bar visible when the current tap started? Read at
   * `pointerdown`, acted on at `click` — because the shell's own `pointerdown`
   * reveals the bar first, so by click time the live state always says "visible"
   * and a tap meant to summon the controls would pause the film instead.
   */
  const barVisibleOnPress = useRef(true);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [duration, setDuration] = useState(0);
  const [buffering, setBuffering] = useState(true);
  const [ready, setReady] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [controlsShown, setControlsShown] = useState(true);

  // Read once, at mount, from a lazy initialiser — a plain environment probe
  // that never changes for the life of the dialog.
  const [pipAvailable] = useState(
    () =>
      typeof document !== "undefined" &&
      "pictureInPictureEnabled" in document &&
      document.pictureInPictureEnabled,
  );

  /* ---------------------------------------------------------------- handlers */

  /**
   * Show the control bar and arm its idle timer. The bar only ever hides while
   * the film is actually playing AND focus is elsewhere — so a keyboard user
   * cannot lose the controls they are tabbing through, and a paused player
   * always shows its chrome. The ✕ on the frame sits outside this entirely.
   */
  const revealControls = useCallback(() => {
    setControlsShown(true);
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => {
      const shell = shellRef.current;
      const active = document.activeElement as HTMLElement | null;
      if (shell && active && shell.contains(active)) return;
      if (videoRef.current && !videoRef.current.paused) setControlsShown(false);
    }, 2800);
  }, []);

  const requestClose = useCallback(() => {
    if (closing.current) return;
    closing.current = true;

    // Silence first. Everything after this is cosmetic and can take its 340ms.
    videoRef.current?.pause();
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture().catch(() => {});
    }
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }

    // Runs once the frame is off screen.
    const finish = () => {
      const v = videoRef.current;
      if (v) {
        v.pause();
        // Drop the source so a partly-buffered file stops downloading.
        v.removeAttribute("src");
        v.load();
      }
      onClose();
    };

    const backdrop = backdropRef.current;
    const panel = panelRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!backdrop || !panel || reduce) {
      finish();
      return;
    }

    gsap.killTweensOf([backdrop, panel]);
    gsap
      .timeline({ onComplete: finish })
      // `opacity`, not `autoAlpha` — see the entrance effect for why the panel
      // must never carry `visibility: hidden`.
      .to(panel, { opacity: 0, scale: 0.96, duration: 0.34, ease: "power2.in" }, 0)
      .to(backdrop, { autoAlpha: 0, duration: 0.42, ease: "power2.in" }, 0.06);
  }, [onClose]);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused || v.ended) {
      v.play().catch(() => setPlaying(false));
    } else {
      v.pause();
    }
    revealControls();
  }, [revealControls]);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    // Un-muting a slider someone dragged to zero would look broken, so give it
    // something audible to come back to.
    if (!v.muted && v.volume === 0) v.volume = 0.6;
    revealControls();
  }, [revealControls]);

  const toggleFullscreen = useCallback(() => {
    const shell = shellRef.current;
    if (!shell) return;
    const done = () => revealControls();
    if (document.fullscreenElement) {
      document.exitFullscreen().then(done, done);
    } else {
      // Fullscreen the shell, not the <video> — that keeps our own controls on
      // screen instead of handing over to the browser's native chrome.
      shell.requestFullscreen().then(done, done);
    }
  }, [revealControls]);

  const togglePip = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    const swallow = () => {};
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture().catch(swallow);
    } else {
      v.requestPictureInPicture().catch(swallow);
    }
  }, []);

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v || !Number.isFinite(v.duration) || v.duration <= 0) return;
    const p = Number(e.target.value) / 1000;
    v.currentTime = p * v.duration;
    // Paint the new position on this tick — waiting for `seeked` would show the
    // bar snap back to the old spot first.
    if (playedRef.current) playedRef.current.style.transform = `scaleX(${p})`;
    if (thumbRef.current) thumbRef.current.style.left = `${p * 100}%`;
    if (timeRef.current) timeRef.current.textContent = formatTime(v.currentTime);
  };

  const onVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const next = Number(e.target.value) / 100;
    v.volume = next;
    v.muted = next === 0;
  };

  /* ----------------------------------------------------------------- effects */

  // Entrance. Both elements render already-invisible via inline styles, so there
  // is no first-paint flash whether this runs before or after the browser paints.
  //
  // The panel animates `opacity`, NOT `autoAlpha`, and its inline style sets
  // opacity alone — deliberately. `autoAlpha` would park it at
  // `visibility: hidden`, and a `visibility: hidden` element cannot take focus:
  // the focus call below would silently do nothing until GSAP's first tick
  // flipped visibility back, which is a race it loses outright on a slow main
  // thread. An `opacity: 0` element is fully focusable, so focus and animation
  // stop depending on each other. The backdrop keeps `autoAlpha` — nothing ever
  // focuses it.
  useEffect(() => {
    const backdrop = backdropRef.current;
    const panel = panelRef.current;
    if (!backdrop || !panel) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(backdrop, { autoAlpha: 1 });
      gsap.set(panel, { opacity: 1, scale: 1 });
      return;
    }

    const tl = gsap.timeline();
    tl.fromTo(
      backdrop,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.45, ease: "power2.out" },
      0,
    ).fromTo(
      panel,
      { opacity: 0, scale: 0.92 },
      { opacity: 1, scale: 1, duration: 0.6, ease: "power3.out" },
      0.04,
    );
    return () => {
      tl.kill();
    };
  }, []);

  // Scroll lock (Lenis included) + focus restoration. `overflow: hidden` on
  // <html> freezes the page without moving it, so closing lands on the same
  // scroll offset and nothing behind us re-renders.
  useEffect(() => {
    prevFocus.current = document.activeElement as HTMLElement | null;
    lockScroll();
    return () => {
      unlockScroll();
      prevFocus.current?.focus?.({ preventScroll: true });
    };
  }, []);

  // Move focus into the dialog. The panel itself takes it (rather than a
  // control) so screen readers announce the dialog and its name first.
  //
  // Two frames, not a timer: one for the browser to commit the portal, one to be
  // safe — and no dependency on how far the entrance animation has progressed.
  // A timer tuned to the animation is exactly the bug this replaced.
  useEffect(() => {
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() =>
        panelRef.current?.focus({ preventScroll: true }),
      );
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, []);

  // The click that mounted us is the user gesture authorising sound. If the
  // browser still refuses, land paused — showing the centre badge — rather than
  // failing silently.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {
      setPlaying(false);
      setBuffering(false);
      revealControls();
    });
  }, [revealControls]);

  // Media element → React state.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onLoaded = () => {
      setDuration(Number.isFinite(v.duration) ? v.duration : 0);
      setReady(true);
      setBuffering(false);
    };
    const onWaiting = () => setBuffering(true);
    const onPlaying = () => {
      setBuffering(false);
      setPlaying(true);
      revealControls();
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => {
      setPlaying(false);
      revealControls();
    };
    const onEnded = () => {
      setPlaying(false);
      revealControls();
    };
    const onVolume = () => {
      setMuted(v.muted);
      setVolume(v.volume);
    };
    const onSeeking = () => setBuffering(true);
    const onSeeked = () => setBuffering(false);
    const onDuration = () =>
      setDuration(Number.isFinite(v.duration) ? v.duration : 0);

    v.addEventListener("loadeddata", onLoaded);
    v.addEventListener("waiting", onWaiting);
    v.addEventListener("playing", onPlaying);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("ended", onEnded);
    v.addEventListener("volumechange", onVolume);
    v.addEventListener("seeking", onSeeking);
    v.addEventListener("seeked", onSeeked);
    v.addEventListener("durationchange", onDuration);

    return () => {
      v.removeEventListener("loadeddata", onLoaded);
      v.removeEventListener("waiting", onWaiting);
      v.removeEventListener("playing", onPlaying);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("ended", onEnded);
      v.removeEventListener("volumechange", onVolume);
      v.removeEventListener("seeking", onSeeking);
      v.removeEventListener("seeked", onSeeked);
      v.removeEventListener("durationchange", onDuration);
    };
  }, [revealControls]);

  // The playhead loop — DOM writes only, no setState. See the header note.
  useEffect(() => {
    let raf = 0;
    let lastSecond = -1;

    const tick = () => {
      const v = videoRef.current;
      if (v) {
        const d = v.duration;
        if (Number.isFinite(d) && d > 0) {
          if (!scrubbing.current) {
            const p = Math.min(1, Math.max(0, v.currentTime / d));
            if (playedRef.current) {
              playedRef.current.style.transform = `scaleX(${p})`;
            }
            if (thumbRef.current) thumbRef.current.style.left = `${p * 100}%`;
            if (seekRef.current) {
              seekRef.current.value = String(Math.round(p * 1000));
            }
          }
          if (bufferedRef.current && v.buffered.length > 0) {
            const end = v.buffered.end(v.buffered.length - 1);
            bufferedRef.current.style.transform = `scaleX(${Math.min(1, end / d)})`;
          }
        }
        const secs = Math.floor(v.currentTime);
        if (secs !== lastSecond) {
          lastSecond = secs;
          if (timeRef.current) {
            timeRef.current.textContent = formatTime(v.currentTime);
          }
          // Kept in step imperatively too, so the announced position stays
          // truthful without costing a render.
          seekRef.current?.setAttribute(
            "aria-valuetext",
            `${formatTime(v.currentTime)} of ${formatTime(v.duration)}`,
          );
        }
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // A scrub that ends outside the slider still has to release the playhead.
  useEffect(() => {
    const release = () => {
      scrubbing.current = false;
    };
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    return () => {
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
    };
  }, []);

  // Leaving the tab pauses — except in Picture-in-Picture, which exists
  // precisely so playback survives leaving the tab.
  useEffect(() => {
    const onVisibility = () => {
      if (!document.hidden) return;
      if (document.pictureInPictureElement) return;
      videoRef.current?.pause();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    const onChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // ESC, the focus trap, and the player shortcuts.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const panel = panelRef.current;
      if (!panel) return;

      if (e.key === "Escape") {
        e.preventDefault();
        requestClose();
        return;
      }

      if (e.key === "Tab") {
        const nodes = Array.from(
          panel.querySelectorAll<HTMLElement>(FOCUSABLE),
        ).filter((n) => n.tabIndex !== -1);
        if (nodes.length === 0) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (!active || !panel.contains(active) || active === panel) {
          e.preventDefault();
          (e.shiftKey ? last : first).focus();
          return;
        }
        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
        return;
      }

      // Hand the arrows back to whichever slider has focus.
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.isContentEditable)) {
        return;
      }

      const v = videoRef.current;
      if (!v) return;
      const key = e.key.toLowerCase();
      if (key === " " || key === "k") {
        e.preventDefault();
        togglePlay();
      } else if (key === "arrowright") {
        e.preventDefault();
        v.currentTime = Math.min(v.duration || 0, v.currentTime + 5);
        revealControls();
      } else if (key === "arrowleft") {
        e.preventDefault();
        v.currentTime = Math.max(0, v.currentTime - 5);
        revealControls();
      } else if (key === "m") {
        e.preventDefault();
        toggleMute();
      } else if (key === "f") {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [requestClose, togglePlay, toggleMute, toggleFullscreen, revealControls]);

  // Belt and braces: if we are torn down by anything other than `requestClose`
  // (a route change, say), playback must still stop.
  useEffect(() => {
    const v = videoRef.current;
    return () => {
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
      v?.pause();
    };
  }, []);

  /* ------------------------------------------------------------------ render */

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[130]">
      {/* Backdrop — one of the four ways out. */}
      <div
        ref={backdropRef}
        aria-hidden="true"
        onClick={requestClose}
        style={{ opacity: 0, visibility: "hidden" }}
        className="absolute inset-0 bg-black/[0.88] backdrop-blur-xl"
      />

      {/* The positioning layer is click-through, so the padding around the frame
          counts as "outside" and closes. The panel takes its events back. */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
          // Opacity only — no `visibility`, so the panel is focusable from its
          // very first frame. See the entrance effect.
          style={{ opacity: 0 }}
          className="pointer-events-auto w-full max-w-[1100px] outline-none"
        >
          {/* Caption + the labelled Close. Both stand down in fullscreen, where
              the ✕ on the frame is still there. */}
          {!fullscreen && (
            <div className="mb-3 flex items-center justify-between gap-4 sm:mb-4">
              <p
                id={titleId}
                className="min-w-0 truncate text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-300 sm:text-[11px]"
              >
                {title}
              </p>
              <button
                type="button"
                onClick={requestClose}
                data-cursor="button"
                style={{ transitionTimingFunction: EASE_CSS }}
                className="shrink-0 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-200 outline-none transition-[background-color,border-color,color] duration-300 hover:border-[#FFD83D]/60 hover:bg-[#FFD83D] hover:text-[#6E1B45] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD83D] sm:text-[11px]"
              >
                Close
              </button>
            </div>
          )}

          {/* The frame. In fullscreen a fixed 16:9 box would overflow the
              viewport, so the aspect lock, the radius and the glow all drop. */}
          <div
            ref={shellRef}
            onMouseMove={revealControls}
            onPointerDown={revealControls}
            className={`relative w-full overflow-hidden bg-black ${
              fullscreen
                ? "h-screen"
                : "aspect-video rounded-[24px] ring-1 ring-white/10 shadow-[0_60px_140px_-50px_rgba(0,0,0,0.9),0_0_120px_-30px_rgba(110,27,69,0.55),0_0_190px_-60px_rgba(199,154,46,0.3)]"
            }`}
          >
            {/* Held frame — the card's own thumbnail, so the lightbox opens on
                the image just clicked and crossfades into the film. */}
            <Image
              src={poster}
              alt={posterAlt}
              fill
              sizes="(max-width: 1200px) 100vw, 1100px"
              quality={90}
              className={`object-cover transition-opacity duration-500 ease-out ${
                ready ? "opacity-0" : "opacity-100"
              }`}
            />

            <video
              ref={videoRef}
              src={src}
              preload="auto"
              playsInline
              className={`relative h-full w-full object-contain transition-opacity duration-500 ease-out ${
                ready ? "opacity-100" : "opacity-0"
              }`}
            >
              Your browser cannot play this video.
            </video>

            {/* Tap-anywhere layer. Kept out of the a11y tree — the labelled
                control in the bar is what screen readers should find — and below
                the bar, so control clicks never reach it.

                When the bar is hidden it summons the bar instead of toggling
                playback. That is what makes the player usable on touch, where
                there is no hover to bring the controls back and the only other
                outcome of reaching for them would be an accidental pause. */}
            <div
              role="presentation"
              onPointerDown={() => {
                barVisibleOnPress.current = controlsShown;
              }}
              onClick={() =>
                barVisibleOnPress.current ? togglePlay() : revealControls()
              }
              data-cursor="button"
              className="absolute inset-0 z-10"
            />

            {/* Scrim — carries the controls' legibility, so it fades with them. */}
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-x-0 bottom-0 z-20 h-36 bg-gradient-to-t from-black/85 via-black/35 to-transparent transition-opacity duration-300 ${
                controlsShown ? "opacity-100" : "opacity-0"
              }`}
            />

            {/* Paused badge — visual only; the layer beneath takes the click. */}
            {!playing && ready && !buffering && (
              <div className="pointer-events-none absolute inset-0 z-20 grid place-items-center">
                <span className="grid h-16 w-16 place-items-center rounded-full border border-white/25 bg-black/50 backdrop-blur-md sm:h-20 sm:w-20">
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-6 w-6 translate-x-[1px] fill-[#FFD83D] sm:h-7 sm:w-7"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </div>
            )}

            {buffering && (
              <div
                role="status"
                className="pointer-events-none absolute inset-0 z-30 grid place-items-center"
              >
                <span
                  aria-hidden="true"
                  className="h-11 w-11 animate-spin rounded-full border-2 border-white/20 border-t-[#FFD83D]"
                />
                <span className="sr-only">Loading video</span>
              </div>
            )}

            {/* ✕ — deliberately outside the auto-hide, so there is always a
                visible way out on touch, where there is no hover to summon the
                control bar back. */}
            <button
              type="button"
              onClick={requestClose}
              data-cursor="button"
              aria-label="Close video"
              style={{ transitionTimingFunction: EASE_CSS }}
              className="absolute right-3 top-3 z-40 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/50 text-neutral-100 backdrop-blur-md outline-none transition-[background-color,border-color,color] duration-300 hover:border-[#FFD83D]/60 hover:bg-[#FFD83D] hover:text-[#6E1B45] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD83D] sm:right-4 sm:top-4"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                aria-hidden="true"
                className="h-[18px] w-[18px]"
              >
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>

            {/* Control bar. `onFocus` bubbles, so tabbing into a hidden bar
                brings it straight back rather than stranding the caret. */}
            <div
              onFocus={revealControls}
              style={{ transitionTimingFunction: EASE_CSS }}
              className={`absolute inset-x-0 bottom-0 z-40 px-3 pb-3 pt-8 transition-[opacity,transform] duration-300 sm:px-5 sm:pb-4 ${
                controlsShown
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none translate-y-2 opacity-0"
              }`}
            >
              {/* Seek. A transparent native range sits on top of the drawn
                  track, so pointer dragging, arrow keys and screen-reader
                  support come for free while the visuals stay ours. */}
              <div className="group/seek relative h-6 w-full">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-white/20"
                >
                  <div
                    ref={bufferedRef}
                    className="h-full w-full origin-left scale-x-0 bg-white/30"
                  />
                  <div
                    ref={playedRef}
                    className="absolute inset-0 h-full w-full origin-left scale-x-0 bg-[#FFD83D]"
                  />
                </div>
                <span
                  ref={thumbRef}
                  aria-hidden="true"
                  style={{ left: "0%" }}
                  className="pointer-events-none absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFD83D] opacity-0 shadow-[0_0_12px_rgba(255,216,61,0.7)] transition-opacity duration-200 group-hover/seek:opacity-100 group-focus-within/seek:opacity-100"
                />
                <input
                  ref={seekRef}
                  type="range"
                  min={0}
                  max={1000}
                  step={1}
                  defaultValue={0}
                  aria-label="Seek"
                  onChange={onSeek}
                  onPointerDown={() => {
                    scrubbing.current = true;
                  }}
                  className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent opacity-0 outline-none"
                />
              </div>

              <div className="mt-1 flex items-center gap-1.5 sm:gap-3">
                <button
                  type="button"
                  onClick={togglePlay}
                  data-cursor="button"
                  aria-label={playing ? "Pause" : "Play"}
                  style={{ transitionTimingFunction: EASE_CSS }}
                  className={CONTROL}
                >
                  {playing ? (
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="h-4 w-4 fill-current"
                    >
                      <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="h-4 w-4 translate-x-[1px] fill-current"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>

                <span className="select-none text-[10px] tabular-nums tracking-[0.08em] text-neutral-300 sm:text-[12px]">
                  <span ref={timeRef}>0:00</span>
                  <span className="text-neutral-500"> / {formatTime(duration)}</span>
                </span>

                <span className="flex-1" />

                <button
                  type="button"
                  onClick={toggleMute}
                  data-cursor="button"
                  aria-label={muted || volume === 0 ? "Unmute" : "Mute"}
                  style={{ transitionTimingFunction: EASE_CSS }}
                  className={CONTROL}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    aria-hidden="true"
                    className="h-[18px] w-[18px]"
                  >
                    <path d="M11 5 6.5 9H3v6h3.5L11 19z" />
                    {muted || volume === 0 ? (
                      <path d="M16 9.5l4 5M20 9.5l-4 5" />
                    ) : (
                      <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" />
                    )}
                  </svg>
                </button>

                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={muted ? 0 : Math.round(volume * 100)}
                  onChange={onVolumeChange}
                  aria-label="Volume"
                  className="h-1 w-12 cursor-pointer accent-[#FFD83D] sm:w-20"
                />

                {pipAvailable && (
                  <button
                    type="button"
                    onClick={togglePip}
                    data-cursor="button"
                    aria-label="Picture in picture"
                    style={{ transitionTimingFunction: EASE_CSS }}
                    className={CONTROL}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      className="h-[18px] w-[18px]"
                    >
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <rect
                        x="12"
                        y="12"
                        width="7"
                        height="5"
                        rx="1"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                )}

                <button
                  type="button"
                  onClick={toggleFullscreen}
                  data-cursor="button"
                  aria-label={fullscreen ? "Exit full screen" : "Full screen"}
                  style={{ transitionTimingFunction: EASE_CSS }}
                  className={CONTROL}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="h-[18px] w-[18px]"
                  >
                    {fullscreen ? (
                      <path d="M9 4H4v5M15 4h5v5M15 20h5v-5M9 20H4v-5" />
                    ) : (
                      <path d="M4 9V4h5M20 9V4h-5M20 15v5h-5M4 15v5h5" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

/** `mm:ss`, tolerant of the NaN/Infinity a video reports before metadata lands. */
function formatTime(seconds: number): string {
  const s = Number.isFinite(seconds) && seconds > 0 ? seconds : 0;
  const mins = Math.floor(s / 60);
  const secs = Math.floor(s % 60);
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

/** One skin for every icon control — the site's amber/plum hover swap. */
const CONTROL =
  "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.07] text-neutral-100 outline-none transition-[background-color,border-color,color] duration-300 hover:border-[#FFD83D]/60 hover:bg-[#FFD83D] hover:text-[#6E1B45] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD83D] sm:h-10 sm:w-10";

/**
 * Focus-trap candidates. `[tabindex="-1"]` is excluded here *and* filtered again
 * at the call site, because the dialog panel itself carries `tabIndex={-1}` to
 * receive the initial focus and must never become a Tab stop.
 */
const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

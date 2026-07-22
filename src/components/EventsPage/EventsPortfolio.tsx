"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GalleryItem from "./GalleryItem";
import { CONTACT_TARGET_ID, EVENT_FILTERS, PORTFOLIO_EVENTS } from "./constants";
import { scrollToId } from "@/src/lib/nav";

gsap.registerPlugin(ScrollTrigger);

/** Server render matches client's first paint; layout effects only run client. */
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * The editorial event portfolio — a ykwmi-style premium filtering experience,
 * adapted (not copied) for Nidham.
 *
 *  - A sticky, text-only filter bar (no pills/buttons) with a single GSAP-driven
 *    underline indicator that slides + resizes to the active category.
 *  - A uniform, equal-height grid of {@link GalleryItem}s (every card shares one
 *    aspect ratio), filtered live with no reload.
 *  - Switching categories runs a GSAP transition: the current items fade + scale
 *    to 0.98 + blur out, the list swaps, then the new items fade up + scale to 1
 *    with a staggered reveal. A gentle scrubbed parallax keeps each image alive.
 *
 * Everything is skipped/instant under prefers-reduced-motion.
 */
export default function EventsPortfolio() {
  const reduce = useReducedMotion() ?? false;

  // `active` drives the indicator + highlight instantly; `rendered` is the
  // category whose items are actually shown (swapped after the fade-out).
  const [active, setActive] = useState<string>(EVENT_FILTERS[0]);
  const [rendered, setRendered] = useState<string>(EVENT_FILTERS[0]);
  const busy = useRef(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const btns = useRef<Map<string, HTMLButtonElement>>(new Map());
  // First render reveals on scroll; later (filter) renders reveal immediately.
  const firstRun = useRef(true);

  const visible =
    rendered === "All"
      ? PORTFOLIO_EVENTS
      : PORTFOLIO_EVENTS.filter((e) => e.category === rendered);

  // ----- Sliding underline indicator ---------------------------------------
  const moveIndicator = (cat: string, animate: boolean) => {
    const btn = btns.current.get(cat);
    const ind = indicatorRef.current;
    if (!btn || !ind) return;
    gsap.to(ind, {
      x: btn.offsetLeft,
      width: btn.offsetWidth,
      duration: animate && !reduce ? 0.5 : 0,
      ease: "power3.out",
    });
  };

  // Position on mount (and after fonts settle) + keep it correct on resize.
  useIsoLayoutEffect(() => {
    moveIndicator(active, false);
    const raf = requestAnimationFrame(() => moveIndicator(active, false));
    const onResize = () => moveIndicator(active, false);
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Slide whenever the active filter changes.
  useEffect(() => {
    moveIndicator(active, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // ----- Reveal / parallax for the currently-rendered items ----------------
  useIsoLayoutEffect(() => {
    const root = galleryRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(".gallery-item");
      if (!items.length) return;

      if (reduce) {
        gsap.set(items, { autoAlpha: 1, y: 0, scale: 1 });
        busy.current = false;
        return;
      }

      // Reveal — fade up + scale to 1, staggered (blur is reserved for the out
      // transition; a transform-only reveal stays smooth at 60fps).
      const revealVars = {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.06,
      };
      gsap.set(items, { autoAlpha: 0, y: 26, scale: 0.98 });

      if (firstRun.current) {
        // Initial load — reveal each row as it scrolls into view.
        firstRun.current = false;
        busy.current = false;
        ScrollTrigger.batch(items, {
          start: "top 88%",
          once: true,
          onEnter: (batch) => gsap.to(batch, { ...revealVars, overwrite: true }),
        });
      } else {
        // Filter change — the gallery is already in view, so reveal at once.
        gsap.to(items, {
          ...revealVars,
          onComplete: () => {
            busy.current = false;
            ScrollTrigger.refresh();
          },
        });
      }

      // Subtle scrubbed parallax on each image.
      items.forEach((item) => {
        const media = item.querySelector<HTMLElement>(".gallery-media");
        if (!media) return;
        gsap.fromTo(
          media,
          { yPercent: -2 },
          {
            yPercent: 2,
            ease: "none",
            scrollTrigger: {
              trigger: item,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    }, root);

    return () => ctx.revert();
  }, [rendered, reduce]);

  // ----- Filter switch -----------------------------------------------------
  const pick = (cat: string) => {
    if (cat === active || busy.current) return;
    setActive(cat); // indicator + highlight move immediately
    if (reduce) {
      setRendered(cat);
      return;
    }
    busy.current = true;
    const items = gsap.utils.toArray<HTMLElement>(".gallery-item", galleryRef.current);
    if (!items.length) {
      setRendered(cat);
      return;
    }
    // Fade + scale 0.98 + blur the current gallery out, then swap.
    gsap.to(items, {
      autoAlpha: 0,
      scale: 0.98,
      filter: "blur(6px)",
      y: -10,
      duration: 0.4,
      ease: "power2.out",
      stagger: 0.02,
      onComplete: () => setRendered(cat),
    });
  };

  const handleOpen = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    scrollToId(CONTACT_TARGET_ID, reduce);
  };

  return (
    <section
      ref={rootRef}
      aria-label="Event portfolio"
      data-particles="gallery"
      className="relative w-full overflow-hidden bg-[#141414]"
    >
      {/* Ambient backdrop — soft radial glows + faint grain; never flat black. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -left-40 top-[10%] h-[36rem] w-[36rem] rounded-full bg-[#6E1B45]/[0.10] blur-[120px]" />
        <div className="absolute -right-44 top-[45%] h-[40rem] w-[40rem] rounded-full bg-amber-300/[0.05] blur-[130px]" />
        <div className="absolute -left-32 top-[80%] h-[38rem] w-[38rem] rounded-full bg-[#6E1B45]/[0.08] blur-[125px]" />
        <div className="hero-grain absolute inset-0 opacity-[0.03] mix-blend-soft-light" />
      </div>

      {/* Sticky filter bar — text only, GSAP underline indicator. */}
      <div className="sticky top-0 z-30 border-b border-white/10 bg-[#141414]/80 backdrop-blur-md">
        <div className="container-page">
          <div
            ref={trackRef}
            className="relative flex items-center gap-7 overflow-x-auto py-5 sm:gap-9 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {EVENT_FILTERS.map((cat) => (
              <button
                key={cat}
                type="button"
                ref={(el) => {
                  if (el) btns.current.set(cat, el);
                  else btns.current.delete(cat);
                }}
                onClick={() => pick(cat)}
                aria-pressed={active === cat}
                className={`relative shrink-0 whitespace-nowrap font-[family-name:var(--font-urbanist)] text-[13px] font-medium uppercase tracking-[0.18em] outline-none transition-colors duration-300 focus-visible:text-white sm:text-sm ${
                  active === cat
                    ? "text-white"
                    : "text-neutral-500 hover:text-neutral-200"
                }`}
              >
                {cat}
              </button>
            ))}
            {/* Single sliding indicator. */}
            <span
              ref={indicatorRef}
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 left-0 h-px w-0 bg-[linear-gradient(90deg,#6E1B45,#A6386B)] shadow-[0_0_10px_rgba(166,56,107,0.5)]"
            />
          </div>
        </div>
      </div>

      {/* Uniform equal-height gallery grid. */}
      <div className="container-page relative z-10 py-16 sm:py-20 lg:py-24">
        <div
          ref={galleryRef}
          className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 sm:gap-x-7 sm:gap-y-14 lg:grid-cols-3 lg:gap-x-8"
        >
          {visible.map((event) => (
            <GalleryItem key={event.id} event={event} onOpen={handleOpen} />
          ))}
        </div>
      </div>
    </section>
  );
}

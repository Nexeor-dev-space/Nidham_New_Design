"use client";

import { useEffect, useRef } from "react";
import Aurora from "@/src/components/Aurora/Aurora";

/**
 * Hero ambient lighting — three small, independently-positioned Aurora glows
 * that fill only the empty cream areas around the hero content (top-left,
 * top-right, and softly behind the headline). Each is heavily blurred and
 * radial-masked so it has no visible canvas edge — the viewer sees only soft
 * light that fades out before it reaches the video. A faint animated film-grain
 * over the same cream area adds premium texture.
 *
 * The whole thing is the backmost layer of the hero (pointer-events-none), so it
 * never covers the video and never touches the text. On pointer devices each
 * glow eases a few px toward the cursor. Reduced-motion disables the drift (and
 * the Aurora shader / grain animation opt out on their own).
 */
interface LayerCfg {
  /** Position + size (viewport units → stays in the top cream band). */
  pos: string;
  /** Blur (lighter on mobile for perf). */
  blur: string;
  opacity: string;
  /** Max px the glow eases toward the cursor. */
  drift: number;
  colorStops: [string, string, string];
  speed: number;
  amplitude: number;
  blend: number;
}

/** Radial mask — the glow dissolves to nothing, no rectangular edge. */
const MASK =
  "[mask-image:radial-gradient(closest-side,#000_0%,#000_28%,transparent_78%)] [-webkit-mask-image:radial-gradient(closest-side,#000_0%,#000_28%,transparent_78%)]";

const LAYERS: LayerCfg[] = [
  {
    // 1 — top-left, soft lavender.
    pos: "left-[-12vw] top-[-14vh] h-[64vh] w-[62vw]",
    blur: "blur-[70px] md:blur-[120px]",
    opacity: "opacity-[0.10]",
    drift: 8,
    colorStops: ["#DCC9FF", "#F3E8FF", "#F3E8FF"],
    speed: 0.1,
    amplitude: 0.42,
    blend: 0.3,
  },
  {
    // 2 — top-right, warm champagne.
    pos: "right-[-12vw] top-[-8vh] h-[58vh] w-[56vw]",
    blur: "blur-[65px] md:blur-[110px]",
    opacity: "opacity-[0.08]",
    drift: 10,
    colorStops: ["#F8EBC4", "#F8EBC4", "#F3E8FF"],
    speed: 0.14,
    amplitude: 0.4,
    blend: 0.32,
  },
  {
    // 3 — centre, behind the headline, very soft purple.
    pos: "left-[18vw] top-[6vh] h-[54vh] w-[64vw]",
    blur: "blur-[80px] md:blur-[130px]",
    opacity: "opacity-[0.06]",
    drift: 5,
    colorStops: ["#DCC9FF", "#DCC9FF", "#F3E8FF"],
    speed: 0.08,
    amplitude: 0.38,
    blend: 0.3,
  },
];

export default function HeroAmbient() {
  const layerRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Cursor drift only makes sense with a fine pointer.
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const targets = LAYERS.map(() => ({ x: 0, y: 0 }));
    const cur = LAYERS.map(() => ({ x: 0, y: 0 }));

    const onMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1; // -1..1
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      LAYERS.forEach((l, i) => {
        targets[i].x = nx * l.drift;
        targets[i].y = ny * l.drift;
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      for (let i = 0; i < LAYERS.length; i++) {
        cur[i].x += (targets[i].x - cur[i].x) * 0.05;
        cur[i].y += (targets[i].y - cur[i].y) * 0.05;
        const el = layerRefs.current[i];
        if (el) {
          el.style.transform = `translate3d(${cur[i].x.toFixed(2)}px, ${cur[i].y.toFixed(2)}px, 0)`;
        }
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {LAYERS.map((l, i) => (
        <div
          key={i}
          ref={(el) => {
            layerRefs.current[i] = el;
          }}
          className={`absolute ${l.pos} ${l.opacity} mix-blend-screen will-change-transform`}
        >
          <div className={`h-full w-full ${l.blur} ${MASK}`}>
            <Aurora
              colorStops={l.colorStops}
              speed={l.speed}
              amplitude={l.amplitude}
              blend={l.blend}
            />
          </div>
        </div>
      ))}

      {/* Faint animated film grain — ambient texture over the cream only. */}
      <div className="hero-grain absolute -inset-[40%] opacity-[0.05] mix-blend-soft-light" />
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";

/**
 * Ambient purple dust — a single GPU-friendly <canvas> overlay of hundreds of
 * tiny, soft, faded-lavender flecks that live in the *empty* areas of the page.
 * They drift almost imperceptibly, and near the cursor they flow away, swirl,
 * accelerate and then ease back — like moving a hand through floating dust.
 *
 * "Empty space only": the field is masked against a live list of content boxes
 * (headings, paragraphs, links, buttons, media, nav …). Any particle drifting
 * over — or within ~20px of — content softly fades out, so dust is only ever
 * visible in whitespace and never competes with text. The mask is computed in
 * document space and offset by scroll each frame, so it stays cheap (no layout
 * thrash) while remaining accurate as the page scrolls.
 *
 * Motion is physics-y: velocity + damping (momentum + weight) steered by a
 * smooth sine flow field, so nothing moves linearly and cursor wakes decay over
 * ~1s. Perf: pre-rendered sprites, capped DPR, delta-timed rAF, paused when the
 * tab is hidden, count scaled to viewport + CPU. Fully disabled on touch/coarse
 * pointers, small screens, and prefers-reduced-motion.
 */

/** Faded-purple palette as RGB triples — #C8B6FF, #D6C8FF, #E3D8FF. */
const COLORS: ReadonlyArray<readonly [number, number, number]> = [
  [200, 182, 255],
  [214, 200, 255],
  [227, 216, 255],
];

/** Per-section field intensity (looked up from `data-particles`). */
const SECTION_INTENSITY: Record<string, number> = {
  hero: 1.0,
  about: 0.6,
  services: 0.4,
  gallery: 0.85,
  footer: 0.65,
};
const DEFAULT_INTENSITY = 0.7;

/** Content the dust must stay clear of (masked + feathered by MASK_MARGIN). */
const AVOID_SELECTOR =
  "h1,h2,h3,h4,h5,h6,p,li,a,button,input,textarea,select,label,img,svg,video,nav,aside,[data-particle-avoid]";
const MASK_MARGIN = 20;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  ci: number;
  base: number;
  bright: number;
  phase: number;
  phaseSpeed: number;
  /** 1 = fully visible (empty space), 0 = hidden (over content). Lerps softly. */
  mask: number;
}

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Skip on touch / coarse pointers, reduced motion, or small screens.
    if (
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(max-width: 767px)").matches
    ) {
      return;
    }

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // --- soft feathered sprites, one per colour (drawn once, reused) ---
    const SPRITE = 64;
    const sprites = COLORS.map(([r, g, b]) => {
      const s = document.createElement("canvas");
      s.width = s.height = SPRITE;
      const sc = s.getContext("2d");
      if (sc) {
        const h = SPRITE / 2;
        const grad = sc.createRadialGradient(h, h, 0, h, h, h);
        grad.addColorStop(0, `rgba(${r},${g},${b},0.95)`);
        grad.addColorStop(0.45, `rgba(${r},${g},${b},0.3)`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        sc.fillStyle = grad;
        sc.fillRect(0, 0, SPRITE, SPRITE);
      }
      return s;
    });

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    const makeParticle = (): Particle => {
      const ci = Math.floor(Math.random() * COLORS.length);
      // 2–5px flecks (radius ~1–2.5), a few slightly larger; opacity 10–25%.
      const size = Math.random() < 0.18 ? rand(2.2, 2.9) : rand(1.0, 2.0);
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: rand(-0.15, 0.15),
        vy: rand(-0.15, 0.15),
        size,
        ci,
        base: rand(0.1, 0.25),
        bright: 1,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: rand(0.5, 1.4),
        mask: 1,
      };
    };

    const targetCount = () => {
      let n = Math.round((width * height) / 11000);
      n = Math.max(90, Math.min(360, n));
      const cores = navigator.hardwareConcurrency || 8;
      if (cores <= 4) n = Math.round(n * 0.6);
      return n;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const want = targetCount();
      if (particles.length === 0) {
        particles = Array.from({ length: want }, makeParticle);
      } else {
        while (particles.length < want) particles.push(makeParticle());
        if (particles.length > want) particles.length = want;
        for (const p of particles) {
          if (p.x > width) p.x = Math.random() * width;
          if (p.y > height) p.y = Math.random() * height;
        }
      }
    };
    resize();

    // --- content mask: collect avoid boxes in DOCUMENT space (cheap per frame) ---
    let avoid: Rect[] = [];
    const collectAvoid = () => {
      const sx = window.scrollX;
      const sy = window.scrollY;
      const next: Rect[] = [];
      // Scope to the scrolling content only — this excludes the fixed
      // FloatingNav (which lives above the canvas and must not be masked, or
      // its non-scrolling rect would drag a phantom hole through the field).
      const roots = [
        document.querySelector("main"),
        document.querySelector("footer"),
      ];
      for (const root of roots) {
        if (!root) continue;
        root.querySelectorAll<HTMLElement>(AVOID_SELECTOR).forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.width <= 0 || r.height <= 0) return;
          next.push({ x: r.left + sx, y: r.top + sy, w: r.width, h: r.height });
        });
      }
      avoid = next;
    };
    collectAvoid();
    // Re-measure after entrance animations settle, then keep it fresh cheaply.
    const t1 = window.setTimeout(collectAvoid, 700);
    const t2 = window.setTimeout(collectAvoid, 1600);
    const remeasure = window.setInterval(collectAvoid, 1200);

    // --- pointer state (smoothed for easing) ---
    let tx = width / 2;
    let ty = height / 2;
    let mx = tx;
    let my = ty;
    let pmx = mx;
    let pmy = my;
    let speed = 0;
    let hasPointer = false;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      hasPointer = true;
    };
    const onLeave = () => {
      hasPointer = false;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);

    // --- section awareness ---
    let sectionTarget = DEFAULT_INTENSITY;
    const ratios = new Map<Element, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          ratios.set(en.target, en.isIntersecting ? en.intersectionRatio : 0);
        }
        let best = DEFAULT_INTENSITY;
        let bestR = 0;
        ratios.forEach((r, el) => {
          if (r > bestR) {
            bestR = r;
            const key = el.getAttribute("data-particles") || "";
            best = SECTION_INTENSITY[key] ?? DEFAULT_INTENSITY;
          }
        });
        if (bestR > 0) sectionTarget = best;
      },
      { threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] },
    );
    document
      .querySelectorAll<HTMLElement>("[data-particles]")
      .forEach((el) => io.observe(el));

    // --- animation loop ---
    let intensity = DEFAULT_INTENSITY;
    let raf = 0;
    let last = performance.now();

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      let dt = now - last;
      last = now;
      if (dt > 50) dt = 50;
      const ts = dt / 16.6667;

      mx += (tx - mx) * 0.16;
      my += (ty - my) * 0.16;
      speed = Math.min(Math.hypot(mx - pmx, my - pmy), 60);
      pmx = mx;
      pmy = my;
      intensity += (sectionTarget - intensity) * 0.02;

      const sx = window.scrollX;
      const sy = window.scrollY;
      const t = now * 0.001;
      ctx.clearRect(0, 0, width, height);

      const R = 200;
      const R2 = R * R;
      const push = 0.32 * (1 + speed * 0.02);
      const swirl = 0.26 * (1 + speed * 0.03);

      for (const p of particles) {
        // Organic idle drift — a smooth, slowly rotating flow field.
        const a =
          Math.sin(p.x * 0.0015 + t * 0.13) + Math.cos(p.y * 0.0017 - t * 0.1);
        const ang = a * Math.PI;
        const drift = 0.04 * (0.5 + intensity);
        p.vx += Math.cos(ang) * drift;
        p.vy += Math.sin(ang) * drift;

        // Cursor influence — gentle flow-away + swirl within 200px.
        if (hasPointer) {
          const dx = p.x - mx;
          const dy = p.y - my;
          const d2 = dx * dx + dy * dy;
          if (d2 < R2) {
            const d = Math.sqrt(d2) || 0.001;
            const f = 1 - d / R;
            const nx = dx / d;
            const ny = dy / d;
            p.vx += nx * f * push;
            p.vy += ny * f * push;
            p.vx += -ny * f * swirl;
            p.vy += nx * f * swirl;
            p.bright += (1 + f * 1.4 - p.bright) * 0.14;
          } else {
            p.bright += (1 - p.bright) * 0.06;
          }
        } else {
          p.bright += (1 - p.bright) * 0.06;
        }

        // Damping = weight + inertia; wake momentum decays over ~1s.
        p.vx *= 0.9;
        p.vy *= 0.9;
        const v = Math.hypot(p.vx, p.vy);
        if (v > 3.2) {
          p.vx = (p.vx / v) * 3.2;
          p.vy = (p.vy / v) * 3.2;
        }
        p.x += p.vx * ts;
        p.y += p.vy * ts;

        const m = 40;
        if (p.x < -m) p.x = width + m;
        else if (p.x > width + m) p.x = -m;
        if (p.y < -m) p.y = height + m;
        else if (p.y > height + m) p.y = -m;

        // Empty-space mask — fade out over (or near) content.
        const docX = p.x + sx;
        const docY = p.y + sy;
        let covered = false;
        for (let i = 0; i < avoid.length; i++) {
          const r = avoid[i];
          if (
            docX >= r.x - MASK_MARGIN &&
            docX <= r.x + r.w + MASK_MARGIN &&
            docY >= r.y - MASK_MARGIN &&
            docY <= r.y + r.h + MASK_MARGIN
          ) {
            covered = true;
            break;
          }
        }
        p.mask += ((covered ? 0 : 1) - p.mask) * 0.12;

        const tw = 0.82 + 0.18 * Math.sin(t * p.phaseSpeed + p.phase);
        let alpha = p.base * p.bright * tw * p.mask * (0.5 + 0.6 * intensity);
        if (alpha > 0.4) alpha = 0.4;
        if (alpha < 0.003) continue;
        const dsz = p.size * (1 + (p.bright - 1) * 0.25);
        ctx.globalAlpha = alpha;
        ctx.drawImage(sprites[p.ci], p.x - dsz, p.y - dsz, dsz * 2, dsz * 2);
      }
      ctx.globalAlpha = 1;
    };

    const start = () => {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => cancelAnimationFrame(raf);

    const onVisibility = () => {
      stop();
      if (!document.hidden) start();
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", resize);
    start();

    return () => {
      stop();
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearInterval(remeasure);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      io.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[35] h-full w-full"
    />
  );
}

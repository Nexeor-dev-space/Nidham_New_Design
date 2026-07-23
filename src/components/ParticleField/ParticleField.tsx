"use client";

import { useEffect, useRef } from "react";

/**
 * Atmospheric dust — a single GPU-friendly <canvas> overlay of sparse, tiny,
 * out-of-focus champagne motes drifting in the *empty* areas of the page. It is
 * meant to read as depth in the background, not as an effect: at 8–15% opacity
 * and 1–2px it should be barely noticeable until you look for it.
 *
 * "Empty space only": the field is masked against a live list of content boxes
 * (headings, paragraphs, links, buttons, media, nav …). Any mote drifting over
 * — or within ~20px of — content softly fades out, so dust is only ever visible
 * in whitespace and never competes with text. The mask is computed in document
 * space and offset by scroll each frame, so it stays cheap (no layout thrash)
 * while remaining accurate as the page scrolls.
 *
 * Two things keep it from reading as a "particle animation":
 *
 * 1. Every mote lives on a *lifecycle* rather than being permanently on screen.
 *    It fades up over the first third of its life, holds, fades out over the
 *    last third, then silently respawns elsewhere. Nothing is ever constantly
 *    visible, and respawn teleports happen at zero alpha.
 *
 * 2. The cursor moves motes by a bounded *offset from home*, not by a force on
 *    velocity. Each mote eases up to its own 8–15px displacement and, the
 *    moment the pointer stops, eases back to exactly where it was. There is no
 *    momentum to accumulate, so no wake, no swirl, no magnetism — the ceiling
 *    on how much the cursor can ever disturb the field is 15px.
 *
 * Perf: pre-rendered soft sprites (no runtime blur/shadow), capped DPR,
 * delta-timed rAF, paused when the tab is hidden, count scaled to viewport +
 * CPU. Fully disabled on touch/coarse pointers, small screens, and
 * prefers-reduced-motion.
 */

/** Pale champagne, three near-identical tones — #F8F5EC and neighbours. */
const COLORS: ReadonlyArray<readonly [number, number, number]> = [
  [248, 245, 236],
  [242, 238, 228],
  [252, 250, 244],
];

/**
 * Sprite radius as a multiple of the mote's core radius. The falloff is a plain
 * diffuse ramp with no bright centre — that is what reads as out-of-focus
 * rather than as a glowing dot.
 */
const SOFTNESS = 2.4;

/** Fraction of a mote's life spent fading in, and again fading out. */
const FADE = 0.32;

/** Ceiling on cursor displacement, in px. Nothing can push a mote further. */
const DRIFT_MIN = 8;
const DRIFT_MAX = 15;
/** Radius over which the cursor has any influence at all. */
const CURSOR_R = 260;
/** Pointer still for this long ⇒ motes ease back home. */
const IDLE_MS = 420;

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
  /** Home position — drifts on its own; the cursor never moves it. */
  hx: number;
  hy: number;
  vx: number;
  vy: number;
  /** Current cursor displacement, eased toward a bounded target. */
  ox: number;
  oy: number;
  /** This mote's personal displacement ceiling (px) and its sign. */
  drift: number;
  dir: number;
  /** Core radius in px — 0.5–1.0, i.e. a 1–2px speck. */
  size: number;
  ci: number;
  /** Peak alpha, 0.08–0.15. Everything else only attenuates from here. */
  peak: number;
  /** Lifecycle clock, in seconds, against a per-mote ttl. */
  life: number;
  ttl: number;
  /** Slow independent shimmer, so fades never look synchronised. */
  phase: number;
  phaseSpeed: number;
  /** Private float oscillator, keeps drift from following the flow field alone. */
  floatPhase: number;
  floatSpeed: number;
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

    // --- soft out-of-focus sprites, one per tone (drawn once, reused) ---
    // A continuous ramp with no plateau and no hard edge — that shape is what
    // reads as out-of-focus. Baking it beats a runtime blur filter.
    //
    // The centre is opaque so that `peak` is the mote's literal rendered alpha:
    // a dimmer centre would multiply against globalAlpha and quietly land the
    // field below the intended 0.08–0.15. At those alphas an opaque centre
    // cannot read as a glow — the whole mote tops out at 15% of the background.
    const SPRITE = 48;
    const sprites = COLORS.map(([r, g, b]) => {
      const s = document.createElement("canvas");
      s.width = s.height = SPRITE;
      const sc = s.getContext("2d");
      if (sc) {
        const h = SPRITE / 2;
        const grad = sc.createRadialGradient(h, h, 0, h, h, h);
        grad.addColorStop(0, `rgba(${r},${g},${b},1)`);
        grad.addColorStop(0.25, `rgba(${r},${g},${b},0.7)`);
        grad.addColorStop(0.5, `rgba(${r},${g},${b},0.3)`);
        grad.addColorStop(0.75, `rgba(${r},${g},${b},0.08)`);
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

    /** Resets a mote in place — used for both spawn and respawn. */
    const reset = (p: Particle, fresh: boolean) => {
      p.hx = Math.random() * width;
      p.hy = Math.random() * height;
      p.vx = rand(-0.04, 0.04);
      p.vy = rand(-0.04, 0.04);
      p.ox = 0;
      p.oy = 0;
      p.drift = rand(DRIFT_MIN, DRIFT_MAX);
      // A minority drift *toward* the cursor rather than away — mixed
      // directions read as air moving, where one direction reads as a force.
      p.dir = Math.random() < 0.35 ? -1 : 1;
      p.size = rand(0.5, 1);
      p.ci = Math.floor(Math.random() * COLORS.length);
      p.peak = rand(0.08, 0.15);
      p.ttl = rand(9, 20);
      // On first fill, scatter the clocks so the whole field does not pulse in
      // unison; on respawn start at 0 so the mote fades up from nothing.
      p.life = fresh ? Math.random() * p.ttl : 0;
      p.phase = Math.random() * Math.PI * 2;
      p.phaseSpeed = rand(0.1, 0.3);
      p.floatPhase = Math.random() * Math.PI * 2;
      p.floatSpeed = rand(0.08, 0.2);
      p.mask = 1;
    };

    const makeParticle = (): Particle => {
      const p = {} as Particle;
      reset(p, true);
      return p;
    };

    // Sparse by design — roughly a third of what a decorative field would use.
    const targetCount = () => {
      let n = Math.round((width * height) / 40000);
      n = Math.max(24, Math.min(85, n));
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
          if (p.hx > width) p.hx = Math.random() * width;
          if (p.hy > height) p.hy = Math.random() * height;
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

    // --- pointer state ---
    // Read raw: the displacement is what gets eased, so there is nothing to
    // gain from smoothing the input as well.
    let px = width / 2;
    let py = height / 2;
    let lastMove = -Infinity;
    let hasPointer = false;

    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      lastMove = performance.now();
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
      const secs = dt / 1000;

      intensity += (sectionTarget - intensity) * 0.02;

      const sx = window.scrollX;
      const sy = window.scrollY;
      const t = now * 0.001;
      ctx.clearRect(0, 0, width, height);

      // Section intensity only ever attenuates, so `peak` stays the true cap.
      const vis = 0.55 + 0.45 * intensity;
      const active = hasPointer && now - lastMove < IDLE_MS;

      for (const p of particles) {
        p.life += secs;
        if (p.life >= p.ttl) reset(p, false);

        // Organic idle drift — a smooth, slowly rotating flow field …
        const a =
          Math.sin(p.hx * 0.0011 + t * 0.06) +
          Math.cos(p.hy * 0.0013 - t * 0.05);
        const ang = a * Math.PI;
        p.vx += Math.cos(ang) * 0.006;
        p.vy += Math.sin(ang) * 0.006;

        // … plus a private, out-of-phase bob so no two motes trace the same
        // path even where the flow field is locally flat.
        p.floatPhase += p.floatSpeed * 0.016 * ts;
        p.vx += Math.cos(p.floatPhase) * 0.004;
        p.vy += Math.sin(p.floatPhase * 1.3) * 0.004;

        // Heavy damping + a low ceiling: ~20px/s, the pace of dust in still air.
        p.vx *= 0.94;
        p.vy *= 0.94;
        const v = Math.hypot(p.vx, p.vy);
        if (v > 0.35) {
          p.vx = (p.vx / v) * 0.35;
          p.vy = (p.vy / v) * 0.35;
        }
        p.hx += p.vx * ts;
        p.hy += p.vy * ts;

        const m = 30;
        if (p.hx < -m) p.hx = width + m;
        else if (p.hx > width + m) p.hx = -m;
        if (p.hy < -m) p.hy = height + m;
        else if (p.hy > height + m) p.hy = -m;

        // Cursor displacement — a bounded offset from home, never a force. The
        // target is 0 whenever the pointer is idle or gone, so "stops moving"
        // and "returns home" are the same code path.
        let tox = 0;
        let toy = 0;
        if (active) {
          const dx = p.hx - px;
          const dy = p.hy - py;
          const d = Math.hypot(dx, dy);
          if (d < CURSOR_R && d > 0.001) {
            // Squared falloff — the influence tapers out rather than ending.
            const f = 1 - d / CURSOR_R;
            const amt = p.drift * p.dir * f * f;
            tox = (dx / d) * amt;
            toy = (dy / d) * amt;
          }
        }
        // Slow lerp both ways: ~1s to reach the offset, ~1s to ease back.
        p.ox += (tox - p.ox) * 0.045 * ts;
        p.oy += (toy - p.oy) * 0.045 * ts;

        const x = p.hx + p.ox;
        const y = p.hy + p.oy;

        // Empty-space mask — fade out over (or near) content.
        const docX = x + sx;
        const docY = y + sy;
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
        p.mask += ((covered ? 0 : 1) - p.mask) * 0.1;

        // Lifecycle envelope, smoothstepped so the fades have no corners.
        const u = p.life / p.ttl;
        let e = 1;
        if (u < FADE) e = u / FADE;
        else if (u > 1 - FADE) e = (1 - u) / FADE;
        e = e * e * (3 - 2 * e);

        const shimmer = 0.8 + 0.2 * Math.sin(t * p.phaseSpeed + p.phase);
        const alpha = p.peak * e * shimmer * p.mask * vis;
        if (alpha < 0.004) continue;

        const r = p.size * SOFTNESS;
        ctx.globalAlpha = alpha;
        ctx.drawImage(sprites[p.ci], x - r, y - r, r * 2, r * 2);
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

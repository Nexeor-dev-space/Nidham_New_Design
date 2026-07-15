"use client";

import { useRef } from "react";
import { useCursor } from "@/src/hooks/useCursor";

/**
 * Global custom cursor — mount once (in the root layout). A fixed-point root is
 * moved via GSAP `translate3d`; a ring and an optional label are centered on it
 * and animate per hover state. Renders only on large screens; the hook further
 * gates it to fine-pointer, non-reduced-motion devices and hides the native
 * cursor while active.
 */
export default function CustomCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useCursor({ rootRef, ringRef, labelRef });

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[9999] hidden lg:block"
      style={{ willChange: "transform" }}
    >
      <div
        ref={ringRef}
        className="absolute left-0 top-0 rounded-full border-solid"
        style={{ borderStyle: "solid" }}
      />
      <span
        ref={labelRef}
        className="absolute left-0 top-0 whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.12em] text-white"
      />
    </div>
  );
}

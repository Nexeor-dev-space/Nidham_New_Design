"use client";

import type { ReactNode } from "react";
import { useMagnetic } from "@/src/hooks/useMagnetic";

interface MagneticProps {
  children: ReactNode;
  /** Fraction of cursor offset applied as movement (0–1). */
  strength?: number;
  /** Maximum displacement in px (subtle 6–10px). */
  max?: number;
  /** Extra classes for the wrapper. Defaults to an inline-block box. */
  className?: string;
}

/**
 * Wraps an element to give it a magnetic pull toward the cursor. The wrapper
 * owns the GSAP transform so the child keeps its own hover transforms intact.
 */
export default function Magnetic({
  children,
  strength,
  max,
  className = "inline-block",
}: MagneticProps) {
  const ref = useMagnetic<HTMLSpanElement>({ strength, max });
  return (
    <span ref={ref} className={className}>
      {children}
    </span>
  );
}

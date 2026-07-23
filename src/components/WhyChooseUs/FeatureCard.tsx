"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import type { FeatureCardProps } from "./types";
import { EASE, VIEWPORT } from "@/src/lib/motion";

/**
 * Resting flex weight → grow target for the horizontal expand interaction.
 * The active card expands, the rest shrink proportionally. Only meaningful on
 * desktop; disabled when the user prefers reduced motion.
 */
function growFor(
  base: number,
  isActive: boolean,
  isAnyActive: boolean,
  enabled: boolean,
): number {
  if (!enabled) return base;
  if (isActive) return 2.8;
  if (isAnyActive) return base * 0.78;
  return base;
}

export default function FeatureCard({
  feature,
  index,
  isActive,
  isAnyActive,
  isDesktop,
  reduce,
  onActivate,
  onDeactivate,
}: FeatureCardProps) {
  const base = feature.weight ?? 1;
  const expandEnabled = isDesktop && !reduce;
  const grow = growFor(base, isActive, isAnyActive, expandEnabled);

  // Visual hover accents apply only where the expand interaction is live.
  const accent = expandEnabled && isActive;

  const cardV: Variants = {
    hidden: {
      opacity: 0,
      y: reduce ? 0 : 40,
      scale: reduce ? 1 : 0.96,
    },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.8, ease: EASE, delay: index * 0.12 },
    },
  };

  return (
    <motion.li
      // Resting proportions come from the Figma; basis-0 lets grow drive width.
      className="group/card flex min-w-0 list-none flex-col basis-auto lg:basis-0"
      style={{ flexGrow: base }}
      animate={{ flexGrow: grow }}
      initial={false}
      transition={{ duration: 0.62, ease: EASE }}
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
      onFocus={onActivate}
      onBlur={onDeactivate}
    >
      <motion.div
        variants={cardV}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        className="flex h-full flex-col"
      >
        {/* Image frame ------------------------------------------------------ */}
        <div
          data-cursor="card"
          data-cursor-label={feature.cursorLabel ?? "Explore"}
          className={[
            // `overflow-hidden` is what applies the radius to the contents:
            // the image, the gradient overlay and the ring all fill this box,
            // so the corners come from the clip, not from each child.
            "relative w-full overflow-hidden rounded-[16px] aspect-[4/3]",
            "lg:aspect-auto lg:h-[clamp(340px,42vw,600px)]",
            "transition-shadow duration-500 ease-out",
            "outline-none ring-black/10 ring-inset transition-[box-shadow]",
            accent ? "shadow-2xl shadow-black/25 ring-1" : "shadow-none",
            expandEnabled ? "cursor-pointer" : "",
          ].join(" ")}
        >
          <Image
            src={feature.image.src}
            alt={feature.image.alt}
            fill
            loading="lazy"
            sizes="(max-width: 1024px) 100vw, 45vw"
            className={[
              "object-cover object-center will-change-transform",
              "transition-transform duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
              accent ? "scale-[1.06]" : "scale-100",
            ].join(" ")}
          />

          {/* Gradient overlay — always present for legibility, deepens on hover. */}
          <div
            aria-hidden
            className={[
              "pointer-events-none absolute inset-0",
              "bg-gradient-to-t from-black/70 via-black/20 to-transparent",
              "transition-opacity duration-500 ease-out",
              accent ? "opacity-100" : "opacity-60",
            ].join(" ")}
          />

          {/* Title + hover description, anchored to the bottom of the image. */}
          <figcaption className="absolute inset-x-0 bottom-0 px-6 pb-6 text-center lg:px-7 lg:pb-8 xl:px-9">
            <h3 className="text-[clamp(1.4rem,2.1vw,2.1rem)] font-normal leading-tight tracking-[-0.01em] text-white drop-shadow-[0_1px_10px_rgba(0,0,0,0.35)]">
              {feature.title}
            </h3>

            {/*
              Description sits beneath the title. On desktop it is collapsed at
              rest and expands on hover (the title lifts to make room); on mobile
              there is no hover, so it stays open beneath the title.
            */}
            <p
              aria-hidden={isDesktop && !accent}
              className={[
                "mx-auto max-w-md overflow-hidden",
                "text-[20px] font-light leading-[1.5] text-white/90",
                "transition-all duration-500 ease-out",
                // Mobile: always visible beneath the title.
                "max-h-40 pt-3 opacity-100 translate-y-0",
                // Desktop: collapsed until this card is hovered/focused.
                accent
                  ? "lg:max-h-40 lg:pt-3 lg:translate-y-0 lg:opacity-100 lg:delay-100"
                  : "lg:max-h-0 lg:pt-0 lg:translate-y-2 lg:opacity-0",
              ].join(" ")}
            >
              {feature.description}
            </p>
          </figcaption>
        </div>
      </motion.div>
    </motion.li>
  );
}

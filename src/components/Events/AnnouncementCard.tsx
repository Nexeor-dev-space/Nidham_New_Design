"use client";

import { motion, useReducedMotion } from "framer-motion";

interface AnnouncementCardProps {
  /** Small pulsing status pill, e.g. "Official Announcement". */
  badge: string;
  title: string;
  /** One-sentence notice under the title. */
  body: string;
}

/**
 * The glass card that overlaps the featured event image.
 *
 * This replaces `CountdownCard`, which ticked down to a fixed instant. Dance off
 * Dubai has no announced date — the info cards beside it read "To Be Announced"
 * and "Coming Soon" — so a live clock here would have been asserting a date the
 * rest of the section says does not exist yet.
 *
 * **The glass shell is unchanged**: the frosted surface, rounded geometry,
 * shadow and ring, purple tint and top highlight, and the slow travelling sheen
 * are all identical to the countdown card this replaced.
 *
 * **What did change: there is no CTA.** The card used to split into a left
 * content column and a right button, bottom-aligned (`items-end`) so the button
 * sat level with the last line of the notice. With the button gone that split
 * has no reason to exist — a left-aligned text block in a now-empty row reads as
 * unfinished, not as a considered teaser. The content is a single centred
 * column instead, at every breakpoint, which is what makes a badge-and-headline
 * card with no action feel like a deliberate announcement rather than a stub.
 */
export default function AnnouncementCard({
  badge,
  title,
  body,
}: AnnouncementCardProps) {
  const reduce = useReducedMotion();

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/45 p-5 shadow-[0_30px_80px_-28px_rgba(0,0,0,0.7)] ring-1 ring-black/[0.04] backdrop-blur-md sm:p-6 lg:p-7"
    >
      {/* Glass layers — subtle purple tint + a top highlight for depth. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#6E1B45]/[0.07] via-transparent to-[#6E1B45]/[0.03]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-2/3 bg-gradient-to-b from-white/10 to-transparent"
      />
      {/* Slow, subtle moving reflection. */}
      {!reduce && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-y-[40%] left-[-30%] w-1/4 rotate-12 bg-gradient-to-r from-transparent via-white/35 to-transparent blur-lg"
          animate={{ x: ["0%", "560%"] }}
          transition={{
            duration: 7,
            repeat: Infinity,
            repeatDelay: 4.5,
            ease: "easeInOut",
          }}
        />
      )}

      <div className="relative z-10 flex flex-col items-center gap-2.5 py-1 text-center">
        {/* #FF3D8F, not the deeper #E00068 brand pink: this sits on the same
            dark, photo-backed glass as the hero eyebrow (see MelodyHero), which
            uses this exact tint for the same reason — #E00068 is a 2.8:1 on a
            backdrop this dark, well under AA, where this tint clears ~4:1. */}
        <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#FF3D8F]">
          <span className="relative flex h-1.5 w-1.5">
            {!reduce && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF3D8F]/60" />
            )}
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#FF3D8F]" />
          </span>
          {badge}
        </p>

        <h4 className="text-[clamp(1.15rem,1.7vw,1.6rem)] font-semibold leading-tight tracking-[-0.01em] text-neutral-100">
          {title}
        </h4>

        <p className="max-w-sm text-[13px] leading-relaxed text-neutral-300 sm:text-sm">
          {body}
        </p>
      </div>
    </div>
  );
}

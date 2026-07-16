"use client";

import { useCountdown } from "@/src/components/Hero/useCountdown";

interface CountdownCardProps {
  /** ISO datetime the countdown targets. */
  eventDate: string;
  title: string;
  linkText: string;
  linkHref: string;
}

/**
 * Glassmorphic live countdown that overlaps the event image. Values come from
 * the shared `useCountdown` hook (client-only; renders "--" until mounted, so
 * there's no hydration mismatch) — nothing is hard-coded.
 */
export default function CountdownCard({
  eventDate,
  title,
  linkText,
  linkHref,
}: CountdownCardProps) {
  const t = useCountdown(eventDate);
  const units = [
    { value: t?.days ?? "--", label: "Days" },
    { value: t?.hours ?? "--", label: "Hrs" },
    { value: t?.minutes ?? "--", label: "Min" },
  ];

  return (
    <div
      className="rounded-xl border border-white/50 bg-white/65 p-5 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.55)] backdrop-blur-md sm:p-6"
      aria-label={`${title}: ${units.map((u) => `${u.value} ${u.label}`).join(", ")}`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
        Live Update
      </p>
      <p className="mt-1.5 text-lg font-semibold text-neutral-900 sm:text-xl">
        {title}
      </p>

      <div className="mt-4 flex items-end justify-between gap-4">
        <div className="flex gap-4 sm:gap-6" aria-hidden="true">
          {units.map((u) => (
            <div key={u.label}>
              <div className="text-2xl font-semibold tabular-nums leading-none text-neutral-900 sm:text-[26px]">
                {u.value}
              </div>
              <div className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-500">
                {u.label}
              </div>
            </div>
          ))}
        </div>

        <a
          href={linkHref}
          data-cursor="link"
          className="group inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-neutral-600 transition-colors duration-300 hover:text-neutral-900"
        >
          <span className="hidden sm:inline">{linkText}</span>
          <span className="sm:hidden">VIP access</span>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          >
            <path d="M7 17 17 7M8 7h9v9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </div>
  );
}

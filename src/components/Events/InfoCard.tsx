import type { EventInfo, InfoIcon } from "./types";

/** Outline icons, one per info type. Decorative — hidden from assistive tech. */
const ICONS: Record<InfoIcon, React.ReactNode> = {
  date: (
    <>
      <rect x="3" y="4.5" width="18" height="16" rx="2.5" />
      <path d="M3 9h18M8 2.5v4M16 2.5v4" strokeLinecap="round" />
    </>
  ),
  time: (
    <>
      <circle cx="12" cy="12.5" r="8.5" />
      <path d="M12 8v4.5l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  location: (
    <>
      <path d="M12 21.5s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" strokeLinejoin="round" />
      <circle cx="12" cy="10.5" r="2.5" />
    </>
  ),
};

/**
 * A single date / time / location card. The `<li>` is the entrance target
 * (`.ev-card`); the inner element owns the hover lift so its transform never
 * fights the GSAP entrance transform.
 */
export default function InfoCard({ info }: { info: EventInfo }) {
  return (
    <li className="ev-card list-none [will-change:transform]">
      <div className="group h-full rounded-xl border border-white/10 bg-white/[0.04] p-4 transition-[transform,box-shadow] duration-300 ease-out will-change-transform hover:-translate-y-1 hover:shadow-[0_14px_30px_-16px_rgba(0,0,0,0.35)] sm:p-5">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="h-5 w-5 text-neutral-400 transition-transform duration-300 ease-out will-change-transform group-hover:scale-110"
        >
          {ICONS[info.icon]}
        </svg>
        <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
          {info.label}
        </p>
        <p className="mt-1 text-sm font-medium text-neutral-100">{info.value}</p>
      </div>
    </li>
  );
}

import Image from "next/image";
import type { Partner } from "./types";

interface LogoCardProps {
  partner: Partner;
}

/**
 * A single logo cell: fixed, equal-sized card with a thin border and a
 * centered logo that stays centred regardless of its aspect ratio. Hover adds
 * a subtle lift, scale, shadow and border transition (all GPU-composited).
 */
export default function LogoCard({ partner }: LogoCardProps) {
  return (
    <div
      className="flex h-28 w-40 items-center justify-center border border-neutral-200 bg-white transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-[3px] hover:scale-[1.02] hover:border-neutral-300 hover:shadow-[0_14px_34px_-14px_rgba(0,0,0,0.22)] sm:h-32 sm:w-48 lg:h-40 lg:w-56"
    >
      <Image
        src={partner.logo}
        alt={partner.name}
        width={224}
        height={64}
        unoptimized
        className="h-auto w-[58%] max-w-[140px] object-contain"
      />
    </div>
  );
}

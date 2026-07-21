import Image from "next/image";
import type { Partner } from "./types";

interface LogoCardProps {
  partner: Partner;
}

/**
 * A single logo cell: fixed, equal-sized card with a thin border and a
 * centered logo that stays centred regardless of its aspect ratio. Hover adds a
 * subtle lift, scale, soft shadow and brand-purple border (all GPU-composited);
 * the marquee's vertical padding gives the lift room so no border is clipped.
 */
export default function LogoCard({ partner }: LogoCardProps) {
  return (
    <div
      className="flex h-28 w-40 cursor-pointer items-center justify-center border border-[#9E9E9E] bg-transparent transition-[transform,box-shadow,border-color,background-color] duration-300 ease-out will-change-transform hover:-translate-y-[5px] hover:scale-[1.02] hover:border-[#6E1B45]/55 hover:bg-white/50 hover:shadow-[0_12px_30px_-12px_rgba(110,27,69,0.25)] sm:h-32 sm:w-48 lg:h-40 lg:w-56"
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

"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { LOGO, NAV_LINKS, REGISTER_CTA } from "./constants";

export default function Navbar() {
  return (
    <motion.nav
      aria-label="Primary"
      className="w-full bg-transparent"
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
    >
      <div className="mx-auto grid max-w-[1600px] grid-cols-2 items-center gap-4 px-6 py-5 md:grid-cols-3 lg:px-10">
        {/* Left: primary links */}
        <ul className="hidden items-center gap-10 text-[13px] font-medium uppercase tracking-[0.12em] text-neutral-800 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="transition-colors hover:text-[#6E1B45] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6E1B45]"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Center: logo */}
        <div className="flex items-center justify-start md:justify-center">
          <a href="#top" aria-label="Nidham Consultancy home" className="inline-flex">
            <Image
              src={LOGO.src}
              alt={LOGO.alt}
              width={LOGO.width}
              height={LOGO.height}
              priority
              className="h-auto w-[150px] sm:w-[168px]"
            />
          </a>
        </div>

        {/* Right: register CTA */}
        <div className="flex items-center justify-end">
          <a
            href={REGISTER_CTA.href}
            className="group inline-flex items-center gap-2.5 rounded-md border border-neutral-300/70 bg-neutral-200/80 px-5 py-2.5 text-[13px] font-semibold uppercase tracking-[0.12em] text-neutral-800 transition-all duration-300 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6E1B45]"
          >
            {REGISTER_CTA.label}
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              &rarr;
            </span>
          </a>
        </div>
      </div>
    </motion.nav>
  );
}

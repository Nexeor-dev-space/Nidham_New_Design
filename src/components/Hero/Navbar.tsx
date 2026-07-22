"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import Magnetic from "@/src/components/CustomCursor/Magnetic";
import NavLink from "@/src/components/Nav/NavLink";
import { EASE } from "@/src/lib/motion";
import { navigateTo } from "@/src/lib/nav";
import { LOGO, NAV_LINKS, REGISTER_CTA } from "./constants";

/**
 * Register — the page's only primary button, so it is the one place in the nav
 * that still carries a filled shape. Everything else is an editorial link (see
 * components/Nav/NavLink), which is what keeps this from reading as a row of
 * SaaS buttons.
 *
 * Hover composes four things on one 350ms curve: a 3px lift, a 1.03 scale, a
 * warm amber glow, and a light sweep across the fill (see the shimmer span).
 * `overflow-hidden` clips that sweep to the rounded box; it does not clip the
 * focus ring, which is drawn outside the border box.
 *
 * The transition names `translate` and `scale` — not `transform` — because
 * Tailwind v4 compiles the lift/scale utilities to those standalone CSS
 * properties. Naming `transform` here would silently make the hover snap.
 *
 * The movement is gated with `motion-safe:` rather than undone with
 * `motion-reduce:`: `hover:x` is (0,2,0) and a `motion-reduce:` override on the
 * same element is (0,1,0), so the override would never win. Colour and shadow
 * hovers stay ungated — they are not motion.
 */
const CTA_BASE =
  "group relative inline-flex items-center overflow-hidden rounded-[16px] font-semibold uppercase tracking-[0.14em] outline-none transition-[translate,scale,box-shadow,background-color] duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFCE1E]";

const CTA_SKIN =
  "grain-overlay border border-[#FFCE1E] bg-[#FFCE1E] text-[#1F1F1F] shadow-[0_8px_20px_-10px_rgba(255,206,30,0.55)] hover:bg-[#FFD84D] hover:shadow-[0_22px_48px_-12px_rgba(255,206,30,0.85)] motion-safe:hover:-translate-y-[3px] motion-safe:hover:scale-[1.03]";

/**
 * Links shown in the mobile drawer. Home is added on top of the shared
 * NAV_LINKS so the drawer offers the full section set (mirrors FloatingNav).
 */
const MOBILE_LINKS = [
  { label: "Home", href: "#top" },
  ...NAV_LINKS,
] as const;

export default function Navbar() {
  const reduce = useReducedMotion() ?? false;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Lock background scroll + close on Escape while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Drawer link → route-aware navigation (section scroll, route push, or a
  // hop back to a homepage section), then close (mirrors FloatingNav).
  const handleNav = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    navigateTo(event, href, router, pathname, reduce, () => setOpen(false));
  };

  return (
    <motion.nav
      aria-label="Primary"
      className="w-full bg-transparent"
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE, delay: 0.08 }}
    >
      <div className="container-page flex items-center justify-between gap-4 py-5 sm:gap-6 sm:py-6">
        {/* Left: logo — anchored to the far edge. Always routes to the homepage
            (client-side), from any page. */}
        <Link
          href="/"
          aria-label="Nidham Consultancy home"
          className="inline-flex shrink-0"
        >
          <Image
            src={LOGO.src}
            alt={LOGO.alt}
            width={LOGO.width}
            height={LOGO.height}
            priority
            className="h-auto w-[132px] sm:w-[168px]"
          />
        </Link>

        {/* Right: editorial links (md+) + primary CTA + mobile hamburger.
            The links carry no chrome, so the generous gap is what separates
            them — hence the wide `md:gap-12`/`lg:gap-16` rather than padding. */}
        <div className="flex items-center gap-5 sm:gap-6 md:gap-10 lg:gap-14">
          <ul className="hidden items-center md:flex md:gap-12 lg:gap-16">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <NavLink
                  href={link.href}
                  label={link.label}
                  tone="dark"
                  onClick={(e) => handleNav(e, link.href)}
                />
              </li>
            ))}
          </ul>

          <Magnetic className="inline-block">
            <a
              href={REGISTER_CTA.href}
              onClick={(e) => handleNav(e, REGISTER_CTA.href)}
              data-cursor="button"
              className={`${CTA_BASE} ${CTA_SKIN} gap-2 px-5 py-2.5 text-[12px] sm:gap-2.5 sm:px-7 sm:py-3 sm:text-[14px]`}
            >
              {/* Shimmer — a soft diagonal light sweep on hover. Slower than the
                  350ms hover so it reads as a sheen, not a flash. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.28)_50%,transparent_70%)] transition-transform duration-[900ms] ease-out group-hover:translate-x-full motion-reduce:hidden"
              />
              <span className="relative">{REGISTER_CTA.label}</span>
              <span
                aria-hidden="true"
                className="relative transition-transform duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:translate-x-[5px]"
              >
                &rarr;
              </span>
            </a>
          </Magnetic>

          {/* Mobile hamburger — hidden once the inline links appear (md+). */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            data-cursor="button"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-neutral-100 backdrop-blur-sm transition-colors duration-300 hover:border-white/30 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6E1B45] md:hidden"
          >
            <span className="sr-only">Open menu</span>
            <span aria-hidden="true" className="flex flex-col items-center gap-[5px]">
              <span className="block h-[1.5px] w-5 rounded-full bg-current" />
              <span className="block h-[1.5px] w-5 rounded-full bg-current" />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile drawer — portaled to <body> to escape the hero's clipping /
          transformed ancestors, so `fixed` positions against the viewport. */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && (
              <div className="md:hidden">
                {/* Backdrop — tap to dismiss. */}
                <motion.button
                  key="backdrop"
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="fixed inset-0 z-[80] cursor-default bg-neutral-900/30 backdrop-blur-[2px]"
                />

                {/* Slide-down sheet. */}
                <motion.div
                  key="sheet"
                  id="mobile-menu"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Site menu"
                  initial={{ y: reduce ? 0 : "-100%", opacity: reduce ? 0 : 1 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: reduce ? 0 : "-100%", opacity: reduce ? 0 : 1 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="fixed inset-0 z-[90] flex flex-col bg-[#1F1F1F] px-6 pb-10 pt-6"
                >
                  {/* Sheet header: brand + close. */}
                  <div className="flex items-center justify-between">
                    <Link
                      href="/"
                      aria-label="Nidham Consultancy home"
                      onClick={() => setOpen(false)}
                      className="inline-flex shrink-0"
                    >
                      <Image
                        src={LOGO.src}
                        alt={LOGO.alt}
                        width={LOGO.width}
                        height={LOGO.height}
                        className="h-auto w-[124px]"
                      />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      aria-label="Close menu"
                      data-cursor="button"
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.08] text-neutral-100 transition-colors duration-300 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6E1B45]"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                        className="h-5 w-5"
                      >
                        <path d="M18 6 6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Large, elegant link targets. */}
                  <nav aria-label="Mobile" className="mt-10">
                    <ul className="flex flex-col">
                      {MOBILE_LINKS.map((link) => (
                        <li
                          key={link.href}
                          className="border-b border-white/10 last:border-none"
                        >
                          <a
                            href={link.href}
                            onClick={(e) => handleNav(e, link.href)}
                            className="group -mx-4 flex items-center justify-between rounded-2xl px-4 py-5 text-[1.375rem] font-normal leading-none tracking-[-0.02em] text-neutral-100 transition-colors duration-300 hover:bg-white/[0.06] hover:text-[#6E1B45]"
                          >
                            {link.label}
                            <span
                              aria-hidden="true"
                              className="text-neutral-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#6E1B45]"
                            >
                              &rarr;
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>

                  {/* Primary CTA anchored at the bottom of the sheet. Same amber
                      skin as the desktop CTA for a single, consistent button. */}
                  <a
                    href={REGISTER_CTA.href}
                    onClick={(e) => handleNav(e, REGISTER_CTA.href)}
                    className="group mt-auto inline-flex w-full items-center justify-center gap-2.5 rounded-[16px] border border-[#FFCE1E] bg-[#FFCE1E] px-6 py-4 text-[14px] font-semibold uppercase tracking-[0.14em] text-[#1F1F1F] transition-colors duration-300 hover:bg-[#FFD84D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFCE1E]"
                  >
                    {REGISTER_CTA.label}
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:translate-x-[5px]"
                    >
                      &rarr;
                    </span>
                  </a>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </motion.nav>
  );
}

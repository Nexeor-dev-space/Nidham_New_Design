import type { FooterLink } from "./types";

/**
 * Default footer content for the Nidham home page. Everything is overridable
 * via props — these mirror the Figma exactly.
 */

export const FOOTER_NAV: readonly FooterLink[] = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "Process", href: "/process" },
  { label: "Contact", href: "/contact" },
] as const;

export const FOOTER_SOCIALS: readonly FooterLink[] = [
  { label: "LinkedIn", href: "https://www.linkedin.com", external: true },
  { label: "Instagram", href: "https://www.instagram.com", external: true },
  { label: "Pinterest", href: "https://www.pinterest.com", external: true },
] as const;

export const FOOTER_LEGAL: readonly FooterLink[] = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
] as const;

export const FOOTER_VISION_HEADING = "Let's talk about your vision";

export const FOOTER_VISION_TEXT =
  "Partner with Nidham for thoughtfully designed and expertly delivered spaces.";

export const FOOTER_CTA: FooterLink = {
  label: "Let's talk with us",
  href: "/contact",
};

export const FOOTER_COPYRIGHT = "©2026 Nidham . Powered by Nexeor";

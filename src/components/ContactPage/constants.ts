import type { ContactDetail, ContactReason, ServiceOption } from "./types";

/**
 * /contact content — SINGLE SOURCE OF TRUTH.
 *
 * The business details below (phone, email, office location, working hours) are
 * taken VERBATIM from the live Nidham website (nidham.ae). The site lists only
 * the country for its location and shows no social links, so nothing beyond what
 * the site states is invented here. Surrounding editorial copy (hero intro,
 * reasons, CTA) is presentation and may be authored.
 */

/* ------------------------------------------------------------ Real data --- */

export const CONTACT_PHONE = "+971 50 112 6058";
/** Digits-only form for the tel: link. */
export const CONTACT_PHONE_HREF = "tel:+971501126058";
export const CONTACT_EMAIL = "hello@nidham.ae";
export const CONTACT_LOCATION = "United Arab Emirates";
export const CONTACT_HOURS = [
  "Mon – Fri: 9AM – 6PM",
  "Sat: 9AM – 1PM",
] as const;

/* ----------------------------------------------------------------- Hero --- */

export const CONTACT_EYEBROW = "Get in touch";

export const CONTACT_HEADLINE_LINES = [
  "Let's create",
  "something",
  "extraordinary",
] as const;

export const CONTACT_INTRO =
  "Nidham Consultancy partners with brands, artists and institutions to design and deliver events that leave a lasting impression. Tell us what you're planning — we'll help you shape it into something unforgettable.";

/* ------------------------------------------------------ Contact details --- */

export const CONTACT_DETAILS: readonly ContactDetail[] = [
  {
    id: "phone",
    title: "Phone",
    lines: [CONTACT_PHONE],
    description: "Call us during working hours for a quick conversation.",
    href: CONTACT_PHONE_HREF,
  },
  {
    id: "email",
    title: "Email",
    lines: [CONTACT_EMAIL],
    description: "Send a brief and we'll get back to you shortly.",
    href: `mailto:${CONTACT_EMAIL}`,
  },
  {
    id: "hours",
    title: "Working Hours",
    lines: CONTACT_HOURS,
    description: "We're available through the working week.",
  },
];

/* ------------------------------------------------------------ Form data --- */

export const SERVICE_OPTIONS: readonly ServiceOption[] = [
  { value: "", label: "Select a service" },
  { value: "corporate-events", label: "Corporate Events" },
  { value: "artist-influencer", label: "Artist & Influencer Management" },
  { value: "entertainment", label: "Entertainment" },
  { value: "exhibitions", label: "Exhibitions & Trade Shows" },
  { value: "branding", label: "Branding & Marketing" },
  { value: "other", label: "Something else" },
];

/* --------------------------------------------------------- Why contact --- */

export const WHY_TITLE = "Why work with us";

export const CONTACT_REASONS: readonly ContactReason[] = [
  {
    id: "response",
    index: "01",
    title: "Fast Response",
    description:
      "Every enquiry reaches a real person, not a queue. We reply quickly and move at the pace your event demands.",
  },
  {
    id: "creative",
    index: "02",
    title: "Creative Solutions",
    description:
      "We start from the idea, not the template — shaping each experience around your story, your audience and your ambition.",
  },
  {
    id: "team",
    index: "03",
    title: "Experienced Team",
    description:
      "From concept to final curtain, a seasoned production team handles the detail so the moment feels effortless.",
  },
];

/* ------------------------------------------------------------------ CTA --- */

export const CTA_HEADLINE_LINES = [
  "Ready to build",
  "something memorable?",
] as const;
export const CTA_BUTTON_LABEL = "Start Your Project";

/** In-page anchor for the CTA — the form lives on this page. */
export const FORM_TARGET_ID = "contact-form";

/**
 * Keyless Google Maps embed centred on the UAE (the only location the site
 * specifies). No API key required; interactive by default.
 */
export const MAP_EMBED_SRC =
  "https://www.google.com/maps?q=United%20Arab%20Emirates&z=6&output=embed";

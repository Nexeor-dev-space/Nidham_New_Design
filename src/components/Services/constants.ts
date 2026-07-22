import type { Service } from "./types";

/**
 * Services page content — SINGLE SOURCE OF TRUTH.
 *
 * Every string here is taken verbatim from the live Nidham services page
 * (https://nidham.ae/services): the eyebrow, the tagline used as the hero
 * headline, the intro paragraph, and each service's title + description. Do not
 * shorten, rewrite, or invent copy — only the presentation is new.
 */

/** Small eyebrow above the hero headline. */
export const SERVICES_EYEBROW = "Our Services";

/**
 * Hero headline — the site's own tagline, presented as the large editorial
 * head. Split into lines for the cascading reveal; joined for a11y labels.
 */
export const SERVICES_HEADLINE_LINES = [
  "Transforming visions",
  "into media",
  "masterpieces",
] as const;

/** Intro paragraph — verbatim from the services page. */
export const SERVICES_INTRO =
  "At Nidham Consultancy, we offer expert event management, artist & influencer management, and branding solutions. From corporate events and live concerts to influencer collaborations and PR, we deliver tailored, seamless experiences. Our branding services include promotions, digital campaigns, and influencer endorsements. Let's create unforgettable experiences.";

/** The editorial list. Order + titles + descriptions are verbatim. */
export const SERVICES: readonly Service[] = [
  {
    id: "artist-influencer-management",
    index: "01",
    title: "Artist & Influencer Management",
    description: "Celebrity Bookings, Influencer Collaborations",
    note: "Register with us through our online portal.",
    image: "/images/why-choose-us/talent.jpg",
    imageAlt: "Artist performing under stage lighting",
  },
  {
    id: "entertainment",
    index: "02",
    title: "Entertainment",
    description:
      "PR & Media Management Concerts, Reality Shows, celebrity performances.",
    image: "/images/hero/banner-1.jpg",
    imageAlt: "Live band and vocalist performing on stage under purple lighting",
  },
  {
    id: "corporate-events",
    index: "03",
    title: "Corporate Events",
    description: "Conferences, Product & Property Launches, Award Ceremonies",
    image: "/images/why-choose-us/execution.jpg",
    imageAlt: "Corporate event stage set for a launch",
  },
  {
    id: "exhibitions-trade-shows",
    index: "04",
    title: "Exhibitions & Trade Shows",
    description: "Business Expos, Fashion Shows, Tech Summits",
    image: "/images/hero/banner-2.jpg",
    imageAlt: "Hosts and guests speaking on stage during a media event",
  },
  {
    id: "branding-marketing",
    index: "05",
    title: "Branding & Marketing",
    description: "Event Promotions, Digital Campaigns, Influencer Endorsements",
    image: "/images/why-choose-us/expertise.jpg",
    imageAlt: "Creative branding and campaign visuals",
  },
] as const;

/**
 * Where each row's "Explore" affordance leads. The Footer (`#contact`) is
 * present on every page via the root layout, so this always resolves in-page.
 */
export const SERVICE_TARGET_ID = "contact";

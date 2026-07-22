import type {
  CategoryItem,
  FeaturedEvent,
  GalleryImage,
  StatItem,
  Testimonial,
  TimelineItem,
} from "./types";

/**
 * /events content — SINGLE SOURCE OF TRUTH.
 *
 * The live website has no events page, so this is realistic *sample* content
 * authored to match Nidham's event-management, artist/influencer and branding
 * services. Imagery reuses the site's existing local assets (optimised via
 * next/image) so the page has no external dependencies.
 */

/* ----------------------------------------------------------------- Hero --- */

export const EVENTS_EYEBROW = "Nidham Events";

/** Large display headline, split into lines for the load cascade. */
export const EVENTS_HEADLINE_LINES = [
  "Creating",
  "extraordinary",
  "experiences",
] as const;

export const EVENTS_INTRO =
  "From intimate boardroom summits to stadium-scale festivals, Nidham Consultancy conceives, produces and delivers events that move audiences and elevate brands — across the UAE and beyond.";

/** Cinematic looping background for the hero (with an image poster). */
export const EVENTS_HERO_VIDEO = "/video/event-card-bg.mp4";
export const EVENTS_HERO_POSTER = "/images/event-card-bg.jpg";

/* ------------------------------------------------------- Featured events --- */

export const FEATURED_TITLE = "Featured work";

export const FEATURED_EVENTS: readonly FeaturedEvent[] = [
  {
    id: "corporate-leadership-summit",
    title: "Corporate Leadership Summit",
    category: "Corporate Events",
    location: "Madinat Jumeirah, Dubai",
    date: "March 2025",
    description:
      "A two-day gathering of regional executives, staged as an immersive theatre of ideas — keynote design, live translation, and a bespoke networking lounge engineered for serendipity.",
    cta: "Explore event",
    image: "/images/why-choose-us/execution.jpg",
    imageAlt: "Executives on stage during a corporate leadership summit",
  },
  {
    id: "luxury-brand-activation",
    title: "Luxury Brand Activation",
    category: "Brand Activations",
    location: "Gate Avenue, DIFC, Dubai",
    date: "May 2025",
    description:
      "An invitation-only unveiling for a global maison — sculptural set design, choreographed reveals and a sensory journey that turned a product drop into a cultural moment.",
    cta: "Explore event",
    image: "/images/register-card-img.jpg",
    imageAlt: "Guests at a luxury brand activation evening",
  },
  {
    id: "music-entertainment-festival",
    title: "Music & Entertainment Festival",
    category: "Music Festivals",
    location: "Etihad Arena, Abu Dhabi",
    date: "November 2025",
    description:
      "Headline artists, full production design and crowd-scale logistics — a night of sound and light delivered end to end, from talent booking to the final pyrotechnic cue.",
    cta: "Explore event",
    image: "/images/hero/banner-1.jpg",
    imageAlt: "Vocalist performing with a live band at a festival",
  },
  {
    id: "product-launch-experience",
    title: "Product Launch Experience",
    category: "Product Launches",
    location: "Museum of the Future, Dubai",
    date: "February 2025",
    description:
      "A future-facing launch built around a single hero moment — projection mapping, press choreography and a guest flow tuned so every camera caught the reveal.",
    cta: "Explore event",
    image: "/images/hero/banner-4.jpg",
    imageAlt: "Audience filming a product reveal on their phones",
  },
  {
    id: "fashion-showcase",
    title: "Fashion Showcase",
    category: "Fashion Shows",
    location: "Dubai Design District (d3)",
    date: "October 2025",
    description:
      "A runway staged as an art installation — casting, front-row curation and a soundtrack scored to the collection, with backstage production run to the second.",
    cta: "Explore event",
    image: "/images/why-choose-us/expertise.jpg",
    imageAlt: "Models on a runway at a fashion showcase",
  },
];

/* ------------------------------------------------------------ Categories --- */

export const CATEGORIES_TITLE = "What we stage";

export const EVENT_CATEGORIES: readonly CategoryItem[] = [
  { id: "corporate", name: "Corporate Events", blurb: "Summits, conferences & AGMs" },
  { id: "music", name: "Music Festivals", blurb: "Concerts & live productions" },
  { id: "activations", name: "Brand Activations", blurb: "Experiential & retail moments" },
  { id: "launches", name: "Product Launches", blurb: "Reveals & press experiences" },
  { id: "awards", name: "Award Ceremonies", blurb: "Galas & recognition nights" },
  { id: "conferences", name: "Conferences", blurb: "Forums & industry summits" },
  { id: "private", name: "Private Events", blurb: "VIP & bespoke celebrations" },
  { id: "fashion", name: "Fashion Shows", blurb: "Runways & showcases" },
  { id: "entertainment", name: "Entertainment Productions", blurb: "Shows & touring spectacles" },
];

/* -------------------------------------------------------------- Timeline --- */

export const TIMELINE_TITLE = "Upcoming events";

export const TIMELINE_EVENTS: readonly TimelineItem[] = [
  {
    id: "business-conference",
    date: "18 Sep 2026",
    location: "Dubai World Trade Centre",
    name: "International Business Conference",
    description:
      "Two days of cross-border dialogue on trade, capital and technology, with curated matchmaking for delegates.",
    status: "Registration Open",
  },
  {
    id: "awards-ceremony",
    date: "24 Oct 2026",
    location: "Emirates Palace, Abu Dhabi",
    name: "Excellence in Enterprise Awards",
    description:
      "A black-tie ceremony celebrating the region's most inventive companies and the people behind them.",
    status: "Invitation Only",
  },
  {
    id: "cultural-festival",
    date: "21 Nov 2026",
    location: "Al Majaz Waterfront, Sharjah",
    name: "Cultural Heritage Festival",
    description:
      "An open-air celebration of music, craft and cuisine, produced across multiple stages and installations.",
    status: "Coming Soon",
  },
  {
    id: "government-forum",
    date: "06 Feb 2027",
    location: "Dubai Exhibition Centre",
    name: "Government & Public Sector Forum",
    description:
      "A policy and innovation forum connecting public institutions with private-sector partners.",
    status: "Registration Open",
  },
  {
    id: "private-vip",
    date: "13 Mar 2027",
    location: "Undisclosed, Dubai",
    name: "Private VIP Experience",
    description:
      "A discreet, one-night-only experience designed end to end for a private host and their guests.",
    status: "By Invitation",
  },
];

/* --------------------------------------------------------------- Gallery --- */

export const GALLERY_TITLE = "Moments";

export const GALLERY_IMAGES: readonly GalleryImage[] = [
  { id: "g1", src: "/images/hero/banner-1.jpg", alt: "Live performance under stage lighting", span: "tall" },
  { id: "g2", src: "/images/why-choose-us/execution.jpg", alt: "Event production in progress", span: "regular" },
  { id: "g3", src: "/images/hero/banner-3.webp", alt: "Stage crowd bathed in coloured light", span: "tall" },
  { id: "g3b", src: "/images/hero/banner-2.jpg", alt: "Speakers on stage at a media event", span: "wide" },
  { id: "g4", src: "/images/about/team.jpg", alt: "The Nidham team at work", span: "regular" },
  { id: "g5", src: "/images/why-choose-us/talent.jpg", alt: "Artist performing to a crowd", span: "tall" },
  { id: "g6", src: "/images/hero/banner-4.jpg", alt: "Audience filming a concert", span: "regular" },
  { id: "g7", src: "/images/why-choose-us/expertise.jpg", alt: "Runway and showcase lighting", span: "regular" },
  { id: "g8", src: "/images/banner-bg.jpg", alt: "Crowd at a large-scale event", span: "wide" },
];

/* ------------------------------------------------------------ Statistics --- */

export const STATS: readonly StatItem[] = [
  { id: "events", value: 250, suffix: "+", label: "Events Delivered" },
  { id: "brands", value: 100, suffix: "+", label: "Brand Collaborations" },
  { id: "artists", value: 50, suffix: "+", label: "Artists Managed" },
  { id: "countries", value: 15, suffix: "+", label: "Countries Reached" },
];

/* ---------------------------------------------------------- Testimonials --- */

export const TESTIMONIALS_TITLE = "In their words";

export const TESTIMONIALS: readonly Testimonial[] = [
  {
    id: "t1",
    quote:
      "Nidham turned our product launch into a moment our guests still talk about. Flawless from first concept to final curtain.",
    name: "Marketing Director",
    role: "Global Technology Brand",
  },
  {
    id: "t2",
    quote:
      "They think like producers and operate like a Swiss watch. Every detail was considered, and every deadline was met.",
    name: "Chief Executive",
    role: "Regional Retail Group",
  },
  {
    id: "t3",
    quote:
      "An outstanding creative partner. They translated a vague brief into a sold-out, unforgettable experience.",
    name: "Head of Events",
    role: "International Conference Series",
  },
];

/* ------------------------------------------------------------------ CTA --- */

export const CTA_HEADLINE_LINES = ["Let's create", "your next event."] as const;
export const CTA_BUTTON_LABEL = "Start Your Project";

/** In-page target for CTAs / row "Explore" — the footer is on every page. */
export const CONTACT_TARGET_ID = "contact";

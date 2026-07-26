import type { EventItem } from "./types";

/**
 * THE single source of truth for events across the whole site.
 *
 * The Home page renders the `featured` subset as a preview (see EventsGallery);
 * the /events page renders the full list (see EventsPortfolio). Both drive the
 * exact same {@link EventCard} through {@link EventGrid}, so the two pages can
 * never drift into different card designs again.
 *
 * To add an event: append an entry here and it appears in the portfolio
 * automatically. Mark it `featured: true` to also surface it on the Home page.
 * The card adapts to the fields present — give it a `videoSrc` (self-hosted
 * file) or a `videoUrl` (embed) for a play button over the artwork, a
 * `galleryHref` for "View Gallery", a `learnMoreHref` for "Learn More"; omit
 * them and those actions simply vanish.
 */

/** In-page CTA target — the footer/contact block is present on every page. */
const CONTACT = "#contact";
/** Placeholder highlight reel shared by the video-backed events. */
const HIGHLIGHTS_VIDEO = "https://www.youtube.com/embed/aqz-KE-bpKQ";

/**
 * The Melody Dreamz film — self-hosted, so it plays in the cinematic lightbox
 * with real controls instead of an embed's chrome.
 *
 * 1280×720 (exactly the 16:9 the lightbox frames), H.264/AAC, 2:04, ~46 MB at
 * 2.9 Mbps. Nothing fetches it until the play button is pressed: the `<video>`
 * element does not exist until the modal mounts, so the weight costs the page
 * nothing on load. It is still a heavy first play on mobile data — a compressed
 * rendition or an HLS ladder would be the next step if that matters.
 */
const MELODY_DREAMZ_FILM = "/video/nidham_yt.mp4";

export const EVENTS: readonly EventItem[] = [
  {
    id: "melody-dreamz",
    category: "Entertainment",
    title: "Hit Melody Dreamz",
    date: "2025",
    location: "Dubai Opera, UAE",
    description:
      "After an acclaimed inaugural season with playback maestro Naresh Iyer — since telecast nationally — Melody Dreamz returns with live orchestration and the region's most celebrated voices on one stage.",
    image: "/images/event/Hit-Melody-Dreamz.jpg",
    imageAlt: "Hit Melody Dreamz live music production on a lit stage.",
    videoSrc: MELODY_DREAMZ_FILM,
    videoTitle: "Hit Melody Dreamz — Event Film",
    learnMoreHref: CONTACT,
    featured: true,
  },
  {
    id: "music-festival",
    category: "Music",
    title: "Music & Entertainment Festival",
    date: "2025",
    location: "Etihad Arena, Abu Dhabi",
    description:
      "Headline artists, full production design and crowd-scale logistics — a night of sound and light delivered end to end, from talent booking to the final pyrotechnic cue.",
    image: "/images/event/Music-Entertainment-Festival.jpg",
    imageAlt: "Crowd and stage lights at a music and entertainment festival.",
    videoUrl: HIGHLIGHTS_VIDEO,
    learnMoreHref: CONTACT,
  },
  {
    id: "luxury-brand-launch",
    category: "Luxury",
    title: "Luxury Brand Launch",
    date: "2025",
    location: "Museum of the Future, Dubai",
    description:
      "An invitation-only unveiling for a global maison — sculptural sets, choreographed reveals and a sensory journey that turned a product drop into a cultural moment.",
    image: "/images/event/Luxury-Brand-Launch.jpg",
    imageAlt: "Guests at an exclusive luxury brand launch.",
    galleryHref: CONTACT,
    learnMoreHref: CONTACT,
  },
  {
    id: "sports-awards",
    category: "Sports",
    title: "Sports Awards",
    date: "2024",
    location: "Coca-Cola Arena, Dubai",
    description:
      "A black-tie night honouring regional athletes — broadcast production, trophy moments and red-carpet arrivals delivered to the second.",
    image: "/images/event/Sports-Awards.jpg",
    imageAlt: "Athletes and guests at a sports awards ceremony.",
    galleryHref: CONTACT,
    learnMoreHref: CONTACT,
  },
  {
    id: "technology-expo",
    category: "Exhibitions",
    title: "Technology Expo",
    date: "2025",
    location: "Dubai World Trade Centre",
    description:
      "A multi-hall exhibition of emerging technology — stand design, keynote stages and delegate experience engineered at scale.",
    image: "/images/event/Technology-Expo.jpg",
    imageAlt: "Visitors exploring a large technology exhibition.",
    learnMoreHref: CONTACT,
  },
];

/** The Home page preview — a real subset of the full portfolio above. */
export const FEATURED_EVENTS: readonly EventItem[] = EVENTS.filter(
  (e) => e.featured,
);

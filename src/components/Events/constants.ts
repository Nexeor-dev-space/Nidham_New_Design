import type { EventCardItem, EventInfo } from "./types";

export const EVENTS_SECTION_LABEL = "Events";
export const EVENTS_SECTION_TITLE = "Corporate Events";
export const EVENTS_FEATURED_LABEL = "Featured Event";
export const EVENTS_STATUS_LABEL = "Registration Open";

/** Authored as lines so the composition drives the line-by-line reveal. */
export const EVENTS_HEADING: string[] = [
  "Register for Our",
  "Next Signature",
  "Event",
];

export const EVENTS_DESCRIPTION =
  "The next chapter of Melody Dreamz comes to Dubai Opera. Following an acclaimed inaugural season featuring playback artist Naresh Iyer, the evening brings live orchestration and the region's most celebrated voices together on one stage.";

export const EVENTS_INFO: EventInfo[] = [
  { id: "date", label: "Date", value: "15 October 2026", icon: "date" },
  { id: "time", label: "Time", value: "7:00 PM", icon: "time" },
  { id: "location", label: "Location", value: "Dubai Opera, UAE", icon: "location" },
];

export const EVENTS_PRIMARY_TEXT = "Register Now";
export const EVENTS_SECONDARY_TEXT = "View Details";
export const EVENTS_SEATS_TEXT = "Limited Seats Available";
export const EVENTS_ATTENDEES_TEXT = "Join 1,200+ visionaries";

/** Existing repo asset — swap for the event photo when available. */
export const EVENTS_IMAGE = "/images/register-card-img.jpg";
export const EVENTS_IMAGE_ALT =
  "Vocalist performing live on stage with musicians at a signature event.";

/** Matches the Date / Time card; Dubai is UTC+4. Drives the live countdown. */
export const EVENTS_DATE = "2026-10-15T19:00:00+04:00";
export const EVENTS_COUNTDOWN_TITLE = "Final Countdown";
export const EVENTS_COUNTDOWN_LINK_TEXT = "Learn more about VIP access";

/**
 * Event-highlight cards below the Corporate Events block. Data-driven — add or
 * remove entries here to change the gallery. Thumbnails reuse the existing
 * abstract asset and a placeholder video; swap `image` / `videoUrl` per event.
 */
const MELODY_DESCRIPTION =
  "Melody Dreamz: After the first successful inaugural show, we had an outstanding event featuring The Music Maestro, Naresh Iyer, which is set to be telecast on a major network.";

export const EVENTS_GALLERY: EventCardItem[] = [
  {
    id: "melody-dreamz-1",
    category: "Entertainment",
    tag: "Hit Melody Dreamz",
    description: MELODY_DESCRIPTION,
    image: "/images/event-card-bg.jpg",
    imageAlt: "Abstract macro texture in blues, purples and magenta.",
    videoUrl: "https://www.youtube.com/embed/aqz-KE-bpKQ",
  },
  {
    id: "melody-dreamz-2",
    category: "Entertainment",
    tag: "Hit Melody Dreamz",
    description: MELODY_DESCRIPTION,
    image: "/images/event-card-bg.jpg",
    imageAlt: "Abstract macro texture in blues, purples and magenta.",
    videoUrl: "https://www.youtube.com/embed/aqz-KE-bpKQ",
  },
];

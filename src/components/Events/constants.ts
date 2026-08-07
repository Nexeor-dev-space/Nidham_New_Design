import type { EventInfo } from "./types";

export const EVENTS_SECTION_LABEL = "Events";
export const EVENTS_SECTION_TITLE = "Our Events";
export const EVENTS_STATUS_LABEL = "Coming Soon";

/**
 * Authored as lines so the composition drives the line-by-line reveal.
 *
 * Of the two headings offered, this is the shorter-measure one ("A Global Stage
 * for" / "Exceptional Talent", 18 characters at the longest). The alternative
 * ran to 24 ("The Ultimate Celebration") — two more than the line it replaces —
 * which risks a fourth wrapped line at some widths and would change the block's
 * height. This one is strictly narrower than what was there, so the layout
 * cannot move.
 */
export const EVENTS_HEADING: string[] = [
  "Dance off Dubai",
  "A Global Stage for",
  "Exceptional Talent",
];

/**
 * Rendered as a single `<p>`, so the brief's two paragraphs are joined here.
 * Splitting them would mean a second element in the copy column — a layout
 * change, which this update explicitly is not.
 */
export const EVENTS_DESCRIPTION =
  "Dance off Dubai is an upcoming celebration of artistry, passion, and world-class performances. Bringing together exceptional dancers, renowned judges, and an unforgettable audience experience, this signature event promises to become one of the region's most anticipated cultural showcases. Stay connected for official dates, registrations, and exciting announcements.";

export const EVENTS_INFO: EventInfo[] = [
  { id: "date", label: "Date", value: "To Be Announced", icon: "date" },
  { id: "time", label: "Time", value: "Coming Soon", icon: "time", accent: true },
  { id: "location", label: "Location", value: "Dubai, UAE", icon: "location" },
];

/**
 * Rendered as `<strong>{seats}</strong> — {attendees}`, so the first string
 * carries no full stop: the em-dash is the join.
 */
export const EVENTS_SEATS_TEXT = "Official announcements coming soon";
export const EVENTS_ATTENDEES_TEXT = "Be among the first to know.";

/**
 * The ballet frame, kept by choice — a swap to `dance-bg.jpg` (the long-exposure
 * dancer in red light) was tried and rejected.
 *
 * `EVENTS_IMAGE_ALT` no longer describes that other file. It used to read
 * "Dancer mid-turn, trailing red and gold fabric under stage light", which
 * described `dance-bg.jpg` while this constant pointed at `ance-bg-new.jpg` —
 * so the page's alt text had been describing an image it was not showing. It
 * now matches what is actually on screen; if the file changes again, this string
 * has to change with it.
 */
export const EVENTS_IMAGE = "/images/ance-bg-new.jpg";
export const EVENTS_IMAGE_ALT =
  "Two ballet dancers mid-pose, arms raised, in sequinned bodices and tulle skirts.";

/* ---------- The glass card over the image --------------------------------- */

/**
 * This card used to be a live countdown, then a countdown-shaped notice with a
 * "Notify Me" CTA. Both are gone now: no target date to count down to, and no
 * action to send anyone to yet — this card states the announcement and nothing
 * else. Same glass surface, same position, same sheen. See `AnnouncementCard`.
 */
export const EVENTS_NOTICE_BADGE = "Official Announcement";
export const EVENTS_NOTICE_TITLE = "Dance off Dubai";
export const EVENTS_NOTICE_BODY = "A spectacular dance experience is arriving soon.";

/*
 * The event-highlight cards that used to live here now come from the unified
 * source of truth in `events.data.ts` (shared by the Home preview and the
 * /events portfolio via EventGrid / EventCard). This file keeps only the
 * Corporate Events (registration/countdown) block's content.
 */

import type { EventInfo } from "./types";
import { EVENT_DATE } from "@/src/components/Hero/constants";

export const EVENTS_SECTION_LABEL = "Events";
export const EVENTS_SECTION_TITLE = "Corporate Events";
export const EVENTS_FEATURED_LABEL = "Featured Event";
export const EVENTS_STATUS_LABEL = "Registration Open";

/** Authored as lines so the composition drives the line-by-line reveal. */
export const EVENTS_HEADING: string[] = [
  "Register for Our",
  "Next Dance Competition",
  "Event",
];

export const EVENTS_DESCRIPTION =
  "Melody Dreamz returns to Dubai Opera for its next edition. After an acclaimed inaugural season with playback maestro Naresh Iyer — since telecast nationally — the evening gathers live orchestration and the region's most celebrated voices on one stage.";

export const EVENTS_INFO: EventInfo[] = [
  { id: "date", label: "Date", value: "15 October 2026", icon: "date" },
  { id: "time", label: "Time", value: "7:00 PM", icon: "time" },
  { id: "location", label: "Location", value: "Dubai Opera, UAE", icon: "location" },
];

export const EVENTS_PRIMARY_TEXT = "Register Now";
export const EVENTS_SECONDARY_TEXT = "View Details";
export const EVENTS_SEATS_TEXT = "Limited Seats Available";
export const EVENTS_ATTENDEES_TEXT = "Join 1,200+ visionaries";

export const EVENTS_IMAGE = "/images/ance-bg-new.jpg";
export const EVENTS_IMAGE_ALT =
  "Dancer mid-turn, trailing red and gold fabric under stage light.";

/** Matches the Date / Time card; Dubai is UTC+4. Drives the live countdown. */
/** Single source of truth — always matches the announcement-bar countdown. */
export const EVENTS_DATE = EVENT_DATE;
export const EVENTS_COUNTDOWN_TITLE = "Final Registration Countdown";
export const EVENTS_COUNTDOWN_LINK_TEXT = "Register Now";

/*
 * The event-highlight cards that used to live here now come from the unified
 * source of truth in `events.data.ts` (shared by the Home preview and the
 * /events portfolio via EventGrid / EventCard). This file keeps only the
 * Corporate Events (registration/countdown) block's content.
 */

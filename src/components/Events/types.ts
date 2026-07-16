export type InfoIcon = "date" | "time" | "location";

export interface EventInfo {
  id: string;
  /** Small uppercase label, e.g. "DATE". */
  label: string;
  /** The value, e.g. "15 October 2026". */
  value: string;
  icon: InfoIcon;
}

export interface CorporateEventsProps {
  /** Small label inside the top divider, e.g. "Events". */
  sectionLabel?: string;
  /** Centred section title, e.g. "Corporate Events". */
  sectionTitle?: string;
  /** Small left label, e.g. "Featured Event". */
  featuredLabel?: string;
  /** Status pill text, e.g. "Registration Open". */
  statusLabel?: string;
  /** Main heading. Pass a string[] to control the line-by-line reveal. */
  heading?: string | string[];
  /** Supporting paragraph. */
  description?: string;
  /** The three info cards (date / time / location). */
  info?: EventInfo[];
  primaryText?: string;
  primaryLink?: string;
  secondaryText?: string;
  secondaryLink?: string;
  /** Bold lead-in of the social-proof line, e.g. "Limited Seats Available". */
  seatsText?: string;
  /** Remainder of the social-proof line, e.g. "Join 1,200+ visionaries". */
  attendeesText?: string;
  image?: string;
  imageAlt?: string;
  /** ISO datetime the live countdown targets. */
  eventDate?: string;
  /** Label above the countdown, e.g. "Final Countdown". */
  countdownTitle?: string;
  /** Link text under the countdown. */
  countdownLinkText?: string;
  countdownLink?: string;
  id?: string;
}

export interface EventCardItem {
  id: string;
  /** Primary uppercase category, e.g. "Entertainment". */
  category: string;
  /** Secondary uppercase tag, e.g. "Hit Melody Dreamz". */
  tag: string;
  /** Body copy (line-clamped to 3 lines). */
  description: string;
  image: string;
  imageAlt: string;
  /** YouTube/Vimeo embed URL, WITHOUT an autoplay param (added on open). */
  videoUrl: string;
}

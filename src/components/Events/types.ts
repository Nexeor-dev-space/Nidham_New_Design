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

/**
 * The single, unified event model — one source of truth for BOTH the Home
 * "featured preview" and the full /events portfolio. Cards adapt to whatever
 * fields are present (e.g. "Watch Highlights" appears only when `videoUrl` is
 * set, "View Gallery" only when `galleryHref` is), so new events scale in
 * without any redesign. See {@link EventItem} consumers: EventCard / EventGrid.
 */
export interface EventItem {
  id: string;
  /** Uppercase category shown in the meta row, e.g. "Entertainment". */
  category: string;
  /** Card title, e.g. "Hit Melody Dreamz". */
  title: string;
  /** Optional date/year shown beside the category, e.g. "2025". */
  date?: string;
  /** Optional editorial location line, e.g. "Dubai Opera, UAE". */
  location?: string;
  /** Body copy. Home clamps it (compact); the structure stays identical. */
  description: string;
  image: string;
  imageAlt: string;
  /**
   * A self-hosted film, e.g. "/video/nidham_yt.mp4" — a real file path, not an
   * embed URL. This is what opens the cinematic lightbox
   * ({@link CinematicVideoModal}) with its own controls: seek, volume, mute,
   * fullscreen and Picture-in-Picture all need a real `<video>`, which an
   * iframe cannot give us. Takes precedence over `videoUrl` when both are set.
   */
  videoSrc?: string;
  /** Name announced for the player. Falls back to `title`. */
  videoTitle?: string;
  /** YouTube/Vimeo embed URL, WITHOUT an autoplay param (added on open).
   *  Opens the simpler iframe lightbox ({@link VideoModal}).
   *  Either video field gives the card its play button. */
  videoUrl?: string;
  /** Optional "View Gallery" destination. */
  galleryHref?: string;
  /** Optional "Learn More" destination. */
  learnMoreHref?: string;
  /** Marks an event for the Home page's featured preview subset. */
  featured?: boolean;
}

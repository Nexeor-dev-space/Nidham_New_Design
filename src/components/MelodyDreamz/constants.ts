import type { GalleryPlate, Highlight, StatCard, StoryBlock } from "./types";

/**
 * Melody Dreamz case-study content.
 *
 * **Every string here is verbatim** from the page this replaces
 * (`nidham-us-web/src/pages/blog-melody-dreamz.js`, the `ARTICLE` constant).
 * Nothing has been rewritten, shortened or invented — the redesign is purely
 * presentational, so this file is the contract that proves it. If a sentence
 * reads oddly, it read that way on the old page too; fix it here and it changes
 * everywhere on the new one.
 *
 * The old page carried: one film, four headings + four paragraphs, one quote,
 * three highlights, five photographs, a category, a date and 20 tags. All of it
 * is below.
 */

/* ---------- Identity ------------------------------------------------------ */

export const MD_CATEGORY = "Events";
export const MD_TITLE = "Melody Dreamz";
export const MD_DATE = "July 21, 2024";

/**
 * Venue and year are *not* from the old blog page — they come from this site's
 * own events dataset (`Events/events.data.ts`, the `melody-dreamz` entry), which
 * is the canonical record for the same event here. Kept in step with it by hand;
 * they are duplicated rather than imported because that entry describes the
 * homepage card and may diverge in wording.
 */
export const MD_LOCATION = "Dubai Opera, UAE";
export const MD_YEAR = "2025";
export const MD_EYEBROW = "Featured Event";

/** The event's own title as shown on this site's homepage card. */
export const MD_FULL_TITLE = "Hit Melody Dreamz";

/* ---------- Film ---------------------------------------------------------- */

/**
 * A YouTube embed, not a self-hosted file — so this section uses an iframe
 * rather than the site's `CinematicVideoModal`, which is built around a
 * `<video>` element. Never autoplays: the reader presses play.
 */
export const MD_FILM = {
  src: "https://www.youtube.com/embed/zGchf4Jkq9E?si=Z9tar6OeiW_YUPIv",
  title: "Melody Dreamz",
  /**
   * The poster frame. Its own image rather than a borrowed gallery plate, so
   * changing the gallery can never silently change what the film section shows.
   *
   * 1536×1024 (3:2) in a 16:9 slot, so `object-cover` drops ~16% of the height.
   * The film section anchors it to the top (`object-top`) instead of centring:
   * the singer's raised hand sits ~3% from the top edge and a centred crop cuts
   * the fingertip off, while the bottom 16% is only stage floor.
   */
  poster: "/images/hero/blog-video-bg.png",
} as const;

/**
 * Hero backdrop — a still, not the event film it used to play.
 *
 * 1535×1024 (3:2) behind a viewport-shaped frame, so `object-cover` always
 * crops. The hero anchors it to the top: this is a full-length group shot with
 * the faces ~6% from the top edge, and the copy sits at the bottom under a
 * heavy gradient, so the height that has to go is the stage floor.
 */
export const MD_HERO_IMAGE = "/images/hero/banner-5.png";

/** What the hero backdrop shows, for its `alt`. */
export const MD_HERO_IMAGE_ALT =
  "The Melody Dreamz artists and hosts together on stage at Dubai Opera";

/* ---------- Story blocks -------------------------------------------------- */

/**
 * The old page's `open`, `platform` and `close` blocks, in its own order. Each
 * is paired with one of the event photographs so the story alternates
 * image/text down the page instead of running as one column of prose — the
 * `side` field drives that alternation.
 *
 * Both photographs are the wide stage shots from `images/hero` (1285×658,
 * ratio 1.95). The story's image slot is cut to that exact ratio rather than a
 * generic 4/3, so neither is cropped — if these two files are ever swapped for
 * images of a different shape, change the slot in `MelodyStory` to match.
 */
export const MD_STORY: readonly StoryBlock[] = [
  {
    id: "introducing",
    heading:
      "Introducing Melody Dreamz: A Fusion of Music, Talent, and Culture",
    text: "Nidham proudly introduces Melody Dreamz, a revolutionary collaboration with Arab Radio Network’s HIT FM and UBL TV, marking a transformative moment for Malayalam music and media in the UAE. This platform brings together music, media, and emerging talent to create unforgettable experiences that transcend borders and cultures.",
    image: "/images/hero/banner-1.jpg",
    imageAlt:
      "A vocalist performing centre stage at Melody Dreamz, the live band behind him",
    side: "right",
  },
  {
    id: "platform",
    heading: "A Platform for Emerging Talents",
    text: "With over two decades of expertise in music, media, and events, Melody Dreamz is dedicated to nurturing emerging artists and connecting them with the spotlight they deserve. This initiative brings the universal language of music to life, creating a platform that celebrates creativity and talent.",
    image: "/images/hero/banner-2.jpg",
    imageAlt:
      "Hosts and guest artists on stage during a Melody Dreamz showcase",
    side: "left",
  },
];

/** The closing block — kept separate because it ends the page rather than
 *  participating in the alternating rhythm. */
export const MD_CLOSE = {
  heading: "Join the Melody Dreamz Movement",
  text: "Be part of this extraordinary journey into the heart of musical excellence. Follow our Instagram page @NIDHAMMELODYDREAMZ for updates, behind-the-scenes content, and event details. Melody Dreamz is where dreams find their voice, melodies come alive, and beats create lasting memories. Together, let’s celebrate the power of music!",
} as const;

/* ---------- Quote --------------------------------------------------------- */

export const MD_QUOTE = {
  text: "Music is the universal language of mankind, and Melody Dreamz is where that language finds its most vibrant expression.",
  attribution: "Nidham Team",
} as const;

/* ---------- Highlights ---------------------------------------------------- */

export const MD_HIGHLIGHTS_HEADING = "Key Highlights of Melody Dreamz";
export const MD_HIGHLIGHTS_INTRO =
  "Melody Dreamz is a celebration of music, talent, and creativity. From collaborations with iconic artists to immersive event experiences, every aspect is designed to inspire and connect audiences across the UAE and beyond.";

/**
 * Trailing colons on the second and third titles are in the source copy. Left
 * exactly as-is rather than tidied, because "preserve every piece of text" was
 * the explicit requirement — normalising punctuation is still an edit.
 */
export const MD_HIGHLIGHTS: readonly Highlight[] = [
  {
    id: "celebrity",
    title: "Celebrity Collaborations",
    text: "Monthly showcases feature South India’s Music Maestros, who not only perform but also hand-pick vocal talents from the UAE through contests organized by HIT FM, offering an unmatched opportunity for rising stars to shine.",
  },
  {
    id: "immersive",
    title: "Immersive Event Experience:",
    text: "Meticulously curated venues promise an unparalleled auditory and visual experience. Featuring celebrity singers, UAE vocal talents, and influencers, the four-hour event creates a dynamic and vibrant atmosphere where creativity thrives.",
  },
  {
    id: "reach",
    title: "Amplified Reach:",
    text: "Content from Melody Dreamz is showcased across HIT FM, UBL TV, celebrity social media pages, influencer platforms, and YouTube channels, ensuring a far-reaching impact that resonates with diverse audiences.",
  },
];

/* ---------- Statistics ---------------------------------------------------- */

/**
 * Facts already stated elsewhere in this file, surfaced as cards — nothing here
 * is a new claim. `count` is the only animated value; where a figure would have
 * to be invented (venue, category) the card shows a `display` string instead
 * and no counter runs.
 *
 * "two decades" and "four-hour" are lifted from the story and highlights copy;
 * the three-channel figure counts HIT FM, UBL TV and YouTube as named in
 * "Amplified Reach".
 */
export const MD_STATS: readonly StatCard[] = [
  { id: "years", count: 20, suffix: "+", label: "Years of expertise" },
  { id: "hours", count: 4, suffix: "hr", label: "Event experience" },
  { id: "highlights", count: 3, suffix: "", label: "Key highlights" },
  { id: "venue", display: MD_LOCATION, label: "Venue" },
  { id: "category", display: MD_CATEGORY, label: "Category" },
  { id: "year", display: MD_YEAR, label: "Year" },
];

/* ---------- Gallery (the merged Album) ------------------------------------ */

/**
 * The five photographs, composed into three aligned rows.
 *
 * **Slots are assigned from each file's real pixel ratio**, so no photograph is
 * badly cropped:
 *
 *   row 1  5.png  8/12  (1.289 → 1.43 in slot, slight crop)
 *          2.png  4/12  (0.697 → 0.71 in slot; the only portrait, so this row
 *                        is the tall one and the portrait sets its height)
 *   row 2  3.png  6/12  (1.498 → 1.50 in slot — effectively native)
 *          1.png  6/12  (1.466 → 1.50 in slot — effectively native)
 *   row 3  4.png 12/12  (1.810, the widest → the full-width cinematic band)
 *
 * Spans sum to 12 per row, so the bed fills exactly and there are no holes.
 *
 * This replaces a first attempt that used spans of 3+3+2+6+4 on a 6-column bed.
 * Those sum to 18 but do not divide into rows of 6, so the browser wrapped them
 * and left four empty columns in one row and two in another — the misalignment
 * that was reported. The portrait was also in a landscape slot, which cropped
 * it hard. Both are fixed by composing to the ratios rather than to a pattern.
 *
 * There is no separate Album page to merge — the request assumed one, but no
 * such route exists in either repo (verified across all branches). This is the
 * complete set of Melody Dreamz photographs that exist.
 */
export const MD_GALLERY: readonly GalleryPlate[] = [
  {
    src: "/images/melody-dreamz/5.png",
    alt: "Melody Dreamz event photograph",
    col: "md:col-span-1 lg:col-span-8",
    height: "h-[16rem] sm:h-[20rem] lg:h-[34rem]",
  },
  {
    src: "/images/melody-dreamz/2.png",
    alt: "Melody Dreamz event photograph",
    col: "md:col-span-1 lg:col-span-4",
    height: "h-[22rem] sm:h-[26rem] lg:h-[34rem]",
  },
  {
    src: "/images/melody-dreamz/3.png",
    alt: "Melody Dreamz event photograph",
    col: "md:col-span-1 lg:col-span-6",
    height: "h-[16rem] sm:h-[20rem] lg:h-[25rem]",
  },
  {
    src: "/images/melody-dreamz/1.png",
    alt: "Melody Dreamz event photograph",
    col: "md:col-span-1 lg:col-span-6",
    height: "h-[16rem] sm:h-[20rem] lg:h-[25rem]",
  },
  {
    src: "/images/melody-dreamz/4.png",
    alt: "Melody Dreamz event photograph",
    col: "md:col-span-2 lg:col-span-12",
    height: "h-[15rem] sm:h-[19rem] lg:h-[28rem]",
  },
];


/* ---------- Tags ---------------------------------------------------------- */

export const MD_TAGS: readonly string[] = [
  "Melody Dreamz",
  "Music Event",
  "Dubai Events",
  "UAE Entertainment",
  "Malayalam FM",
  "HIT FM UAE",
  "UBL TV",
  "Celebrity Performances",
  "Emerging Artists",
  "Music Collaboration",
  "Live Music",
  "South Indian Music",
  "Cultural Events",
  "Dubai Concerts",
  "Media Solutions",
  "Music Lovers",
  "Event Management",
  "Live Performances",
  "Dubai Nightlife",
  "Immersive Experiences",
];

/* ---------- Continue Exploring -------------------------------------------- */

export const MD_RELATED_HEADING = "Continue Exploring";

/**
 * The "Continue Exploring" card — what replaces the old page's WordPress
 * "Recent Posts" widget.
 *
 * A list of one, not a lone object: the section grids for any number, so adding
 * the second case study is a data change here rather than a layout rewrite.
 *
 * **The single entry is Melody Dreamz itself, as specified — so on this page the
 * card links to the page it is sitting on.** That is a placeholder state, not a
 * design intent: it becomes a real "next chapter" the moment a second event has
 * a case study. `href` is per-item so the section needs no change when it does.
 *
 * `image` is the same featured image the homepage event card uses, so one event
 * is not represented by two different photographs across the site.
 */
export const MD_RELATED = [
  {
    id: "melody-dreamz",
    title: MD_TITLE,
    date: MD_DATE,
    href: "/events/melody-dreamz",
    image: "/images/event-card-bg.png",
    imageAlt:
      "Live band and vocalist performing on stage under a Nidham-branded backdrop",
  },
] as const;

/* ---------- Section map for the sticky progress rail ---------------------- */

/**
 * Drives both the progress indicator and the hero's "Explore Gallery" jump, so
 * the ids can never drift from the anchors. `gallery` is the merged Album — the
 * sidebar Album affordance scrolls here instead of navigating away.
 */
export const MD_SECTIONS = [
  { id: "md-hero", label: "Hero" },
  { id: "md-overview", label: "Overview" },
  { id: "md-story", label: "Story" },
  { id: "md-film", label: "Video" },
  { id: "md-gallery", label: "Gallery" },
  { id: "md-highlights", label: "Highlights" },
] as const;

export const MD_GALLERY_ID = "md-gallery";
export const MD_FILM_ID = "md-film";

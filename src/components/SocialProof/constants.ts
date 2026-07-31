import type { Testimonial } from "./types";

/**
 * Social-proof content. All placeholder — realistic UAE-event copy the client
 * can replace field-for-field.
 *
 * Testimonials carry a quote and a name and nothing else; see the note on
 * {@link Testimonial} for why the role/company/logo attribution was dropped.
 * Company marks live on the trusted-by wall (Partners/constants) instead.
 */

export const SOCIAL_PROOF_LABEL = "Client Stories";

export const SOCIAL_PROOF_TITLE = "Trusted by Industry Leaders";

export const SOCIAL_PROOF_SUBTITLE =
  "From corporate conferences to world-class entertainment experiences, our commitment to excellence has earned the trust of clients across the UAE and beyond.";

export const TESTIMONIALS: readonly Testimonial[] = [
  {
    id: "arn",
    quote:
      "Nidham turned an ambitious brief into a flawless three-day summit. Every detail — from the run of show to the ambient lighting — was executed with a precision that let our team simply enjoy the moment.",
    name: "Fatima Musharraf",
  },
  {
    id: "hit967",
    quote:
      "Their command of production is rare. We handed them a live broadcast concept and they returned a cinematic experience that our audience is still talking about months later.",
    name: "Rashed Nazar",
  },
  {
    id: "mediafactory",
    quote:
      "Working with Nidham feels less like hiring a vendor and more like gaining a creative partner. Calm under pressure, generous with ideas, and relentless about the details that matter.",
    name: "Sophia Meridian",
  },
  {
    id: "urbanaxis",
    quote:
      "Our property launch had to feel like an event and convert like a campaign. Nidham delivered both — a sold-out room and a guest experience that made the brand impossible to forget.",
    name: "Omar Haddad",
  },
];

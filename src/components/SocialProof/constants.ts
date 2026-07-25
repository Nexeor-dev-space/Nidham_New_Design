import type { Testimonial } from "./types";
import { PARTNERS } from "@/src/components/Partners/constants";

/**
 * Social-proof content. All placeholder — realistic UAE-event copy the client
 * can replace field-for-field.
 *
 * The testimonials borrow company logos from the shared white-logo set
 * (`PARTNERS`) so the "trusted by" wall and the quote attributions stay in
 * lockstep: change a brand's asset once in Partners/constants and both update.
 */

export const SOCIAL_PROOF_LABEL = "Client Stories";

export const SOCIAL_PROOF_TITLE = "Trusted by Industry Leaders";

export const SOCIAL_PROOF_SUBTITLE =
  "From corporate conferences to world-class entertainment experiences, our commitment to excellence has earned the trust of clients across the UAE and beyond.";

/** Small helper so testimonials can reference a partner logo by id. */
const logoOf = (id: string) => {
  const p = PARTNERS.find((partner) => partner.id === id);
  return p
    ? { logo: p.logo, logoWidth: p.width, logoHeight: p.height }
    : {};
};

export const TESTIMONIALS: readonly Testimonial[] = [
  {
    id: "arn",
    quote:
      "Nidham turned an ambitious brief into a flawless three-day summit. Every detail — from the run of show to the ambient lighting — was executed with a precision that let our team simply enjoy the moment.",
    name: "Fatima Al Marri",
    position: "Head of Brand Experience",
    company: "ARN",
    ...logoOf("arn"),
  },
  {
    id: "hit967",
    quote:
      "Their command of production is rare. We handed them a live broadcast concept and they returned a cinematic experience that our audience is still talking about months later.",
    name: "Rashed Al Nuaimi",
    position: "Marketing Director",
    company: "Hit 96.7",
    ...logoOf("hit967"),
  },
  {
    id: "mediafactory",
    quote:
      "Working with Nidham feels less like hiring a vendor and more like gaining a creative partner. Calm under pressure, generous with ideas, and relentless about the details that matter.",
    name: "Sophia Meridian",
    position: "Founder & Creative Lead",
    company: "Media Factory",
    ...logoOf("mediafactory"),
  },
  {
    id: "urbanaxis",
    quote:
      "Our property launch had to feel like an event and convert like a campaign. Nidham delivered both — a sold-out room and a guest experience that made the brand impossible to forget.",
    name: "Omar Haddad",
    position: "Chief Executive Officer",
    company: "Urban Axis Ventures",
    ...logoOf("urbanaxis"),
  },
];

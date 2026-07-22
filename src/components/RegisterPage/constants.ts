import type {
  FaqItem,
  Highlight,
  ProcessStep,
  RegisterBenefit,
  RegisterField,
  SelectOption,
} from "./types";

/**
 * /register content — SINGLE SOURCE OF TRUTH.
 *
 * The live Nidham register flow offers two pathways — "Influencer / Model" and
 * "Event Contestant" — whose field sets are rendered client-side and aren't
 * machine-readable. This page preserves that two-pathway workflow (a type
 * selector) and the submit → review → confirmation journey, with the standard
 * required inputs such a registration needs. Field definitions live here so the
 * set / required flags can be aligned to the production schema in one place,
 * without changing the UI.
 */

/* ----------------------------------------------------------- Hero / left --- */

export const REGISTER_EYEBROW = "Registration";

export const REGISTER_HEADLINE_LINES = ["Register", "your interest"] as const;

export const REGISTER_INTRO =
  "Join the Nidham network of artists, influencers and event partners. Share your details and our team will personally review your registration — welcoming you to upcoming experiences, castings and collaborations.";

export const REGISTER_HIGHLIGHTS: readonly Highlight[] = [
  { id: "premium", title: "Premium Event Experiences" },
  { id: "entertainment", title: "Entertainment Excellence" },
  { id: "partnerships", title: "Creative Partnerships" },
  { id: "experts", title: "Industry Experts" },
];

/* ------------------------------------------------------------------ Form --- */

export const REGISTER_TYPES: readonly SelectOption[] = [
  { value: "influencer-model", label: "Influencer / Model" },
  { value: "event-contestant", label: "Event Contestant" },
];

/** Default selected pathway. */
export const DEFAULT_REGISTER_TYPE = REGISTER_TYPES[0].value;

const GENDER_OPTIONS: readonly SelectOption[] = [
  { value: "", label: "Select" },
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "other", label: "Prefer not to say" },
];

/**
 * Registration fields (excludes the pathway selector + consent, handled as
 * bespoke controls). `required` mirrors a standard casting/registration intake.
 */
export const REGISTER_FIELDS: readonly RegisterField[] = [
  { id: "fullName", label: "Full Name", type: "text", required: true, autoComplete: "name" },
  { id: "email", label: "Email", type: "email", required: true, autoComplete: "email", inputMode: "email" },
  { id: "phone", label: "Phone Number", type: "tel", required: true, autoComplete: "tel", inputMode: "tel" },
  { id: "dob", label: "Date of Birth", type: "date", required: true, autoComplete: "bday" },
  { id: "gender", label: "Gender", type: "select", required: false, options: GENDER_OPTIONS },
  { id: "city", label: "City / Emirate", type: "text", required: true, autoComplete: "address-level2" },
  { id: "nationality", label: "Nationality", type: "text", required: false },
  { id: "social", label: "Instagram / Social Handle", type: "text", required: false },
  {
    id: "about",
    label: "Tell us about yourself",
    type: "textarea",
    required: false,
    full: true,
  },
];

export const REGISTER_CONSENT_LABEL =
  "I agree to the Terms of Service and Privacy Policy, and consent to Nidham contacting me about relevant opportunities.";

export const REGISTER_SUBMIT_LABEL = "Register Now";

/* -------------------------------------------------------- Why register --- */

export const WHY_TITLE = "Why register";

export const REGISTER_BENEFITS: readonly RegisterBenefit[] = [
  {
    id: "early-access",
    index: "01",
    title: "Early Access",
    description:
      "Be first to hear about castings, productions and events before they're announced publicly.",
  },
  {
    id: "priority-invitations",
    index: "02",
    title: "Priority Invitations",
    description:
      "Registered members receive priority invitations to premieres, launches and signature nights.",
  },
  {
    id: "networking",
    index: "03",
    title: "Networking Opportunities",
    description:
      "Connect with brands, artists and industry professionals across the Nidham network.",
  },
  {
    id: "exclusive",
    index: "04",
    title: "Exclusive Experiences",
    description:
      "Unlock experiences, collaborations and backstage moments reserved for our community.",
  },
];

/* ------------------------------------------------------------- Process --- */

export const PROCESS_TITLE = "How it works";

export const PROCESS_STEPS: readonly ProcessStep[] = [
  {
    id: "submit",
    index: "01",
    title: "Submit Registration",
    description: "Complete the form and share a little about yourself.",
  },
  {
    id: "review",
    index: "02",
    title: "Application Review",
    description: "Our team personally reviews every registration.",
  },
  {
    id: "confirmation",
    index: "03",
    title: "Confirmation",
    description: "We confirm your details and next steps by email or phone.",
  },
  {
    id: "welcome",
    index: "04",
    title: "Welcome To Nidham",
    description: "You're in — and first in line for what comes next.",
  },
];

/* ----------------------------------------------------------------- FAQ --- */

export const FAQ_TITLE = "Frequently asked";

export const FAQ_ITEMS: readonly FaqItem[] = [
  {
    id: "who",
    question: "Who can register?",
    answer:
      "Registration is open to artists, models, influencers, performers and event participants who'd like to collaborate with Nidham or take part in our productions.",
  },
  {
    id: "fee",
    question: "Is there a fee to register?",
    answer:
      "No. Registering your interest is completely free. We'll only ever contact you about relevant opportunities.",
  },
  {
    id: "after",
    question: "What happens after I submit?",
    answer:
      "Our team reviews every registration personally. If there's a fit, we'll reach out with next steps and upcoming opportunities.",
  },
  {
    id: "how-long",
    question: "How long does review take?",
    answer:
      "Most registrations are reviewed within a few working days. You'll hear from us by email or phone.",
  },
  {
    id: "update",
    question: "Can I update my details later?",
    answer:
      "Absolutely. Just reply to our confirmation email or contact us and we'll keep your profile current.",
  },
];

/* ------------------------------------------------------------------ CTA --- */

export const CTA_HEADLINE_LINES = ["Ready to join", "the experience?"] as const;
export const CTA_BUTTON_LABEL = "Complete Registration";

/** In-page anchor for CTAs that glide back to the form. */
export const FORM_TARGET_ID = "register-form";

/**
 * Types for the /register page. The form is field-driven from constants.ts so
 * the exact field set / required flags live in one place and are easy to align
 * with the production registration schema without touching the UI.
 */

export type RegisterFieldType =
  | "text"
  | "email"
  | "tel"
  | "date"
  | "select"
  | "textarea";

export interface SelectOption {
  value: string;
  label: string;
}

/** A single registration field descriptor. */
export interface RegisterField {
  id: string;
  label: string;
  type: RegisterFieldType;
  required: boolean;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel";
  /** Options for `type: "select"`. */
  options?: readonly SelectOption[];
  /** Span both columns on desktop. */
  full?: boolean;
}

/** A left-column highlight in the editorial split. */
export interface Highlight {
  id: string;
  title: string;
}

/** A "Why register" benefit. */
export interface RegisterBenefit {
  id: string;
  index: string;
  title: string;
  description: string;
}

/** A step in the registration journey timeline. */
export interface ProcessStep {
  id: string;
  index: string;
  title: string;
  description: string;
}

/** An FAQ entry. */
export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

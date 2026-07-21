/**
 * Types for the /contact page. Business details (phone, email, location, hours)
 * are the site's real contact information, kept verbatim in constants.ts — never
 * invented or altered here.
 */

/** A single contact detail block (Phone, Email, Office, Hours). */
export interface ContactDetail {
  id: string;
  /** Large title, e.g. "Phone". */
  title: string;
  /** Primary value line(s) — the actual detail, verbatim. */
  lines: readonly string[];
  /** Small supporting description. */
  description: string;
  /** Optional link (tel: / mailto:) applied to the value. */
  href?: string;
}

/** A "Why contact us" reason, shown as editorial content. */
export interface ContactReason {
  id: string;
  index: string;
  title: string;
  description: string;
}

/** An option in the "Service interested in" select. */
export interface ServiceOption {
  value: string;
  label: string;
}

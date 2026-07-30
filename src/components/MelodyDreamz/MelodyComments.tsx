"use client";

import { useRef, useState, type FormEvent } from "react";
import Magnetic from "@/src/components/CustomCursor/Magnetic";
import SectionDivider from "@/src/components/ui/SectionDivider";
import { REVEAL } from "@/src/hooks/useEditorialReveal";
import { CONTACT_EMAIL } from "@/src/components/ContactPage/constants";

/** Shared field skin. Premium surface, brand-pink focus glow, 300ms. */
const FIELD =
  "w-full rounded-2xl border border-white/[0.10] bg-white/[0.04] px-5 text-[15px] text-white outline-none transition-[border-color,box-shadow,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] placeholder:text-neutral-500 hover:border-white/20 focus:border-[#E00068] focus:bg-white/[0.06] focus:shadow-[0_0_0_4px_rgba(224,0,104,0.18)]";

const LABEL =
  "block font-[family-name:var(--font-urbanist)] text-[12px] font-medium uppercase tracking-[0.18em] text-neutral-400";

type Status = "idle" | "loading" | "error";

interface Errors {
  name?: string;
  email?: string;
  comment?: string;
}

/**
 * "Leave a Comment" — the case study's comment form, in the site's design
 * system.
 *
 * **On submission, read this before wiring anything.** There is no comments
 * endpoint, no datastore and no moderation anywhere in this project, so this
 * form deliberately does **not** show a success state. It validates, shows a
 * loading state, then surfaces an honest error pointing at the real mailto —
 * because the alternative is what the audit flagged as a ship blocker on the
 * Contact and Register forms: a fake 1.5s delay followed by "message received"
 * while the data is discarded. A form that admits it is not connected is worth
 * more than one that lies.
 *
 * To connect it: replace `postComment` with a real POST and add a `"success"`
 * branch. Everything else — validation, field state, loading, a11y wiring — is
 * already in place.
 *
 * The textarea auto-grows by writing its own `scrollHeight` back to `style.height`
 * on input, which is the only way to do it without a hidden mirror element; the
 * reset to `auto` first is required or it can only ever grow.
 */
export default function MelodyComments() {
  const [values, setValues] = useState({ name: "", email: "", comment: "" });
  const [save, setSave] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const areaRef = useRef<HTMLTextAreaElement>(null);

  const set = (key: keyof typeof values) => (value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = (): Errors => {
    const found: Errors = {};
    if (!values.name.trim()) found.name = "Please enter your name.";
    if (!values.email.trim()) found.email = "Please enter your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
      found.email = "Please enter a valid email address.";
    if (!values.comment.trim()) found.comment = "Please write a comment.";
    return found;
  };

  /**
   * The submission seam. Intentionally unimplemented — see the docblock. Swap
   * the body for a real request and add a success branch in `handleSubmit`.
   */
  const postComment = async (): Promise<never> => {
    await new Promise((r) => setTimeout(r, 600));
    throw new Error("not-connected");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.values(found).some(Boolean)) return;

    setStatus("loading");
    try {
      await postComment();
    } catch {
      setStatus("error");
    }
  };

  const autoGrow = () => {
    const el = areaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  return (
    <section
      aria-labelledby="md-comments-heading"
      className="w-full bg-[#181818] py-20 sm:py-24 lg:py-28"
    >
      <div className="container-page">
        <SectionDivider label="Leave a Comment" />
        <h2 id="md-comments-heading" className="sr-only">
          Leave a Comment
        </h2>

        <div
          className={`${REVEAL.up} mx-auto mt-12 max-w-3xl rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-md sm:mt-14 sm:p-9 lg:mt-16 lg:p-11`}
        >
          <form onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7">
              <div className={REVEAL.up}>
                <label htmlFor="md-name" className={LABEL}>
                  Name
                </label>
                <input
                  id="md-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your name"
                  value={values.name}
                  onChange={(e) => set("name")(e.target.value)}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "md-name-error" : undefined}
                  className={`${FIELD} mt-3 h-[58px]`}
                />
                {errors.name && (
                  <p id="md-name-error" role="alert" className="mt-2 text-[13px] text-red-400">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className={REVEAL.up}>
                <label htmlFor="md-email" className={LABEL}>
                  Email
                </label>
                <input
                  id="md-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={values.email}
                  onChange={(e) => set("email")(e.target.value)}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "md-email-error" : undefined}
                  className={`${FIELD} mt-3 h-[58px]`}
                />
                {errors.email && (
                  <p id="md-email-error" role="alert" className="mt-2 text-[13px] text-red-400">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            <div className={`${REVEAL.up} mt-6 sm:mt-7`}>
              <label htmlFor="md-comment" className={LABEL}>
                Comment
              </label>
              <textarea
                id="md-comment"
                name="comment"
                ref={areaRef}
                rows={6}
                placeholder="Share your thoughts on the event…"
                value={values.comment}
                onChange={(e) => {
                  set("comment")(e.target.value);
                  autoGrow();
                }}
                aria-invalid={Boolean(errors.comment)}
                aria-describedby={errors.comment ? "md-comment-error" : undefined}
                className={`${FIELD} mt-3 min-h-[200px] resize-none py-4 leading-[1.7]`}
              />
              {errors.comment && (
                <p id="md-comment-error" role="alert" className="mt-2 text-[13px] text-red-400">
                  {errors.comment}
                </p>
              )}
            </div>

            {/* Custom checkbox. A real <button role="checkbox"> rather than a
                styled native input, and — unlike the register form's — it carries
                its own accessible name, since a wrapping <label> does not name a
                button to assistive tech. */}
            <div className={`${REVEAL.up} mt-7 flex items-start gap-3`}>
              <button
                type="button"
                role="checkbox"
                aria-checked={save}
                aria-labelledby="md-save-label"
                onClick={() => setSave((s) => !s)}
                className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-[background-color,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF3D8F] ${
                  save
                    ? "border-[#E00068] bg-[#E00068] text-white"
                    : "border-white/25 bg-transparent hover:border-white/45"
                }`}
              >
                {/* The tick draws itself in: a dash-offset wipe rather than a
                    pop, so the state change reads as deliberate. */}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="h-3 w-3"
                >
                  <path
                    d="m5 13 4 4L19 7"
                    pathLength={1}
                    strokeDasharray={1}
                    strokeDashoffset={save ? 0 : 1}
                    className="transition-[stroke-dashoffset] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
                  />
                </svg>
              </button>
              <span
                id="md-save-label"
                className="font-[family-name:var(--font-urbanist)] text-[14px] leading-relaxed text-neutral-400"
              >
                Save my details for next time.
              </span>
            </div>

            {status === "error" && (
              <p
                role="alert"
                className={`mt-7 rounded-2xl border border-[#E00068]/30 bg-[#E00068]/[0.07] px-5 py-4 font-[family-name:var(--font-urbanist)] text-[14px] leading-relaxed text-neutral-300`}
              >
                Comments aren’t connected yet, so this wasn’t sent. Please email{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-[#FF3D8F] underline decoration-[#E00068]/50 underline-offset-4 transition-colors hover:text-white"
                >
                  {CONTACT_EMAIL}
                </a>{" "}
                and we’ll come back to you.
              </p>
            )}

            <div className={`${REVEAL.up} mt-9 flex sm:justify-end`}>
              <Magnetic className="block w-full sm:inline-block sm:w-auto">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="group inline-flex w-full items-center justify-center gap-3 rounded-full border border-[#E00068] bg-[linear-gradient(135deg,#E00068_0%,#8C003B_100%)] px-9 py-4 text-[13px] font-semibold uppercase tracking-[0.14em] text-white outline-none transition-[box-shadow,translate,opacity] duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:shadow-[0_22px_50px_-16px_rgba(224,0,104,0.75)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF3D8F] disabled:cursor-not-allowed disabled:opacity-80 motion-safe:enabled:hover:-translate-y-0.5 sm:w-auto"
                >
                  {status === "loading" ? "Submitting" : "Submit Comment"}
                  {status === "loading" ? (
                    <span
                      aria-hidden="true"
                      className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                    />
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      className="h-3.5 w-3.5 transition-transform duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:translate-x-1"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  )}
                </button>
              </Magnetic>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

"use client";

import {
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type MouseEvent,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Magnetic from "@/src/components/CustomCursor/Magnetic";
import { useGsapReveal } from "@/src/hooks/useGsapReveal";
import { BUTTON_SKIN } from "@/src/lib/button";
import { EASE } from "@/src/lib/motion";
import { SERVICE_OPTIONS, CONTACT_EMAIL, FORM_TARGET_ID } from "./constants";

/* ------------------------------------------------------------- Field ------ */

type FieldKind = "input" | "textarea" | "select";

interface FieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  kind?: FieldKind;
  type?: string;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel";
  optional?: boolean;
  error?: string;
  rows?: number;
}

/**
 * A single premium field: a rounded control with a smoothly-floating label,
 * an elegant border transition and a soft magenta glow on focus. Controlled, so
 * the float state is derived (no `:placeholder-shown` gymnastics) and works
 * uniformly for text, textarea and select.
 */
function Field({
  id,
  label,
  value,
  onChange,
  onBlur,
  kind = "input",
  type = "text",
  autoComplete,
  inputMode,
  optional = false,
  error,
  rows = 5,
}: FieldProps) {
  const [focused, setFocused] = useState(false);
  // Select always shows a value/placeholder, so its label stays floated.
  const floated = kind === "select" || focused || value.length > 0;

  const controlBase =
    "peer w-full rounded-2xl border bg-white/[0.03] px-5 text-[16px] text-neutral-100 outline-none transition-[border-color,box-shadow,background-color] duration-300 ease-out";
  const controlState = error
    ? "border-red-400/70 focus:border-red-400 focus:shadow-[0_0_0_4px_rgba(248,113,113,0.16)]"
    : "border-white/12 focus:border-[#6E1B45] focus:bg-white/[0.05] focus:shadow-[0_0_0_4px_rgba(110,27,69,0.20)]";

  const handleFocus = () => setFocused(true);
  const handleBlur = () => {
    setFocused(false);
    onBlur?.();
  };

  return (
    <div className="relative">
      {kind === "textarea" ? (
        <textarea
          id={id}
          name={id}
          rows={rows}
          value={value}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${controlBase} ${controlState} resize-none pb-4 pt-8`}
        />
      ) : kind === "select" ? (
        <select
          id={id}
          name={id}
          value={value}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${controlBase} ${controlState} h-[64px] appearance-none pb-3 pt-7 ${
            value ? "text-neutral-100" : "text-neutral-500"
          }`}
        >
          {SERVICE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#1F1F1F] text-neutral-100">
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          autoComplete={autoComplete}
          inputMode={inputMode}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${controlBase} ${controlState} h-[64px] pb-3 pt-7`}
        />
      )}

      {/* Floating label. */}
      <label
        htmlFor={id}
        className={`pointer-events-none absolute left-5 origin-left transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          floated
            ? "top-2.5 text-[12px] tracking-[0.04em] " +
              (error ? "text-red-300" : "text-[#A6386B]")
            : kind === "textarea"
              ? "top-8 text-[16px] text-neutral-500"
              : "top-1/2 -translate-y-1/2 text-[16px] text-neutral-500"
        }`}
      >
        {label}
        {optional && <span className="ml-1.5 text-neutral-600">(optional)</span>}
      </label>

      {/* Custom chevron for the select. */}
      {kind === "select" && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-neutral-500"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4">
            <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}

      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-error`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="mt-2 pl-1 text-[13px] text-red-300"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* -------------------------------------------------------------- Form ------ */

interface FormState {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
}

type Errors = Partial<Record<keyof FormState, string>>;

const EMPTY: FormState = {
  name: "",
  email: "",
  phone: "",
  company: "",
  service: "",
  message: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(state: FormState): Errors {
  const errors: Errors = {};
  if (!state.name.trim()) errors.name = "Please enter your name.";
  if (!state.email.trim()) errors.email = "Please enter your email.";
  else if (!EMAIL_RE.test(state.email.trim()))
    errors.email = "Please enter a valid email address.";
  if (!state.phone.trim()) errors.phone = "Please enter a phone number.";
  if (!state.service) errors.service = "Please choose a service.";
  if (!state.message.trim()) errors.message = "Tell us a little about your project.";
  return errors;
}

/**
 * The contact form — a premium, controlled form with floating labels, focus
 * glow, smooth inline validation, and a loading state on submit that resolves
 * to an animated success panel. The submit control reuses the site's brand
 * button skin (magnetic + ripple + arrow). No backend: submission is simulated,
 * with the shape ready to wire to a real endpoint.
 */
export default function ContactForm() {
  const reduce = useReducedMotion() ?? false;
  const scopeRef = useRef<HTMLElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  useGsapReveal(scopeRef);

  const [state, setState] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const setField = (key: keyof FormState) => (value: string) => {
    setState((s) => ({ ...s, [key]: value }));
    // Clear a field's error as soon as the user edits it.
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
  };

  const revalidate = () => {
    if (touched) setErrors(validate(state));
  };

  const spawnRipple = (event: MouseEvent<HTMLButtonElement>) => {
    const el = submitRef.current;
    if (!el || reduce) return;
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement("span");
    ripple.className = "pointer-events-none absolute rounded-full bg-current/25";
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
    ripple.style.animation = "ripple 0.6s ease-out forwards";
    ripple.addEventListener("animationend", () => ripple.remove());
    el.appendChild(ripple);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched(true);
    const found = validate(state);
    setErrors(found);
    if (Object.values(found).some(Boolean)) return;

    setStatus("loading");
    // Simulated submission — swap for a real POST when the endpoint exists.
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setStatus("success");
  };

  const reset = () => {
    setState(EMPTY);
    setErrors({});
    setTouched(false);
    setStatus("idle");
  };

  return (
    <section
      ref={scopeRef}
      id={FORM_TARGET_ID}
      aria-label="Contact form"
      data-particles="services"
      className="relative w-full scroll-mt-24 bg-[#1F1F1F] section-y"
    >
      <div className="container-page">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          {/* Left — heading */}
          <div className="lg:pt-2">
            <p
              data-reveal="up"
              className="text-xs font-medium uppercase tracking-[0.28em] text-neutral-500 sm:text-sm"
            >
              Request a quote
            </p>
            <h2
              data-reveal="up"
              className="mt-6 font-[family-name:var(--font-cabinet)] text-[clamp(1.9rem,4vw,3rem)] font-normal leading-[1.08] tracking-[-0.02em] text-neutral-100"
            >
              Tell us about your project
            </h2>
            <p
              data-reveal="up"
              className="mt-6 max-w-md text-[20px] font-light leading-relaxed text-neutral-400"
            >
              Share a few details and our team will be in touch. Prefer email? Reach
              us directly at{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                data-cursor="link"
                className="group/e relative text-neutral-200 transition-colors duration-300 hover:text-white"
              >
                <span className="relative">
                  {CONTACT_EMAIL}
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-[#A6386B] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/e:scale-x-100"
                  />
                </span>
              </a>
              .
            </p>
          </div>

          {/* Right — form / success */}
          <div data-reveal="up">
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: reduce ? 0 : 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="flex min-h-[24rem] flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.02] px-8 py-16 text-center"
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-full border border-[#6E1B45] bg-[#6E1B45]/20 text-[#E8A9C6]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7">
                      <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <h3 className="mt-8 font-[family-name:var(--font-cabinet)] text-2xl font-normal text-neutral-100">
                    Thank you — message received.
                  </h3>
                  <p className="mt-3 max-w-sm text-[20px] font-light leading-relaxed text-neutral-400">
                    We&rsquo;ve got your brief and will be in touch shortly. We look
                    forward to creating something extraordinary with you.
                  </p>
                  <button
                    type="button"
                    onClick={reset}
                    data-cursor="button"
                    className="group mt-8 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.16em] text-neutral-300 transition-colors duration-300 hover:text-white"
                  >
                    Send another
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-300 motion-safe:group-hover:translate-x-1"
                    >
                      &rarr;
                    </span>
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  noValidate
                  onSubmit={handleSubmit}
                  initial={false}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-6"
                >
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <Field
                      id="name"
                      label="Name"
                      value={state.name}
                      onChange={setField("name")}
                      onBlur={revalidate}
                      autoComplete="name"
                      error={errors.name}
                    />
                    <Field
                      id="email"
                      label="Email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={state.email}
                      onChange={setField("email")}
                      onBlur={revalidate}
                      error={errors.email}
                    />
                    <Field
                      id="phone"
                      label="Phone Number"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={state.phone}
                      onChange={setField("phone")}
                      onBlur={revalidate}
                      error={errors.phone}
                    />
                    <Field
                      id="company"
                      label="Company"
                      autoComplete="organization"
                      optional
                      value={state.company}
                      onChange={setField("company")}
                    />
                  </div>

                  <Field
                    id="service"
                    label="Service interested in"
                    kind="select"
                    value={state.service}
                    onChange={setField("service")}
                    onBlur={revalidate}
                    error={errors.service}
                  />

                  <Field
                    id="message"
                    label="Message"
                    kind="textarea"
                    value={state.message}
                    onChange={setField("message")}
                    onBlur={revalidate}
                    error={errors.message}
                  />

                  <div className="mt-2">
                    <Magnetic className="inline-block">
                      <button
                        ref={submitRef}
                        type="submit"
                        onClick={spawnRipple}
                        disabled={status === "loading"}
                        data-cursor="button"
                        className={`group relative inline-flex items-center gap-3 overflow-hidden rounded-[16px] px-9 py-4 text-[14px] font-semibold uppercase tracking-[0.14em] outline-none disabled:cursor-not-allowed disabled:opacity-90 motion-safe:enabled:hover:-translate-y-[2px] motion-safe:enabled:hover:scale-[1.02] grain-overlay ${BUTTON_SKIN}`}
                      >
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.28)_50%,transparent_70%)] transition-transform duration-[900ms] ease-out group-hover:translate-x-full motion-reduce:hidden"
                        />
                        <span className="relative">
                          {status === "loading" ? "Sending" : "Send message"}
                        </span>
                        {status === "loading" ? (
                          <span
                            aria-hidden="true"
                            className="relative h-4 w-4 animate-spin rounded-full border-2 border-current/40 border-t-current"
                          />
                        ) : (
                          <span
                            aria-hidden="true"
                            className="relative transition-transform duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:translate-x-[5px]"
                          >
                            &rarr;
                          </span>
                        )}
                      </button>
                    </Magnetic>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

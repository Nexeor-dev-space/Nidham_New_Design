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
import { EASE } from "@/src/lib/motion";
import {
  DEFAULT_REGISTER_TYPE,
  FORM_TARGET_ID,
  REGISTER_CONSENT_LABEL,
  REGISTER_FIELDS,
  REGISTER_SUBMIT_LABEL,
  REGISTER_TYPES,
} from "./constants";
import type { RegisterField } from "./types";

/* ------------------------------------------------------------- Field ------ */

interface FieldProps {
  field: RegisterField;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
}

/**
 * A premium field: rounded control, smoothly-floating label, animated border and
 * a soft magenta glow on focus. Controlled, so the float state is derived and
 * works uniformly across text, date, select and textarea.
 */
function Field({ field, value, onChange, onBlur, error }: FieldProps) {
  const [focused, setFocused] = useState(false);
  // Date & select always present intrinsic UI, so keep their label floated.
  const floated =
    field.type === "select" ||
    field.type === "date" ||
    focused ||
    value.length > 0;

  const base =
    "peer w-full rounded-2xl border bg-white/[0.03] px-5 text-[16px] text-neutral-100 outline-none transition-[border-color,box-shadow,background-color] duration-300 ease-out";
  const state = error
    ? "border-red-400/70 focus:border-red-400 focus:shadow-[0_0_0_4px_rgba(248,113,113,0.16)]"
    : "border-white/12 focus:border-[#6E1B45] focus:bg-white/[0.05] focus:shadow-[0_0_0_4px_rgba(110,27,69,0.20)]";

  const handleFocus = () => setFocused(true);
  const handleBlur = () => {
    setFocused(false);
    onBlur();
  };

  const described = error ? `${field.id}-error` : undefined;

  return (
    <div className={field.full ? "sm:col-span-2" : undefined}>
      <div className="relative">
        {field.type === "textarea" ? (
          <textarea
            id={field.id}
            name={field.id}
            rows={5}
            value={value}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            aria-invalid={error ? true : undefined}
            aria-describedby={described}
            className={`${base} ${state} resize-none pb-4 pt-8`}
          />
        ) : field.type === "select" ? (
          <select
            id={field.id}
            name={field.id}
            value={value}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            aria-invalid={error ? true : undefined}
            aria-describedby={described}
            className={`${base} ${state} h-[64px] appearance-none pb-3 pt-7 ${
              value ? "text-neutral-100" : "text-neutral-500"
            }`}
          >
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#1F1F1F] text-neutral-100">
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={field.id}
            name={field.id}
            type={field.type}
            value={value}
            autoComplete={field.autoComplete}
            inputMode={field.inputMode}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            aria-invalid={error ? true : undefined}
            aria-describedby={described}
            className={`${base} ${state} h-[64px] pb-3 pt-7 ${
              field.type === "date" && !value ? "text-neutral-500" : ""
            } [color-scheme:dark]`}
          />
        )}

        <label
          htmlFor={field.id}
          className={`pointer-events-none absolute left-5 origin-left transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            floated
              ? "top-2.5 text-[12px] tracking-[0.04em] " +
                (error ? "text-red-300" : "text-[#A6386B]")
              : field.type === "textarea"
                ? "top-8 text-[16px] text-neutral-500"
                : "top-1/2 -translate-y-1/2 text-[16px] text-neutral-500"
          }`}
        >
          {field.label}
          {!field.required && (
            <span className="ml-1.5 text-neutral-600">(optional)</span>
          )}
        </label>

        {field.type === "select" && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-neutral-500"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4">
              <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        )}
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            id={`${field.id}-error`}
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

type Values = Record<string, string>;
type Errors = Record<string, string | undefined>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialValues = (): Values =>
  REGISTER_FIELDS.reduce<Values>((acc, f) => {
    acc[f.id] = "";
    return acc;
  }, {});

/**
 * The registration form — field-driven from constants, with a segmented pathway
 * selector (Influencer / Model · Event Contestant), floating-label fields, a
 * consent gate, smooth inline validation, and a loading state on submit that
 * resolves to an animated confirmation (the "Application Review" step of the
 * journey). No backend: submission is simulated, ready to wire to a real intake.
 */
export default function RegisterForm() {
  const reduce = useReducedMotion() ?? false;
  const submitRef = useRef<HTMLButtonElement>(null);

  const [type, setType] = useState<string>(DEFAULT_REGISTER_TYPE);
  const [values, setValues] = useState<Values>(initialValues);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const setField = (id: string) => (value: string) => {
    setValues((v) => ({ ...v, [id]: value }));
    setErrors((e) => (e[id] ? { ...e, [id]: undefined } : e));
  };

  const runValidation = (): Errors => {
    const found: Errors = {};
    for (const f of REGISTER_FIELDS) {
      if (f.required && !values[f.id]?.trim()) {
        found[f.id] = `${f.label} is required.`;
      }
    }
    if (values.email && !EMAIL_RE.test(values.email.trim())) {
      found.email = "Please enter a valid email address.";
    }
    if (!consent) found.consent = "Please accept the terms to continue.";
    return found;
  };

  const revalidate = () => {
    if (touched) setErrors(runValidation());
  };

  const spawnRipple = (event: MouseEvent<HTMLButtonElement>) => {
    const el = submitRef.current;
    if (!el || reduce) return;
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement("span");
    ripple.className = "pointer-events-none absolute rounded-full bg-white/30";
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
    const found = runValidation();
    setErrors(found);
    if (Object.values(found).some(Boolean)) return;

    setStatus("loading");
    // Simulated submission — swap for a real POST when the endpoint exists.
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setStatus("success");
  };

  const reset = () => {
    setValues(initialValues());
    setConsent(false);
    setErrors({});
    setTouched(false);
    setType(DEFAULT_REGISTER_TYPE);
    setStatus("idle");
  };

  return (
    <div
      id={FORM_TARGET_ID}
      className="scroll-mt-28 rounded-[28px] border border-white/10 bg-white/[0.02] p-6 shadow-[0_40px_100px_-50px_rgba(0,0,0,0.9)] backdrop-blur-[2px] sm:p-8 lg:p-10"
    >
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: reduce ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="flex min-h-[26rem] flex-col items-center justify-center text-center"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-[#6E1B45] bg-[#6E1B45]/20 text-[#E8A9C6]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7">
                <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <h3 className="mt-8 font-[family-name:var(--font-cabinet)] text-2xl font-normal text-neutral-100">
              Registration received.
            </h3>
            <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-neutral-400">
              Thank you for registering with Nidham. Our team will review your
              details and be in touch soon with your confirmation and next steps.
            </p>
            <button
              type="button"
              onClick={reset}
              data-cursor="button"
              className="group mt-8 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.16em] text-neutral-300 transition-colors duration-300 hover:text-white"
            >
              Register another
              <span aria-hidden="true" className="transition-transform duration-300 motion-safe:group-hover:translate-x-1">
                &rarr;
              </span>
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            noValidate
            onSubmit={handleSubmit}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-6"
          >
            {/* Pathway selector — segmented control. */}
            <fieldset>
              <legend className="mb-3 text-[12px] font-medium uppercase tracking-[0.16em] text-neutral-500">
                I&rsquo;m registering as
              </legend>
              <div className="grid grid-cols-2 gap-2 rounded-full border border-white/10 bg-white/[0.02] p-1.5">
                {REGISTER_TYPES.map((opt) => {
                  const active = type === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setType(opt.value)}
                      data-cursor="button"
                      aria-pressed={active}
                      className={`relative rounded-full px-4 py-3 text-[14px] font-medium transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6E1B45] ${
                        active ? "text-white" : "text-neutral-400 hover:text-neutral-200"
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="register-type-pill"
                          transition={{ duration: 0.4, ease: EASE }}
                          className="absolute inset-0 rounded-full bg-[#5D0139]"
                        />
                      )}
                      <span className="relative">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {REGISTER_FIELDS.map((field) => (
                <Field
                  key={field.id}
                  field={field}
                  value={values[field.id] ?? ""}
                  onChange={setField(field.id)}
                  onBlur={revalidate}
                  error={errors[field.id]}
                />
              ))}
            </div>

            {/* Consent. */}
            <div>
              <label className="flex cursor-pointer items-start gap-3 text-[14px] leading-relaxed text-neutral-400">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={consent}
                  data-cursor="button"
                  onClick={() => {
                    setConsent((c) => !c);
                    setErrors((e) => ({ ...e, consent: undefined }));
                  }}
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6E1B45] ${
                    consent
                      ? "border-[#6E1B45] bg-[#5D0139] text-white"
                      : errors.consent
                        ? "border-red-400/70 bg-transparent"
                        : "border-white/20 bg-transparent hover:border-white/40"
                  }`}
                >
                  {consent && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="h-3 w-3">
                      <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
                <span>{REGISTER_CONSENT_LABEL}</span>
              </label>
              <AnimatePresence>
                {errors.consent && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    className="mt-2 pl-8 text-[13px] text-red-300"
                  >
                    {errors.consent}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Submit — brand button (magnetic + ripple + arrow). */}
            <div className="mt-2">
              <Magnetic className="block sm:inline-block">
                <button
                  ref={submitRef}
                  type="submit"
                  onClick={spawnRipple}
                  disabled={status === "loading"}
                  data-cursor="button"
                  className="group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-full border border-[#5D0139] bg-[#5D0139] px-9 py-4 text-[14px] font-semibold uppercase tracking-[0.14em] text-white shadow-[0_8px_20px_-10px_rgba(93,1,57,0.5)] outline-none transition-[translate,scale,box-shadow,background-color] duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#6E1B45] hover:shadow-[0_20px_44px_-12px_rgba(110,27,69,0.7)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6E1B45] disabled:cursor-not-allowed disabled:opacity-90 motion-safe:enabled:hover:-translate-y-[2px] motion-safe:enabled:hover:scale-[1.02] grain-overlay sm:w-auto"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.28)_50%,transparent_70%)] transition-transform duration-[900ms] ease-out group-hover:translate-x-full motion-reduce:hidden"
                  />
                  <span className="relative">
                    {status === "loading" ? "Submitting" : REGISTER_SUBMIT_LABEL}
                  </span>
                  {status === "loading" ? (
                    <span
                      aria-hidden="true"
                      className="relative h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
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
  );
}

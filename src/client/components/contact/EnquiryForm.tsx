import { useState, type FormEvent, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { useServices } from "@/client/hooks/useServices";
import { useSubmitContact } from "@/client/hooks/useSubmitContact";
import { toErrorMessage } from "@/client/services/ApiError";
import type { ContactBudgetRange, SubmitContactPayload } from "@/client/types";
import { pad } from "@/client/utils/text";
import { isWithinWindow } from "@/client/utils/promo";
import { PROMO } from "@/client/data/site";
import { ChristmasOfferNotice } from "@/client/components/promo/ChristmasOffer";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { EASE } from "@/client/components/motion/presets";

/** Steps slide in from the side you're heading to (1 = forward, -1 = back). */
const stepVariants: Variants = {
  enter: (direction: number) => ({ opacity: 0, x: direction * 36 }),
  center: { opacity: 1, x: 0 },
  exit: (direction: number) => ({ opacity: 0, x: direction * -36 }),
};

const STEPS = ["Your need", "The project", "Your details"] as const;

/** Values are the API's `ContactBudgetRange` enum. */
const BUDGETS: readonly { value: ContactBudgetRange; label: string }[] = [
  { value: "under_one_k", label: "Under $1,000" },
  { value: "one_to_five_k", label: "$1,000 – $5,000" },
  { value: "five_to_fifteen_k", label: "$5,000 – $15,000" },
  { value: "over_fifteen_k", label: "$15,000+" },
  { value: "not_sure", label: "Not sure yet" },
];

/** Sent as no `serviceId`. */
const SOMETHING_ELSE = "other";

interface Values {
  service: string;
  budget: ContactBudgetRange | "";
  message: string;
  name: string;
  email: string;
  phone: string;
  company: string;
}

const EMPTY: Values = {
  service: "",
  budget: "",
  message: "",
  name: "",
  email: "",
  phone: "",
  company: "",
};

type Errors = Partial<Record<keyof Values, string>>;

/** Per step; the message, name and email wording mirrors the API's `ContactService.Validate`. */
function validateStep(step: number, values: Values): Errors {
  const errors: Errors = {};
  if (step === 0 && !values.service) errors.service = "Choose one to continue.";
  if (step === 1 && !values.message.trim())
    errors.message = "Message is required.";
  if (step === 2) {
    if (!values.name.trim()) errors.name = "Name is required.";
    if (!values.email.trim().includes("@"))
      errors.email = "A valid email is required.";
  }
  return errors;
}

const blank = (value: string) => value.trim() || undefined;

const INPUT =
  "mt-2 w-full rounded-xl border bg-white px-4 py-3.5 text-[16px] text-ink placeholder:text-text-muted focus:border-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-blue/30";

function OptionCard({
  name,
  value,
  checked,
  onChange,
  children,
}: {
  readonly name: string;
  readonly value: string;
  readonly checked: boolean;
  readonly onChange: (value: string) => void;
  readonly children: ReactNode;
}) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-3 rounded-xl border px-5 py-4 text-[15.5px] font-semibold transition-colors has-focus-visible:ring-2 has-focus-visible:ring-blue ${
        checked
          ? "border-ink bg-ink text-white"
          : "border-rule bg-white text-ink hover:border-ink"
      }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="sr-only"
      />
      <span
        aria-hidden="true"
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${checked ? "border-white" : "border-ink/30"}`}
      >
        {checked && <span className="h-2 w-2 rounded-full bg-white" />}
      </span>
      {children}
    </label>
  );
}

function FieldError({
  id,
  message,
}: {
  readonly id: string;
  readonly message?: string;
}) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 text-[14px] font-medium text-danger-500">
      {message}
    </p>
  );
}

export default function EnquiryForm() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [honeypot, setHoneypot] = useState("");
  const [sent, setSent] = useState(false);
  const submit = useSubmitContact();
  const { data: servicesResult } = useServices({ pageSize: 20 });
  const services = servicesResult?.items ?? [];

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const next = () => {
    const stepErrors = validateStep(step, values);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length > 0) return;
    setDirection(1);
    setStep((s) => s + 1);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (step < STEPS.length - 1) {
      next();
      return;
    }
    const stepErrors = validateStep(step, values);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length > 0) return;

    const payload: SubmitContactPayload = {
      name: values.name.trim(),
      email: values.email.trim(),
      phone: blank(values.phone),
      company: blank(values.company),
      message: values.message.trim(),
      serviceName:
        values.service === SOMETHING_ELSE
          ? "Something else"
          : services.find((service) => service.id === values.service)?.name,
      budgetRange: values.budget || undefined,
      subject: isWithinWindow(PROMO) ? PROMO.enquirySubject : undefined,
      website: honeypot || undefined,
    };

    submit.mutate(payload, {
      onSuccess: () => {
        setSent(true);
        setValues(EMPTY);
        setDirection(1);
        setStep(0);
      },
    });
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="rounded-[28px] bg-ink p-10 text-white sm:p-14"
      >
        <motion.span
          className="inline-block"
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 14,
            delay: 0.2,
          }}
        >
          <CheckCircle2
            size={44}
            aria-hidden="true"
            className="text-blue-soft"
          />
        </motion.span>
        <h2 className="mt-8 font-display text-[36px] leading-[1.05] tracking-[-0.04em] sm:text-[44px]">
          Thanks — we&rsquo;ve got it.
        </h2>
        <p className="mt-4 max-w-md text-[16px] leading-7 text-white/70">
          A real person will reply within one working day.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-10 inline-flex h-12 items-center rounded-full border border-white/30 px-6 text-[15px] font-semibold transition-colors hover:border-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Send another enquiry
        </button>
      </motion.div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      aria-labelledby="enquiry-heading"
      className="relative rounded-[28px] border border-rule bg-white p-6 sm:p-10"
    >
      <ChristmasOfferNotice />
      <ol className="grid grid-cols-3 gap-2">
        {STEPS.map((label, index) => (
          <li key={label} aria-current={index === step ? "step" : undefined}>
            <span className="block h-1 overflow-hidden rounded-full bg-rule">
              <motion.span
                className="block h-full origin-left rounded-full bg-blue"
                initial={false}
                animate={{ scaleX: index <= step ? 1 : 0 }}
                transition={{ duration: 0.6, ease: EASE }}
              />
            </span>
            <span
              className={`mt-3 block text-[12.5px] font-bold ${index === step ? "text-ink" : "text-text-muted"}`}
            >
              <span className="mr-1.5 text-blue">{pad(index)}</span>
              <span className="hidden sm:inline">{label}</span>
            </span>
          </li>
        ))}
      </ol>

      <p className="mt-10 text-[13px] font-semibold text-text-muted">
        Step {step + 1} of {STEPS.length}
      </p>

      <AnimatePresence mode="wait" custom={direction} initial={false}>
        <motion.div
          key={step}
          custom={direction}
          variants={stepVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.4, ease: EASE }}
        >
          {step === 0 && (
            <fieldset
              aria-describedby={errors.service ? "service-error" : undefined}
            >
              <legend
                id="enquiry-heading"
                className="mt-2 font-display text-[30px] leading-[1.1] tracking-[-0.035em] text-ink sm:text-[36px]"
              >
                What can we help with?
              </legend>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {services.map((service) => (
                  <OptionCard
                    key={service.id}
                    name="service"
                    value={service.id}
                    checked={values.service === service.id}
                    onChange={(value) => set("service", value)}
                  >
                    {service.name}
                  </OptionCard>
                ))}
                <OptionCard
                  name="service"
                  value={SOMETHING_ELSE}
                  checked={values.service === SOMETHING_ELSE}
                  onChange={(value) => set("service", value)}
                >
                  Something else
                </OptionCard>
              </div>
              <FieldError id="service-error" message={errors.service} />
            </fieldset>
          )}

          {step === 1 && (
            <div>
              <h2
                id="enquiry-heading"
                className="mt-2 font-display text-[30px] leading-[1.1] tracking-[-0.035em] text-ink sm:text-[36px]"
              >
                Tell us about the project.
              </h2>
              <fieldset className="mt-8">
                <legend className="text-[14px] font-bold text-ink">
                  Rough budget{" "}
                  <span className="font-medium text-text-muted">
                    (optional)
                  </span>
                </legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {BUDGETS.map((budget) => (
                    <label
                      key={budget.value}
                      className={`cursor-pointer rounded-full border px-4 py-2.5 text-[14.5px] font-semibold transition-colors has-focus-visible:ring-2 has-focus-visible:ring-blue ${
                        values.budget === budget.value
                          ? "border-ink bg-ink text-white"
                          : "border-rule text-ink hover:border-ink"
                      }`}
                    >
                      <input
                        type="radio"
                        name="budget"
                        value={budget.value}
                        checked={values.budget === budget.value}
                        onChange={() => set("budget", budget.value)}
                        className="sr-only"
                      />
                      {budget.label}
                    </label>
                  ))}
                </div>
              </fieldset>
              <label className="mt-8 block text-[14px] font-bold text-ink">
                What are you building?
                <textarea
                  rows={6}
                  value={values.message}
                  onChange={(e) => set("message", e.target.value)}
                  aria-invalid={!!errors.message}
                  aria-describedby={
                    errors.message ? "message-error" : undefined
                  }
                  placeholder="Who is it for, and what does success look like six months after launch?"
                  className={`${INPUT} resize-y font-normal ${errors.message ? "border-danger-500" : "border-rule"}`}
                />
              </label>
              <FieldError id="message-error" message={errors.message} />
            </div>
          )}

          {step === 2 && (
            <div>
              <h2
                id="enquiry-heading"
                className="mt-2 font-display text-[30px] leading-[1.1] tracking-[-0.035em] text-ink sm:text-[36px]"
              >
                How do we reach you?
              </h2>
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                {(
                  [
                    ["name", "Your name", "text", "name", true],
                    ["email", "Email", "email", "email", true],
                    ["phone", "Phone", "tel", "tel", false],
                    ["company", "Company", "text", "organization", false],
                  ] as const
                ).map(([key, label, type, autoComplete, required]) => (
                  <div key={key}>
                    <label className="block text-[14px] font-bold text-ink">
                      {label}
                      {!required && (
                        <span className="font-medium text-text-muted">
                          {" "}
                          (optional)
                        </span>
                      )}
                      <input
                        type={type}
                        autoComplete={autoComplete}
                        value={values[key]}
                        onChange={(e) => set(key, e.target.value)}
                        aria-invalid={!!errors[key]}
                        aria-describedby={
                          errors[key] ? `${key}-error` : undefined
                        }
                        className={`${INPUT} font-normal ${errors[key] ? "border-danger-500" : "border-rule"}`}
                      />
                    </label>
                    <FieldError id={`${key}-error`} message={errors[key]} />
                  </div>
                ))}
              </div>
              {/* Honeypot: hidden from people, filled in by bots; the API drops those. */}
              <div aria-hidden="true" className="absolute left-[-9999px]">
                <label>
                  Website (leave blank)
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </label>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {submit.error && (
        <p
          role="alert"
          className="mt-6 text-[15px] font-medium text-danger-500"
        >
          {toErrorMessage(submit.error)}
        </p>
      )}

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-rule pt-8">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => {
              setDirection(-1);
              setStep((s) => s - 1);
            }}
            className="inline-flex h-12 items-center gap-2 rounded-full px-2 text-[15px] font-semibold text-slate transition-colors hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-blue"
          >
            <ArrowLeft size={17} aria-hidden="true" />
            Back
          </button>
        ) : (
          <span />
        )}
        <button
          type="submit"
          disabled={submit.isPending}
          className="group inline-flex h-13 items-center gap-2 rounded-full bg-blue px-7 text-[15px] font-semibold text-white transition-colors hover:bg-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 disabled:opacity-60"
        >
          {step < STEPS.length - 1
            ? "Continue"
            : submit.isPending
              ? "Sending…"
              : "Send enquiry"}
          <ArrowRight
            size={17}
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-0.5"
          />
        </button>
      </div>
    </form>
  );
}

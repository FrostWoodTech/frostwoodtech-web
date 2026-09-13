import { useCallback, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Button from "@/client/components/ui/Button";
import ServiceTypeSelector from "./ServiceTypeSelector";
import FormField from "./FormField";
import { useServices } from "@/client/hooks/useServices";
import { useSubmitContact } from "@/client/hooks/useSubmitContact";
import { toErrorMessage } from "@/client/services/ApiError";
import type {
  ContactBudgetRange,
  ContactData,
  FormFieldConfig,
  SubmitContactPayload,
} from "@/client/types";

interface ContactFormProps {
  readonly data: ContactData;
}

type FieldId = FormFieldConfig["id"];
type FormValues = Record<FieldId, string>;

const EMPTY_VALUES: FormValues = {
  name: "",
  email: "",
  phone: "",
  company: "",
  budgetRange: "",
  message: "",
};

/** Mirrors the API's `ContactService.Validate` wording. */
function validate(values: FormValues): Partial<Record<FieldId, string>> {
  const errors: Partial<Record<FieldId, string>> = {};
  if (!values.name.trim()) errors.name = "Name is required.";
  if (!values.email.trim().includes("@"))
    errors.email = "A valid email is required.";
  if (!values.message.trim()) errors.message = "Message is required.";
  return errors;
}

const blank = (value: string) => value.trim() || undefined;

export default function ContactForm({ data }: ContactFormProps) {
  const [values, setValues] = useState<FormValues>(EMPTY_VALUES);
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<Partial<Record<FieldId, string>>>({});
  const [sent, setSent] = useState(false);

  const { data: servicesResult } = useServices({ pageSize: 100 });
  const serviceOptions = useMemo(
    () =>
      (servicesResult?.items ?? []).map((service) => ({
        value: service.id,
        label: service.name,
      })),
    [servicesResult],
  );

  const submitContact = useSubmitContact();

  const handleFieldChange = useCallback((id: FieldId, value: string) => {
    setValues((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => (prev[id] ? { ...prev, [id]: undefined } : prev));
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const payload: SubmitContactPayload = {
      name: values.name.trim(),
      email: values.email.trim(),
      phone: blank(values.phone),
      company: blank(values.company),
      message: values.message.trim(),
      serviceId: serviceId ?? undefined,
      budgetRange:
        (blank(values.budgetRange) as ContactBudgetRange) ?? undefined,
      site: "agency",
      website: honeypot || undefined,
    };

    submitContact.mutate(payload, {
      onSuccess: () => {
        setSent(true);
        setValues(EMPTY_VALUES);
        setServiceId(null);
      },
    });
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-[22px] border border-card-br bg-card p-10 text-center shadow-card sm:p-14">
        <CheckCircle2
          size={40}
          aria-hidden="true"
          className="text-primary-400"
        />
        <h2 className="font-display text-[26px] font-medium tracking-[-0.018em] text-text-primary">
          Thanks — we&rsquo;ve got it.
        </h2>
        <p className="max-w-sm text-[15px] leading-[1.65] text-text-secondary">
          We reply to every enquiry within one working day.
        </p>
        <Button variant="secondary" size="sm" onClick={() => setSent(false)}>
          Send another enquiry
        </Button>
      </div>
    );
  }

  const renderField = (field: FormFieldConfig) => (
    <FormField
      key={field.id}
      field={field}
      value={values[field.id]}
      onChange={handleFieldChange}
      error={errors[field.id]}
    />
  );

  return (
    <div className="rounded-[22px] border border-card-br bg-card p-8 shadow-card sm:p-10">
      <h2 className="font-display text-[26px] font-medium tracking-[-0.018em] text-text-primary">
        Start a project
      </h2>
      <p className="mt-2 text-[14.5px] text-text-secondary">
        Only your name, email and message are required — but the more we know,
        the sharper the quote.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-7">
        {/* Honeypot: hidden from people, filled by bots; the API files those as spam. */}
        <div
          aria-hidden="true"
          className="absolute -left-[9999px] h-px w-px overflow-hidden"
        >
          <label htmlFor="website">Website</label>
          <input
            id="website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(event) => setHoneypot(event.target.value)}
          />
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {data.formFields
            .filter((field) => field.type !== "textarea")
            .map(renderField)}
        </div>

        {serviceOptions.length > 0 && (
          <div className="mb-6">
            <ServiceTypeSelector
              options={serviceOptions}
              selected={serviceId}
              onSelect={setServiceId}
            />
          </div>
        )}

        <div className="mb-7 grid grid-cols-1">
          {data.formFields
            .filter((field) => field.type === "textarea")
            .map(renderField)}
        </div>

        {submitContact.isError && (
          <p
            role="alert"
            className="mb-4 text-center text-[14px] text-danger-400"
          >
            {toErrorMessage(submitContact.error)}
          </p>
        )}

        <Button
          type="submit"
          size="lg"
          className="w-full"
          loading={submitContact.isPending}
          icon={<ArrowRight size={16} />}
        >
          Send it over
        </Button>

        <p className="mt-3.5 text-center text-[13px] text-text-muted">
          We reply to every enquiry within one working day.
        </p>
      </form>
    </div>
  );
}

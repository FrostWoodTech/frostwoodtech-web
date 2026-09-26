import { ChevronDown } from "lucide-react";
import type { FormFieldConfig } from "@/client/types";

interface FormFieldProps {
  readonly field: FormFieldConfig;
  readonly value: string;
  readonly onChange: (id: FormFieldConfig["id"], value: string) => void;
  readonly error?: string;
}

const INPUT_CLASSES =
  "w-full rounded-xl border border-raise-br bg-raise px-4 py-3.5 text-[14.5px] text-text-primary placeholder:text-text-muted transition-colors duration-200 focus:border-accent-400 focus:outline-none";

export default function FormField({
  field,
  value,
  onChange,
  error,
}: FormFieldProps) {
  const errorId = `${field.id}-error`;
  const a11y = {
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
  };
  const inputClasses = `${INPUT_CLASSES} ${error ? "border-danger-400" : ""}`;

  return (
    <div className={field.halfWidth ? "" : "col-span-full"}>
      <label
        htmlFor={field.id}
        className="mb-2 block text-[13px] font-bold text-text-primary"
      >
        {field.label}
        {field.required && (
          <span className="ml-0.5 text-primary-400" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {field.type === "textarea" ? (
        <textarea
          id={field.id}
          name={field.id}
          rows={5}
          placeholder={field.placeholder}
          required={field.required}
          {...a11y}
          value={value}
          onChange={(event) => onChange(field.id, event.target.value)}
          className={`${inputClasses} resize-none leading-[1.6]`}
        />
      ) : field.type === "select" ? (
        <div className="relative">
          <select
            id={field.id}
            name={field.id}
            required={field.required}
            {...a11y}
            value={value}
            onChange={(event) => onChange(field.id, event.target.value)}
            className={`${inputClasses} cursor-pointer appearance-none pr-11 ${
              value === "" ? "text-text-muted" : ""
            }`}
          >
            <option value="">{field.placeholder}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={15}
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-text-muted"
          />
        </div>
      ) : (
        <input
          id={field.id}
          name={field.id}
          type={field.type}
          placeholder={field.placeholder}
          required={field.required}
          {...a11y}
          value={value}
          onChange={(event) => onChange(field.id, event.target.value)}
          className={inputClasses}
        />
      )}

      {error && (
        <p id={errorId} className="mt-1.5 text-[13px] text-danger-400">
          {error}
        </p>
      )}
    </div>
  );
}

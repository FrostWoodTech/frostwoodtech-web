import type { SelectOption } from "@/client/types";

interface ServiceTypeSelectorProps {
  readonly options: readonly SelectOption[];
  /** `null` means a general enquiry. */
  readonly selected: string | null;
  readonly onSelect: (value: string | null) => void;
}

export default function ServiceTypeSelector({
  options,
  selected,
  onSelect,
}: ServiceTypeSelectorProps) {
  const chip = (isActive: boolean) =>
    `cursor-pointer rounded-[10px] px-4.5 py-2.5 text-[13.5px] transition-colors duration-200 ${
      isActive
        ? "fw-btn font-bold"
        : "border border-raise-br bg-raise font-semibold text-text-secondary hover:text-text-primary"
    }`;

  return (
    <fieldset>
      <legend className="mb-3 text-[13px] font-bold text-text-primary">
        What do you need?
      </legend>
      <div className="flex flex-wrap gap-2.5">
        {options.map((option) => {
          const isActive = selected === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onSelect(isActive ? null : option.value)}
              aria-pressed={isActive}
              className={chip(isActive)}
            >
              {option.label}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => onSelect(null)}
          aria-pressed={selected === null}
          className={chip(selected === null)}
        >
          Not sure yet
        </button>
      </div>
    </fieldset>
  );
}

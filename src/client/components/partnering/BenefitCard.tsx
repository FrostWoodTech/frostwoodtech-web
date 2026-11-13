import type { PartneringItem } from "@/client/types";

interface BenefitCardProps {
  readonly item: PartneringItem;
  readonly active: boolean;
  readonly onSelect: () => void;
  /** Placement: a grid cell, or a chip in the mobile row. */
  readonly className?: string;
}

const STATE_CLASSES: Record<"active" | "idle", string> = {
  active: "border-blue bg-white shadow-[0_0_0_3px_rgb(30_79_163/0.12)]",
  idle: "border-rule bg-white hover:border-border-default",
};

/** One benefit as a selectable card; selecting it shows that benefit's details. */
export default function BenefitCard({
  item,
  active,
  onSelect,
  className = "",
}: BenefitCardProps) {
  const Icon = item.icon;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`Show: ${item.title}`}
      aria-current={active || undefined}
      className={`items-center gap-3 rounded-lg border py-3 pr-4 pl-3 text-left transition duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 ${STATE_CLASSES[active ? "active" : "idle"]} ${className}`}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-ice-wash text-blue">
        <Icon size={18} aria-hidden="true" />
      </span>
      <span className="text-[14.5px] leading-tight font-bold whitespace-nowrap text-ink">
        {item.label}
      </span>
    </button>
  );
}

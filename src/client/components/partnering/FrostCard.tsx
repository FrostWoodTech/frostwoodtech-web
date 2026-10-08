import type { PartneringItem } from "@/client/types";

interface FrostCardProps {
  readonly item: PartneringItem;
  readonly active: boolean;
  readonly onSelect: () => void;
  /** Placement: a gap around the snowflake, or a chip in the mobile row. */
  readonly className?: string;
}

const STATE_CLASSES: Record<"active" | "idle", string> = {
  active:
    "z-10 scale-120 border-solid border-ice bg-white/90 shadow-[0_0_0_4px_rgb(125_183_255/0.2),0_14px_32px_-14px_rgb(61_127_204/0.5)]",
  idle: "border-dotted border-ice/80 bg-white/70 shadow-[0_12px_28px_-20px_rgb(21_40_64/0.35)] hover:border-ice",
};

/** Frosted-glass pill showing one benefit; selecting it shows that benefit's details. */
export default function FrostCard({
  item,
  active,
  onSelect,
  className = "",
}: FrostCardProps) {
  const Icon = item.icon;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`Show: ${item.title}`}
      aria-current={active || undefined}
      className={`items-center gap-3 rounded-2xl border-[1.5px] py-2.5 pr-4 pl-2.5 text-left backdrop-blur-md transition duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 ${STATE_CLASSES[active ? "active" : "idle"]} ${className}`}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ice-wash text-blue">
        <Icon size={18} aria-hidden="true" />
      </span>
      <span className="text-[14.5px] leading-tight font-bold whitespace-nowrap text-ink">
        {item.label}
      </span>
    </button>
  );
}

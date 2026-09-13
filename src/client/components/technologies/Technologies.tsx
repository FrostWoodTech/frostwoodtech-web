import { useMemo } from "react";
import {
  Bot,
  Braces,
  BrainCircuit,
  Cloud,
  Database,
  Layers,
  MonitorSmartphone,
  PenTool,
  Server,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Chip from "@/client/components/ui/Chip";
import Eyebrow from "@/client/components/ui/Eyebrow";
import IconTile from "@/client/components/ui/IconTile";
import { useTags } from "@/client/hooks/useTags";
import type { ApiTag, TechCategory } from "@/client/types";

/** Display order and labels, matching the API's `TechCategoryLabels`. */
const CATEGORIES: readonly {
  readonly value: TechCategory;
  readonly label: string;
  readonly icon: LucideIcon;
}[] = [
  { value: "language", label: "Language", icon: Braces },
  { value: "frontend", label: "Frontend", icon: MonitorSmartphone },
  { value: "backend", label: "Backend", icon: Server },
  { value: "database", label: "Database", icon: Database },
  { value: "cloud_devops", label: "Cloud & DevOps", icon: Cloud },
  { value: "ai_ml_dl", label: "AI / ML / DL", icon: BrainCircuit },
  { value: "agentic_ai", label: "Agentic AI", icon: Bot },
  { value: "design", label: "Design", icon: PenTool },
  { value: "tool_or_platform", label: "Tool / platform", icon: Wrench },
  { value: "other", label: "Other", icon: Layers },
];

export default function Technologies() {
  const { data: tags } = useTags({ isTechnology: true });

  const groups = useMemo(() => {
    const byCategory = new Map<TechCategory, ApiTag[]>();
    for (const tag of tags ?? []) {
      const category = tag.technologyCategory ?? "other";
      byCategory.set(category, [...(byCategory.get(category) ?? []), tag]);
    }
    return CATEGORIES.filter((category) => byCategory.has(category.value)).map(
      (category) => ({ ...category, tags: byCategory.get(category.value)! }),
    );
  }, [tags]);

  if (groups.length === 0) return null;

  return (
    <div>
      <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-15">
        <div className="max-w-2xl">
          <Eyebrow tone="ice" className="mb-4.5">
            Our toolkit
          </Eyebrow>
          <h2 className="font-display text-[32px] leading-[1.1] font-medium tracking-[-0.018em] text-text-primary md:text-[44px]">
            The technologies we build on.
          </h2>
        </div>
        <p className="max-w-85 text-[15.5px] leading-[1.65] text-text-secondary lg:mb-1.5">
          Boring, well-documented tools with long support horizons. We would
          rather be predictable than fashionable.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4.5 md:grid-cols-2 lg:grid-cols-3">
        {groups.map(({ value, label, icon: Icon, tags: groupTags }) => (
          <div
            key={value}
            className="rounded-[20px] border border-card-br bg-card p-7.5 shadow-card"
          >
            <div className="flex items-center gap-3">
              <IconTile size="sm">
                <Icon size={16} aria-hidden="true" />
              </IconTile>
              <h3 className="text-xs font-bold tracking-[0.09em] text-text-muted uppercase">
                {label}
              </h3>
            </div>

            <div className="mt-4.5 flex flex-wrap gap-2">
              {groupTags.map((tag) => (
                <Chip key={tag.id}>{tag.name}</Chip>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

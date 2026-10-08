import type { ProductScreenKind } from "@/client/types";
import { initialsOf } from "@/client/utils/initials";

interface ProductScreenDrawingProps {
  readonly kind: ProductScreenKind;
}

/** A simplified app screen for a product that has no screenshots yet, in Frost colours. */
export default function ProductScreenDrawing({
  kind,
}: ProductScreenDrawingProps) {
  const Drawing = DRAWINGS[kind];
  return (
    <svg viewBox="0 0 640 380" aria-hidden="true" className="h-full w-full">
      <Drawing />
    </svg>
  );
}

interface SidebarProps {
  readonly name: string;
  readonly items: readonly string[];
}

/** App sidebar: logo, product name and nav, with the first item active. */
function Sidebar({ name, items }: SidebarProps) {
  return (
    <>
      <rect width="128" height="380" className="fill-mist" />
      <rect x="18" y="20" width="24" height="24" rx="7" className="fill-blue" />
      <path
        d="M30 25v14M24 28.5l12 7M36 28.5l-12 7"
        strokeWidth="1.6"
        strokeLinecap="round"
        className="stroke-white"
      />
      <text
        x="50"
        y="36.5"
        className="fill-ink font-sans text-[12px] font-bold"
      >
        {name}
      </text>
      {items.map((item, index) => (
        <g key={item}>
          {index === 0 && (
            <rect
              x="12"
              y={66 + index * 30}
              width="104"
              height="24"
              rx="8"
              className="fill-white stroke-rule"
            />
          )}
          <circle
            cx="27"
            cy={78 + index * 30}
            r="3.5"
            className={index === 0 ? "fill-blue" : "fill-rule"}
          />
          <text
            x="38"
            y={81.5 + index * 30}
            className={`font-sans text-[10px] ${
              index === 0 ? "fill-ink font-bold" : "fill-slate"
            }`}
          >
            {item}
          </text>
        </g>
      ))}
    </>
  );
}

interface PageTitleProps {
  readonly title: string;
  readonly detail: string;
  readonly action?: string;
}

function PageTitle({ title, detail, action }: PageTitleProps) {
  return (
    <>
      <text x="152" y="42" className="fill-ink font-display text-[24px]">
        {title}
      </text>
      <text x="152" y="58" className="fill-slate font-sans text-[10px]">
        {detail}
      </text>
      {action && (
        <>
          <rect
            x="520"
            y="24"
            width="100"
            height="28"
            rx="14"
            className="fill-ink"
          />
          <text
            x="570"
            y="41.5"
            textAnchor="middle"
            className="fill-white font-sans text-[10px] font-bold"
          >
            {action}
          </text>
        </>
      )}
    </>
  );
}

const DAYS = ["Mon 12", "Tue 13", "Wed 14", "Thu 15", "Fri 16"] as const;
const DAY_WIDTH = 93.6;
const SLOT_HEIGHT = 40;

/** Booked slots: day, first slot (9:00 = 0), length in slots, solid or light, label. */
const BOOKINGS: readonly (readonly [
  number,
  number,
  number,
  boolean,
  string,
])[] = [
  [0, 0, 1, true, "Haircut"],
  [0, 2, 2, false, "Colour"],
  [1, 1, 1, true, "Consultation"],
  [1, 3, 1, false, "Trim"],
  [2, 0, 2, false, "Massage"],
  [2, 3, 1, true, "Haircut"],
  [3, 1, 2, true, "Nails"],
  [3, 4, 1, false, "Facial"],
  [4, 0, 1, false, "Trim"],
  [4, 2, 1, true, "Haircut"],
  [4, 4, 1, false, "Consultation"],
];

function BookingsDrawing() {
  return (
    <>
      <Sidebar
        name="FrostBook"
        items={["Calendar", "Customers", "Payments", "Settings"]}
      />
      <PageTitle
        title="This week"
        detail="12 – 16 May · 11 bookings"
        action="+ New booking"
      />

      {DAYS.map((day, index) => (
        <text
          key={day}
          x={152 + index * DAY_WIDTH + DAY_WIDTH / 2}
          y="90"
          textAnchor="middle"
          className="fill-slate font-sans text-[10px] font-semibold"
        >
          {day}
        </text>
      ))}
      {Array.from({ length: 7 }, (_, row) => (
        <line
          key={row}
          x1="152"
          y1={102 + row * SLOT_HEIGHT}
          x2="620"
          y2={102 + row * SLOT_HEIGHT}
          className="stroke-rule"
        />
      ))}
      {BOOKINGS.map(([day, slot, length, solid, label]) => {
        const x = 152 + day * DAY_WIDTH + 4;
        const y = 102 + slot * SLOT_HEIGHT + 4;
        return (
          <g key={`${day}-${slot}`}>
            <rect
              x={x}
              y={y}
              width={DAY_WIDTH - 8}
              height={length * SLOT_HEIGHT - 8}
              rx="8"
              className={solid ? "fill-blue" : "fill-ice-wash stroke-ice/60"}
            />
            <text
              x={x + 9}
              y={y + 14}
              className={`font-sans text-[9.5px] font-bold ${solid ? "fill-white" : "fill-blue"}`}
            >
              {label}
            </text>
            <text
              x={x + 9}
              y={y + 26}
              className={`font-sans text-[8.5px] ${solid ? "fill-white/75" : "fill-slate"}`}
            >
              {9 + slot}:00
            </text>
          </g>
        );
      })}
    </>
  );
}

const STATS = [
  ["In stock", "1,284"],
  ["Running low", "3"],
  ["Orders today", "38"],
] as const;

/** Item, location, stock level (0–1). */
const STOCK: readonly (readonly [string, string, number])[] = [
  ["Oat milk 1L", "Main Street", 0.82],
  ["Coffee beans", "Warehouse", 0.64],
  ["Paper cups", "Main Street", 0.12],
  ["Croissants", "Harbour Road", 0.48],
  ["Napkins", "Warehouse", 0.9],
];
const LOW_STOCK = 0.2;

function InventoryDrawing() {
  return (
    <>
      <Sidebar
        name="FrostStock"
        items={["Stock", "Orders", "Suppliers", "Reports"]}
      />
      <PageTitle
        title="Stock"
        detail="3 shops · 1 warehouse"
        action="Reorder"
      />

      {STATS.map(([label, value], index) => (
        <g key={label}>
          <rect
            x={152 + index * 160}
            y="74"
            width="148"
            height="62"
            rx="12"
            className="fill-white stroke-rule"
          />
          <text
            x={166 + index * 160}
            y="96"
            className="fill-slate font-sans text-[9.5px]"
          >
            {label}
          </text>
          <text
            x={166 + index * 160}
            y="124"
            className={`font-display text-[24px] ${index === 1 ? "fill-blue" : "fill-ink"}`}
          >
            {value}
          </text>
        </g>
      ))}

      {[
        [166, "Item"],
        [312, "Location"],
        [428, "Stock level"],
      ].map(([x, label]) => (
        <text
          key={label}
          x={x}
          y="166"
          className="fill-slate font-sans text-[9px] font-bold"
        >
          {label}
        </text>
      ))}
      <line x1="152" y1="176" x2="620" y2="176" className="stroke-rule" />

      {STOCK.map(([item, location, level], index) => {
        const y = 180 + index * 38;
        const low = level < LOW_STOCK;
        return (
          <g key={item}>
            {low && (
              <rect
                x="152"
                y={y}
                width="468"
                height="34"
                rx="8"
                className="fill-ice-wash"
              />
            )}
            <text
              x="166"
              y={y + 21}
              className="fill-ink font-sans text-[10.5px] font-semibold"
            >
              {item}
            </text>
            <text
              x="312"
              y={y + 21}
              className="fill-slate font-sans text-[10px]"
            >
              {location}
            </text>
            <rect
              x="428"
              y={y + 13}
              width="120"
              height="8"
              rx="4"
              className="fill-mist"
            />
            <rect
              x="428"
              y={y + 13}
              width={120 * level}
              height="8"
              rx="4"
              className={low ? "fill-blue" : "fill-ice"}
            />
            {low && (
              <>
                <rect
                  x="560"
                  y={y + 8}
                  width="54"
                  height="18"
                  rx="9"
                  className="fill-white stroke-ice"
                />
                <text
                  x="587"
                  y={y + 20}
                  textAnchor="middle"
                  className="fill-blue font-sans text-[8.5px] font-bold"
                >
                  Low stock
                </text>
              </>
            )}
          </g>
        );
      })}
    </>
  );
}

/** Name, message preview, unread. */
const INBOX: readonly (readonly [string, string, boolean])[] = [
  ["Maya R.", "Is my order on its way?", true],
  ["Tom B.", "Can I change my booking?", true],
  ["Priya S.", "Thanks, that worked!", false],
  ["Leo K.", "Do you ship abroad?", false],
  ["Ana M.", "Question about my invoice", false],
];

function SupportDrawing() {
  return (
    <>
      <Sidebar
        name="FrostDesk"
        items={["Inbox", "Customers", "Help articles", "Reports"]}
      />
      <PageTitle title="Inbox" detail="2 new · all channels" />

      {INBOX.map(([name, preview, unread], index) => {
        const y = 72 + index * 58;
        return (
          <g key={name}>
            {index === 0 && (
              <rect
                x="144"
                y={y}
                width="180"
                height="52"
                rx="12"
                className="fill-white stroke-rule"
              />
            )}
            <circle
              cx="168"
              cy={y + 26}
              r="13"
              className={index % 2 === 0 ? "fill-blue" : "fill-ice-wash"}
            />
            <text
              x="168"
              y={y + 29.5}
              textAnchor="middle"
              className={`font-sans text-[9px] font-bold ${index % 2 === 0 ? "fill-white" : "fill-blue"}`}
            >
              {initialsOf(name)}
            </text>
            <text
              x="190"
              y={y + 22}
              className="fill-ink font-sans text-[10px] font-bold"
            >
              {name}
            </text>
            <text
              x="190"
              y={y + 36}
              className="fill-slate font-sans text-[8.5px]"
            >
              {preview}
            </text>
            {unread && (
              <circle cx="312" cy={y + 19} r="3.5" className="fill-blue" />
            )}
          </g>
        );
      })}

      <line x1="336" y1="20" x2="336" y2="380" className="stroke-rule" />
      <circle cx="364" cy="40" r="14" className="fill-blue" />
      <text
        x="364"
        y="43.5"
        textAnchor="middle"
        className="fill-white font-sans text-[9px] font-bold"
      >
        MR
      </text>
      <text x="386" y="38" className="fill-ink font-sans text-[11px] font-bold">
        Maya R.
      </text>
      <text x="386" y="52" className="fill-slate font-sans text-[9px]">
        Live chat · 2 min ago
      </text>
      <line x1="336" y1="70" x2="640" y2="70" className="stroke-rule" />

      <rect
        x="352"
        y="88"
        width="196"
        height="46"
        rx="14"
        className="fill-mist"
      />
      <text x="366" y="107" className="fill-ink font-sans text-[10px]">
        Hi! Is my order on its way?
      </text>
      <text x="366" y="122" className="fill-ink font-sans text-[10px]">
        It was due yesterday.
      </text>

      <rect
        x="396"
        y="148"
        width="212"
        height="46"
        rx="14"
        className="fill-blue"
      />
      <text x="410" y="167" className="fill-white font-sans text-[10px]">
        Yes! It left our warehouse today
      </text>
      <text x="410" y="182" className="fill-white font-sans text-[10px]">
        and arrives tomorrow by noon.
      </text>
      <text
        x="608"
        y="208"
        textAnchor="end"
        className="fill-slate font-sans text-[8.5px]"
      >
        Sent · Seen
      </text>

      <rect
        x="352"
        y="220"
        width="130"
        height="32"
        rx="14"
        className="fill-mist"
      />
      <text x="366" y="240" className="fill-ink font-sans text-[10px]">
        Amazing, thank you!
      </text>

      <rect
        x="352"
        y="320"
        width="256"
        height="40"
        rx="20"
        className="fill-white stroke-rule"
      />
      <text x="372" y="344" className="fill-slate font-sans text-[10px]">
        Write a reply…
      </text>
      <circle cx="588" cy="340" r="13" className="fill-ink" />
      <path
        d="M583 340h10M589 335.5l4.5 4.5-4.5 4.5"
        fill="none"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-white"
      />
    </>
  );
}

const DRAWINGS: Record<ProductScreenKind, () => React.JSX.Element> = {
  bookings: BookingsDrawing,
  inventory: InventoryDrawing,
  support: SupportDrawing,
};

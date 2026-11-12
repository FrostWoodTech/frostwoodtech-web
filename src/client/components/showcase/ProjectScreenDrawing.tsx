import type { ProjectScreenKind } from "@/client/types";

interface ProjectScreenDrawingProps {
  readonly kind: ProjectScreenKind;
}

/** A simplified app screen for a project that has no screenshots yet, in Frost colours. */
export default function ProjectScreenDrawing({
  kind,
}: ProjectScreenDrawingProps) {
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

/** App sidebar: logo, project name and nav, with the first item active. */
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

type ChipTone = "solid" | "light" | "muted";

const CHIP_TONES: Record<ChipTone, { box: string; text: string }> = {
  solid: { box: "fill-blue", text: "fill-white" },
  light: { box: "fill-ice-wash stroke-ice/60", text: "fill-blue" },
  muted: { box: "fill-mist", text: "fill-slate" },
};

interface ChipProps {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly label: string;
  readonly tone: ChipTone;
}

/** A small status pill. */
function Chip({ x, y, width, label, tone }: ChipProps) {
  return (
    <>
      <rect
        x={x}
        y={y}
        width={width}
        height="18"
        rx="9"
        className={CHIP_TONES[tone].box}
      />
      <text
        x={x + width / 2}
        y={y + 12}
        textAnchor="middle"
        className={`font-sans text-[8.5px] font-bold ${CHIP_TONES[tone].text}`}
      >
        {label}
      </text>
    </>
  );
}

const SEAT_ROWS = ["A", "B", "C", "D", "E", "F"] as const;
const SEATS_PER_ROW = 12;
const SEAT_PITCH = 30;
const SEATS_LEFT = 200;
const AISLE = 12;
/** Taken seats as "row:seat" (seats numbered from 1); F7 and F8 are the visitor's picks. */
const TAKEN = new Set([
  "A:3",
  "A:4",
  "A:5",
  "A:9",
  "B:1",
  "B:2",
  "B:6",
  "B:7",
  "B:8",
  "C:4",
  "C:5",
  "C:10",
  "C:11",
  "D:6",
  "D:7",
  "E:2",
  "E:3",
  "E:11",
  "F:12",
]);
const PICKED = new Set(["F:7", "F:8"]);

const seatFill = (id: string) =>
  PICKED.has(id)
    ? "fill-blue"
    : TAKEN.has(id)
      ? "fill-rule"
      : "fill-white stroke-ice";

const SEAT_LEGEND = [
  ["fill-white stroke-ice", "Free"],
  ["fill-rule", "Taken"],
  ["fill-blue", "Your seats"],
] as const;

function TheatreDrawing() {
  return (
    <>
      <Sidebar
        name="Theatre"
        items={["Seats", "Showtimes", "Payments", "Settings"]}
      />
      <PageTitle
        title="Choose your seats"
        detail="Evening show · Fri 16 May, 19:30"
        action="Checkout"
      />

      <path
        d="M236 84 Q386 70 536 84"
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
        className="stroke-ice"
      />
      <text
        x="386"
        y="99"
        textAnchor="middle"
        className="fill-slate font-sans text-[8px] font-bold tracking-[0.2em]"
      >
        STAGE
      </text>

      {SEAT_ROWS.map((row, rowIndex) => {
        const y = 112 + rowIndex * 28;
        return (
          <g key={row}>
            <text
              x="182"
              y={y + 14}
              textAnchor="middle"
              className="fill-slate font-sans text-[9px] font-bold"
            >
              {row}
            </text>
            {Array.from({ length: SEATS_PER_ROW }, (_, seat) => {
              const id = `${row}:${seat + 1}`;
              return (
                <rect
                  key={id}
                  x={
                    SEATS_LEFT +
                    seat * SEAT_PITCH +
                    (seat >= SEATS_PER_ROW / 2 ? AISLE : 0)
                  }
                  y={y}
                  width="22"
                  height="20"
                  rx="6"
                  className={seatFill(id)}
                />
              );
            })}
          </g>
        );
      })}

      {SEAT_LEGEND.map(([fill, label], index) => (
        <g key={label}>
          <rect
            x={200 + index * 86}
            y="288"
            width="12"
            height="11"
            rx="3.5"
            className={fill}
          />
          <text
            x={218 + index * 86}
            y="297"
            className="fill-slate font-sans text-[9px]"
          >
            {label}
          </text>
        </g>
      ))}

      <rect
        x="152"
        y="314"
        width="468"
        height="48"
        rx="14"
        className="fill-white stroke-rule"
      />
      <text
        x="170"
        y="335"
        className="fill-ink font-sans text-[11px] font-bold"
      >
        2 seats · Row F, seats 7–8
      </text>
      <text x="170" y="350" className="fill-slate font-sans text-[9px]">
        Digital tickets sent by email
      </text>
      <text
        x="604"
        y="345"
        textAnchor="end"
        className="fill-ink font-display text-[22px]"
      >
        $48.00
      </text>
    </>
  );
}

const PEOPLE_STATS = [
  ["Present today", "44"],
  ["On leave", "3"],
  ["Leave requests", "2"],
] as const;

/** Name, initials, team, status tone, today's status. */
const PEOPLE: readonly (readonly [string, string, string, ChipTone, string])[] =
  [
    ["Nadia Perera", "NP", "Design", "light", "On leave"],
    ["Ravi Kumar", "RK", "Engineering", "solid", "Present"],
    ["Emma Clarke", "EC", "Sales", "solid", "Present"],
    ["Daniel Silva", "DS", "Support", "muted", "Remote"],
    ["Aisha Khan", "AK", "Finance", "solid", "Present"],
  ];

function PeopleDrawing() {
  return (
    <>
      <Sidebar
        name="Teamora"
        items={["People", "Attendance", "Leave", "Settings"]}
      />
      <PageTitle
        title="People overview"
        detail="48 employees · 4 teams"
        action="+ Add person"
      />

      {PEOPLE_STATS.map(([label, value], index) => (
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
            className={`font-display text-[24px] ${index === 2 ? "fill-blue" : "fill-ink"}`}
          >
            {value}
          </text>
        </g>
      ))}

      {[
        [166, "Name"],
        [348, "Team"],
        [470, "Today"],
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

      {PEOPLE.map(([name, initials, team, tone, status], index) => {
        const y = 180 + index * 38;
        const filled = index % 2 === 1;
        return (
          <g key={name}>
            <circle
              cx="177"
              cy={y + 17}
              r="11"
              className={filled ? "fill-blue" : "fill-ice-wash"}
            />
            <text
              x="177"
              y={y + 20}
              textAnchor="middle"
              className={`font-sans text-[8px] font-bold ${filled ? "fill-white" : "fill-blue"}`}
            >
              {initials}
            </text>
            <text
              x="196"
              y={y + 21}
              className="fill-ink font-sans text-[10.5px] font-semibold"
            >
              {name}
            </text>
            <text
              x="348"
              y={y + 21}
              className="fill-slate font-sans text-[10px]"
            >
              {team}
            </text>
            <Chip x={470} y={y + 8} width={62} label={status} tone={tone} />
          </g>
        );
      })}
    </>
  );
}

/** Time, pickup, drop-off, passengers, status tone, status. */
const TRANSFERS: readonly (readonly [
  string,
  string,
  string,
  string,
  ChipTone,
  string,
])[] = [
  ["09:10", "Airport", "Harbour Hotel", "1 passenger", "muted", "Completed"],
  ["11:45", "Grand Hotel", "Airport", "3 passengers", "muted", "Completed"],
  [
    "14:30",
    "Airport",
    "Lakeside Resort",
    "2 passengers",
    "solid",
    "On the way",
  ],
  ["16:00", "Airport", "City Suites", "4 passengers", "light", "Scheduled"],
  ["19:20", "Bay Hotel", "Airport", "2 passengers", "light", "Scheduled"],
];

function TransfersDrawing() {
  return (
    <>
      <Sidebar
        name="Aurora"
        items={["Transfers", "Upcoming", "Drivers", "Settings"]}
      />
      <PageTitle
        title="Today’s transfers"
        detail="5 transfers · 2 drivers on the road"
        action="+ New transfer"
      />

      {TRANSFERS.map(([time, from, to, passengers, tone, status], index) => {
        const y = 76 + index * 58;
        return (
          <g key={time}>
            <rect
              x="152"
              y={y}
              width="468"
              height="50"
              rx="12"
              className={
                tone === "solid"
                  ? "fill-ice-wash stroke-ice/60"
                  : "fill-white stroke-rule"
              }
            />
            <text
              x="168"
              y={y + 31}
              className="fill-ink font-display text-[18px]"
            >
              {time}
            </text>

            {/* Route: pickup dot, dotted line, drop-off pin. */}
            <circle cx="232" cy={y + 17} r="3.5" className="fill-blue" />
            <line
              x1="232"
              y1={y + 22}
              x2="232"
              y2={y + 29}
              strokeDasharray="2 2"
              className="stroke-ice"
            />
            <path
              d={`M232 ${y + 30}c-3 0-4.8 2.1-4.8 4.4 0 3.2 4.8 7.1 4.8 7.1s4.8-3.9 4.8-7.1c0-2.3-1.8-4.4-4.8-4.4z`}
              className="fill-ink"
            />
            <text
              x="246"
              y={y + 20}
              className="fill-ink font-sans text-[10px] font-semibold"
            >
              {from}
            </text>
            <text
              x="246"
              y={y + 38}
              className="fill-ink font-sans text-[10px] font-semibold"
            >
              {to}
            </text>

            <text
              x="410"
              y={y + 29}
              className="fill-slate font-sans text-[9.5px]"
            >
              {passengers}
            </text>
            <Chip x={526} y={y + 16} width={78} label={status} tone={tone} />
          </g>
        );
      })}
    </>
  );
}

const DRAWINGS: Record<ProjectScreenKind, () => React.JSX.Element> = {
  theatre: TheatreDrawing,
  people: PeopleDrawing,
  transfers: TransfersDrawing,
};

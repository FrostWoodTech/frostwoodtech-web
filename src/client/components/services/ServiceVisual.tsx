import { useId } from "react";
import { Layers } from "lucide-react";
import type { Service, ServiceVisualKind } from "@/client/types";

interface ServiceVisualProps {
  readonly service: Service;
}

/** Pieces that drift a little while the card is hovered. */
const FLOAT = "transition-transform duration-500 ease-out";

/** A small picture of the service, in Frost colours. Services without one show their icon. */
export default function ServiceVisual({ service }: ServiceVisualProps) {
  // useId output isn't always a valid url(#…) fragment.
  const shadow = `service-shadow-${useId().replace(/[^\w-]/g, "")}`;

  if (!service.visual) return <IconVisual service={service} />;

  const Drawing = DRAWINGS[service.visual];
  return (
    <svg
      viewBox="0 0 320 200"
      aria-hidden="true"
      className="h-full w-full overflow-visible"
    >
      <defs>
        <filter id={shadow} x="-30%" y="-30%" width="160%" height="180%">
          <feDropShadow
            dx="0"
            dy="8"
            stdDeviation="9"
            floodColor="#152840"
            floodOpacity="0.12"
          />
        </filter>
      </defs>
      <Drawing shadow={`url(#${shadow})`} />
    </svg>
  );
}

interface DrawingProps {
  readonly shadow: string;
}

function WebsiteDrawing({ shadow }: DrawingProps) {
  return (
    <>
      <rect
        x="36"
        y="26"
        width="248"
        height="156"
        rx="12"
        filter={shadow}
        className="fill-white stroke-rule"
      />
      <circle cx="52" cy="40" r="3" className="fill-rule" />
      <circle cx="62" cy="40" r="3" className="fill-rule" />
      <circle cx="72" cy="40" r="3" className="fill-rule" />
      <rect
        x="96"
        y="33"
        width="120"
        height="14"
        rx="7"
        className="fill-mist"
      />
      <text x="106" y="43" className="fill-slate font-sans text-[7.5px]">
        yourbrand.com
      </text>
      <line x1="36" y1="54" x2="284" y2="54" className="stroke-rule" />

      <rect x="54" y="72" width="100" height="10" rx="5" className="fill-ink" />
      <rect x="54" y="88" width="72" height="10" rx="5" className="fill-ink" />
      <rect
        x="54"
        y="108"
        width="92"
        height="5"
        rx="2.5"
        className="fill-rule"
      />
      <rect
        x="54"
        y="118"
        width="70"
        height="5"
        rx="2.5"
        className="fill-rule"
      />
      <rect
        x="54"
        y="134"
        width="54"
        height="16"
        rx="8"
        className="fill-blue"
      />

      <rect
        x="170"
        y="68"
        width="96"
        height="84"
        rx="8"
        className="fill-ice-wash"
      />
      <circle cx="244" cy="88" r="8" className="fill-ice/60" />
      <path
        d="M178 152a8 8 0 0 1-8-8v-6l30-30 22 20 16-14 28 28v2a8 8 0 0 1-8 8z"
        className="fill-ice/50"
      />

      <g
        className={`${FLOAT} motion-safe:group-hover:-translate-x-2 motion-safe:group-hover:-translate-y-1`}
      >
        <path
          d="M112 140v17l4.5-4.5 3.5 7.5 3.2-1.5-3.5-7.3h6.3z"
          strokeWidth="1.2"
          strokeLinejoin="round"
          className="fill-ink stroke-white"
        />
      </g>

      <g className={`${FLOAT} motion-safe:group-hover:-translate-y-2`}>
        <rect
          x="12"
          y="150"
          width="108"
          height="32"
          rx="11"
          filter={shadow}
          className="fill-white stroke-rule"
        />
        <circle cx="29" cy="166" r="8" className="fill-ice-wash" />
        <circle
          cx="28"
          cy="165"
          r="3.2"
          fill="none"
          strokeWidth="1.5"
          className="stroke-blue"
        />
        <path
          d="M30.4 167.4l2.6 2.6"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="stroke-blue"
        />
        <text
          x="43"
          y="163"
          className="fill-ink font-sans text-[8px] font-bold"
        >
          Found on Google
        </text>
        <text x="43" y="173" className="fill-slate font-sans text-[7px]">
          Page one, top result
        </text>
      </g>
    </>
  );
}

function MobileDrawing({ shadow }: DrawingProps) {
  return (
    <>
      <rect
        x="112"
        y="10"
        width="96"
        height="180"
        rx="18"
        filter={shadow}
        className="fill-white stroke-rule"
      />
      <rect x="146" y="18" width="28" height="6" rx="3" className="fill-mist" />
      <rect
        x="124"
        y="34"
        width="44"
        height="7"
        rx="3.5"
        className="fill-ink"
      />
      <circle cx="194" cy="37.5" r="5" className="fill-ice-wash" />

      <rect
        x="124"
        y="50"
        width="72"
        height="40"
        rx="9"
        className="fill-blue"
      />
      <rect
        x="132"
        y="60"
        width="36"
        height="5"
        rx="2.5"
        className="fill-white/85"
      />
      <rect
        x="132"
        y="70"
        width="22"
        height="4"
        rx="2"
        className="fill-white/50"
      />

      {[98, 120, 142].map((y) => (
        <g key={y}>
          <circle cx="132" cy={y + 8} r="7" className="fill-ice-wash" />
          <rect
            x="145"
            y={y + 3}
            width="42"
            height="4.5"
            rx="2.25"
            className="fill-ink/75"
          />
          <rect
            x="145"
            y={y + 11}
            width="28"
            height="4"
            rx="2"
            className="fill-rule"
          />
        </g>
      ))}
      <line x1="112" y1="168" x2="208" y2="168" className="stroke-rule" />
      <circle cx="136" cy="178" r="3" className="fill-blue" />
      <circle cx="160" cy="178" r="3" className="fill-rule" />
      <circle cx="184" cy="178" r="3" className="fill-rule" />

      <g
        className={`${FLOAT} motion-safe:group-hover:translate-x-1 motion-safe:group-hover:-translate-y-2`}
      >
        <rect
          x="186"
          y="40"
          width="122"
          height="38"
          rx="12"
          filter={shadow}
          className="fill-white stroke-rule"
        />
        <rect
          x="194"
          y="49"
          width="20"
          height="20"
          rx="6"
          className="fill-blue"
        />
        <path
          d="M199 59l3.5 3.5 6-7"
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="stroke-white"
        />
        <text
          x="221"
          y="57"
          className="fill-ink font-sans text-[8px] font-bold"
        >
          New booking
        </text>
        <text x="221" y="68" className="fill-slate font-sans text-[7px]">
          Today, 2:30 pm
        </text>
      </g>

      <g
        className={`${FLOAT} motion-safe:group-hover:-translate-x-1 motion-safe:group-hover:-translate-y-1`}
      >
        <rect
          x="14"
          y="126"
          width="88"
          height="32"
          rx="11"
          filter={shadow}
          className="fill-white stroke-rule"
        />
        <path
          d="M30 135l1.9 3.8 4.2.6-3 3 .7 4.1-3.8-2-3.8 2 .7-4.1-3-3 4.2-.6z"
          className="fill-ice"
        />
        <text
          x="42"
          y="139"
          className="fill-ink font-sans text-[8px] font-bold"
        >
          4.9 rating
        </text>
        <text x="42" y="149" className="fill-slate font-sans text-[7px]">
          On both stores
        </text>
      </g>
    </>
  );
}

const STEPS = [
  { x: 20, label: "Request" },
  { x: 124, label: "Approve" },
  { x: 228, label: "Report" },
] as const;

function SystemsDrawing({ shadow }: DrawingProps) {
  return (
    <>
      {STEPS.map(({ x, label }, index) => (
        <g key={label}>
          <rect
            x={x}
            y="66"
            width="72"
            height="72"
            rx="16"
            filter={shadow}
            className={index === 1 ? "fill-blue" : "fill-white stroke-rule"}
          />
          <text
            x={x + 36}
            y="158"
            textAnchor="middle"
            className="fill-slate font-sans text-[8.5px] font-semibold"
          >
            {label}
          </text>
        </g>
      ))}

      <rect
        x="34"
        y="82"
        width="44"
        height="7"
        rx="3.5"
        className="fill-mist"
      />
      <rect
        x="34"
        y="95"
        width="44"
        height="7"
        rx="3.5"
        className="fill-mist"
      />
      <rect
        x="34"
        y="108"
        width="30"
        height="7"
        rx="3.5"
        className="fill-mist"
      />
      <rect
        x="34"
        y="121"
        width="22"
        height="7"
        rx="3.5"
        className="fill-ice"
      />

      <circle cx="160" cy="102" r="18" className="fill-white/15" />
      <path
        d="M151 102l6 6 12-13"
        fill="none"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-white"
      />

      <line x1="242" y1="124" x2="286" y2="124" className="stroke-rule" />
      {[
        [244, 14],
        [255, 24],
        [266, 18],
        [277, 34],
      ].map(([x, height], index) => (
        <rect
          key={x}
          x={x}
          y={124 - height}
          width="7"
          height={height}
          rx="2"
          className={index === 3 ? "fill-blue" : "fill-ice/70"}
        />
      ))}

      {[92, 196].map((x) => (
        <g key={x}>
          <path
            d={`M${x + 4} 102h22`}
            strokeWidth="1.6"
            strokeLinecap="round"
            className="service-flow stroke-blue"
          />
          <path
            d={`M${x + 24} 98l4 4-4 4`}
            fill="none"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="stroke-blue"
          />
        </g>
      ))}

      <g className={`${FLOAT} motion-safe:group-hover:-translate-y-2`}>
        <rect
          x="104"
          y="18"
          width="112"
          height="28"
          rx="14"
          filter={shadow}
          className="fill-white stroke-rule"
        />
        <text
          x="160"
          y="35.5"
          textAnchor="middle"
          className="fill-ink font-sans text-[8.5px] font-bold"
        >
          Saves 12 hours a week
        </text>
      </g>
    </>
  );
}

const UPTIME_BARS = Array.from({ length: 30 }, (_, index) => index);

function CloudDrawing({ shadow }: DrawingProps) {
  return (
    <>
      <rect
        x="26"
        y="28"
        width="268"
        height="150"
        rx="14"
        filter={shadow}
        className="fill-white stroke-rule"
      />
      <circle cx="46" cy="50" r="4" className="service-pulse fill-blue/40" />
      <circle cx="46" cy="50" r="4" className="fill-blue" />
      <text x="56" y="53" className="fill-ink font-sans text-[8.5px] font-bold">
        All systems online
      </text>

      <text x="42" y="92" className="fill-ink font-display text-[30px]">
        99.98%
      </text>
      <text x="42" y="105" className="fill-slate font-sans text-[7.5px]">
        Uptime over the last 30 days
      </text>
      {UPTIME_BARS.map((index) => (
        <rect
          key={index}
          x={42 + index * 7.6}
          y="114"
          width="5"
          height="22"
          rx="2.5"
          className={index === 19 ? "fill-rule" : "fill-ice/70"}
        />
      ))}
      <line x1="42" y1="148" x2="278" y2="148" className="stroke-rule" />
      {[
        [42, "Daily backups"],
        [126, "Security updates"],
        [218, "Always watched"],
      ].map(([x, label]) => (
        <g key={label}>
          <circle cx={Number(x) + 4} cy="163" r="4" className="fill-ice-wash" />
          <path
            d={`M${Number(x) + 2.2} 163l1.3 1.3 2.4-2.6`}
            fill="none"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="stroke-blue"
          />
          <text
            x={Number(x) + 12}
            y="165.5"
            className="fill-slate font-sans text-[7.5px]"
          >
            {label}
          </text>
        </g>
      ))}

      <g className={`${FLOAT} motion-safe:group-hover:-translate-y-2`}>
        <rect
          x="236"
          y="8"
          width="62"
          height="46"
          rx="14"
          filter={shadow}
          className="fill-blue"
        />
        <path
          d="M257 38h20a6 6 0 0 0 0-12 8 8 0 0 0-15-2 5.5 5.5 0 0 0-5 14z"
          className="fill-white"
        />
      </g>
    </>
  );
}

const DRAWINGS: Record<
  ServiceVisualKind,
  (props: DrawingProps) => React.JSX.Element
> = {
  website: WebsiteDrawing,
  mobile: MobileDrawing,
  systems: SystemsDrawing,
  cloud: CloudDrawing,
};

function IconVisual({ service }: ServiceVisualProps) {
  const Icon = service.icon ?? Layers;

  return (
    <div
      aria-hidden="true"
      className="relative flex h-full items-center justify-center"
    >
      <span className="absolute h-44 w-44 rounded-full border border-ice/30" />
      <span className="absolute h-30 w-30 rounded-full border border-ice/50" />
      <span
        className={`${FLOAT} relative flex h-18 w-18 items-center justify-center rounded-[22px] border border-rule bg-white text-blue shadow-[0_14px_30px_-16px_rgb(21_40_64/0.35)] motion-safe:group-hover:-translate-y-1.5`}
      >
        {service.iconUrl ? (
          <img
            src={service.iconUrl}
            alt=""
            className="h-8 w-8 object-contain"
          />
        ) : (
          <Icon size={30} />
        )}
      </span>
    </div>
  );
}

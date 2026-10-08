import type { CSSProperties } from "react";

export type SnowflakeVariant = "simple" | "branched" | "star";

interface SnowflakeIconProps {
  readonly variant?: SnowflakeVariant;
  readonly size?: number;
  readonly strokeWidth?: number;
  readonly className?: string;
  readonly style?: CSSProperties;
}

const ARM_ANGLES = [0, 60, 120, 180, 240, 300] as const;

/** One arm, pointing up from the centre (12, 12); the six arms are this path rotated. */
const ARMS: Record<SnowflakeVariant, string> = {
  simple: "M12 12V2.8M9.6 4.6 12 7l2.4-2.4",
  branched: "M12 12V2.5M10.2 4 12 5.8 13.8 4M9.4 7 12 9.6 14.6 7",
  star: "M12 9.4V3M10.6 4.2 12 5.6l1.4-1.4",
};

/** A six-armed snowflake in `currentColor`, drawn with rounded strokes. */
export default function SnowflakeIcon({
  variant = "simple",
  size = 24,
  strokeWidth = 1.7,
  className = "",
  style,
}: SnowflakeIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
      style={style}
    >
      <g
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {ARM_ANGLES.map((angle) => (
          <path
            key={angle}
            d={ARMS[variant]}
            transform={`rotate(${angle} 12 12)`}
          />
        ))}
        {variant === "star" && (
          <path d="M12 9.4 14.25 10.7v2.6L12 14.6l-2.25-1.3v-2.6z" />
        )}
      </g>
    </svg>
  );
}

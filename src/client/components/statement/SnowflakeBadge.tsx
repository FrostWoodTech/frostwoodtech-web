import SnowflakeIcon from "@/client/components/ui/SnowflakeIcon";

/** A simple white snowflake on a light ice-blue circle. */
export default function SnowflakeBadge() {
  return (
    <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-ice to-[#4f8fd9] text-white shadow-[0_0_0_5px_rgb(125_183_255/0.18),0_14px_28px_-12px_rgb(36_100_165/0.6)]">
      {/* A soft highlight on the upper half, like light on ice. */}
      <span className="absolute inset-x-2 top-1 h-1/2 rounded-full bg-linear-to-b from-white/45 to-transparent" />
      <SnowflakeIcon size={28} className="relative" />
    </span>
  );
}

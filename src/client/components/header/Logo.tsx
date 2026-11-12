import { Link } from "react-router-dom";
import { BRAND } from "@/client/data/navigation";

interface LogoProps {
  readonly size?: "sm" | "md";
  readonly className?: string;
}

const MARK_SIZE: Record<"sm" | "md", number> = { sm: 30, md: 34 };
const TEXT_CLASSES: Record<"sm" | "md", string> = {
  sm: "text-[18px]",
  md: "text-[20px]",
};

export default function Logo({ size = "md", className = "" }: LogoProps) {
  return (
    <Link
      to="/"
      className={`flex shrink-0 items-center gap-2.5 ${className}`}
      aria-label={`${BRAND.name} — home`}
    >
      <img
        src="/images/brand/logo-mark.webp"
        alt=""
        width={MARK_SIZE[size]}
        height={MARK_SIZE[size]}
        className="shrink-0"
      />

      <span
        className={`font-bold tracking-[-0.04em] text-ink ${TEXT_CLASSES[size]}`}
      >
        {BRAND.name}
      </span>
    </Link>
  );
}

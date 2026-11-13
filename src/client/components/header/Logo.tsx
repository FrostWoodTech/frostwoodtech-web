import { Link } from "react-router-dom";
import { SITE } from "@/client/data/site";

type LogoTone = "light" | "dark";

const TEXT_TONE: Record<LogoTone, string> = {
  light: "text-ink",
  dark: "text-white",
};

/** `tone` is the background it sits on: "dark" renders the wordmark in white. */
export default function Logo({
  tone = "light",
  onClick,
}: {
  readonly tone?: LogoTone;
  readonly onClick?: () => void;
}) {
  return (
    <Link
      to="/"
      onClick={onClick}
      className="flex shrink-0 items-center gap-2.5 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue"
      aria-label={`${SITE.name} — home`}
    >
      <img
        src="/images/brand/logo-mark.webp"
        alt=""
        width={32}
        height={32}
        className="shrink-0"
      />
      <span
        className={`text-[19px] font-extrabold tracking-[-0.04em] ${TEXT_TONE[tone]}`}
      >
        {SITE.name}
      </span>
    </Link>
  );
}

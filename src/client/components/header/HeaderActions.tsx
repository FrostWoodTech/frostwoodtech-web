import { Link } from "react-router-dom";

export default function HeaderActions() {
  return (
    <Link
      to="/contact"
      className="hidden h-12 shrink-0 items-center rounded-full bg-ink px-6 text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-blue focus:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 lg:inline-flex"
    >
      Talk to us
    </Link>
  );
}

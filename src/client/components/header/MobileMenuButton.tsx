import { Menu, X } from "lucide-react";

interface MobileMenuButtonProps {
  readonly isOpen: boolean;
  readonly onToggle: () => void;
}

export default function MobileMenuButton({
  isOpen,
  onToggle,
}: MobileMenuButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-ink transition-colors duration-200 hover:bg-mist focus:outline-none focus-visible:ring-2 focus-visible:ring-blue lg:hidden"
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
    >
      {isOpen ? (
        <X size={22} aria-hidden="true" />
      ) : (
        <Menu size={22} aria-hidden="true" />
      )}
    </button>
  );
}

import { useState, useEffect, useCallback } from "react";
import Logo from "./Logo";
import DesktopNav from "./DesktopNav";
import HeaderActions from "./HeaderActions";
import MobileMenuButton from "./MobileMenuButton";
import MobileNav from "./MobileNav";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleToggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const handleCloseMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <header className="sticky top-0 z-50 px-4 pt-3 sm:px-6 sm:pt-4 lg:px-8">
      <div
        data-scrolled={isScrolled || undefined}
        className="glass-bar mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 rounded-full pr-2.5 pl-5 sm:pl-6 lg:h-18 lg:pr-3 lg:pl-7"
      >
        <Logo />

        <div className="flex items-center gap-6 xl:gap-9">
          <DesktopNav />
          <HeaderActions />
          <MobileMenuButton
            isOpen={isMobileMenuOpen}
            onToggle={handleToggleMobileMenu}
          />
        </div>
      </div>

      <MobileNav isOpen={isMobileMenuOpen} onClose={handleCloseMobileMenu} />
    </header>
  );
}

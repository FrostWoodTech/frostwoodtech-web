import type { ReactNode } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { EASE } from "./presets";

/**
 * Page content fades up on every route change, and a dark curtain lifts off the screen after a
 * link click. The first load and back/forward ("POP") skip the curtain; the hero has its own entrance.
 */
export function PageTransition({ children }: { readonly children: ReactNode }) {
  const { pathname } = useLocation();
  const showCurtain = useNavigationType() !== "POP";

  return (
    <>
      <AnimatePresence>
        {showCurtain && (
          <motion.div
            key={pathname}
            aria-hidden="true"
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            transition={{ duration: 0.75, ease: EASE, delay: 0.05 }}
            className="pointer-events-none fixed inset-0 z-60 origin-top bg-ink"
          />
        )}
      </AnimatePresence>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE, delay: showCurtain ? 0.2 : 0 }}
      >
        {children}
      </motion.div>
    </>
  );
}

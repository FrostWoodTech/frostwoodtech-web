import { useId, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { EASE } from "./presets";

/**
 * One disclosure row whose panel opens and closes with a height animation (native `<details>`
 * can't animate). `summary` gets the open state so it can style its own +/× icon.
 */
export default function AccordionItem({
  summary,
  children,
  defaultOpen = false,
  className = "",
  buttonClassName = "",
}: {
  readonly summary: (open: boolean) => ReactNode;
  readonly children: ReactNode;
  readonly defaultOpen?: boolean;
  readonly className?: string;
  readonly buttonClassName?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <div className={className}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className={`group w-full cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue ${buttonClassName}`}
      >
        {summary(open)}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

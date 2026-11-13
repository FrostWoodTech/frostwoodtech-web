import { motion } from "motion/react";
import { FaWhatsapp } from "react-icons/fa";
import { EASE } from "@/client/components/motion/presets";
import { SITE } from "@/client/data/site";

/** Floating button that opens a WhatsApp chat with the first number in `SITE.phones`. */
export default function WhatsAppChat() {
  const [phone] = SITE.phones;
  const href = `${phone.whatsapp}?text=${encodeURIComponent(SITE.whatsappGreeting)}`;

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat on WhatsApp with ${phone.display}`}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.2, duration: 0.5, ease: EASE }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.95 }}
      className="fixed right-4 bottom-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_-8px_rgba(37,211,102,0.7)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 sm:right-6 sm:bottom-6"
    >
      <FaWhatsapp aria-hidden="true" className="h-7 w-7" />
    </motion.a>
  );
}

import {
  CalendarCheck,
  MessagesSquare,
  PackageCheck,
  type LucideIcon,
} from "lucide-react";
import type { ProductScreenKind } from "@/client/types";

/** The notification floating beside each drawing. */
export const SCREEN_TOASTS: Record<
  ProductScreenKind,
  { readonly title: string; readonly detail: string; readonly icon: LucideIcon }
> = {
  bookings: {
    title: "Booking confirmed",
    detail: "Tue 13 May, 10:30",
    icon: CalendarCheck,
  },
  inventory: {
    title: "Reorder sent",
    detail: "200 paper cups on the way",
    icon: PackageCheck,
  },
  support: {
    title: "Replied in 2 minutes",
    detail: "Maya marked it solved",
    icon: MessagesSquare,
  },
};

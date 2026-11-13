import { CalendarCheck, CarFront, Ticket, type LucideIcon } from "lucide-react";
import type { ProjectScreenKind } from "@/client/types";

/** The notification floating beside each drawing. */
export const SCREEN_TOASTS: Record<
  ProjectScreenKind,
  { readonly title: string; readonly detail: string; readonly icon: LucideIcon }
> = {
  theatre: {
    title: "2 tickets booked",
    detail: "Row F · Seats 7 and 8",
    icon: Ticket,
  },
  people: {
    title: "Leave approved",
    detail: "Nadia · 2 days next week",
    icon: CalendarCheck,
  },
  transfers: {
    title: "Driver on the way",
    detail: "Pickup at Arrivals, 14:30",
    icon: CarFront,
  },
};

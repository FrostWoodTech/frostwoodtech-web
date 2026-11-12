import type { ApiProject } from "@/client/types";
import { TAGS } from "./tags";

// TODO: confirm years, clients and technologies, and add screenshots and results when available.
export const PROJECTS: readonly ApiProject[] = [
  {
    id: "project-theatre-booking",
    slug: "theatre-booking",
    title: "Theatre Booking",
    year: 2026,
    shortDescription: "Theatre tickets, from seats to checkout",
    description:
      "Choose a film and showtime, select your seats, pay online and receive your digital ticket.",
    problem:
      "Selling tickets by phone and at the door meant queues, double-booked seats and no clear view of what had sold.",
    solution:
      "One booking system where audiences pick a showtime, choose their seats on a live seat map and pay online, while the theatre manages shows, audiences and payments in one place.",
    whatWeDelivered:
      "- Weekly showtime schedule\n- Live seat selection\n- Online payments\n- Digital tickets\n- Audience and payment management",
    publishedAt: "2026-09-01T00:00:00Z",
    featured: true,
    sortOrder: 0,
    tags: [TAGS.ticketing, TAGS.booking],
    images: [],
  },
  {
    id: "project-teamora",
    slug: "teamora",
    title: "Teamora",
    year: 2026,
    shortDescription: "Your people. One connected workspace.",
    description:
      "Keep employee records, attendance and leave requests together in one employee management system.",
    problem:
      "Employee details, attendance and leave lived in separate spreadsheets and email threads, so nobody had the full picture.",
    solution:
      "One workspace with an employee directory, attendance records and leave requests, so managers and staff see the same up-to-date information.",
    whatWeDelivered:
      "- Employee directory\n- Attendance records\n- Leave requests and approvals\n- Team information",
    publishedAt: "2026-08-01T00:00:00Z",
    featured: true,
    sortOrder: 1,
    tags: [TAGS.hr, TAGS.system],
    images: [],
  },
  {
    id: "project-aurora",
    slug: "aurora",
    title: "Aurora",
    year: 2026,
    shortDescription: "Airport transfers, clearly organised",
    description:
      "Book a vehicle from the airport to your hotel, with pickup details, passenger information and a clear confirmation.",
    problem:
      "Transfer requests arrived by phone and message, which made pickups easy to miss and hard to plan.",
    solution:
      "A booking system for airport pickups, hotel transfers and return trips, with every transfer scheduled and tracked in one overview.",
    whatWeDelivered:
      "- Airport pickup and hotel transfer booking\n- Vehicle requests\n- Passenger details\n- Booking confirmations\n- Upcoming and completed transfers",
    publishedAt: "2026-07-01T00:00:00Z",
    featured: true,
    sortOrder: 2,
    tags: [TAGS.transport, TAGS.booking],
    images: [],
  },
];

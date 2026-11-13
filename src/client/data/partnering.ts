import { KeyRound, ReceiptText, Rocket, Sprout } from "lucide-react";
import type { PartneringData } from "@/client/types";

export const PARTNERING_DATA: PartneringData = {
  eyebrow: "What you get",
  items: [
    {
      id: "launch",
      label: "Launch faster",
      title: "Go live in weeks, not months",
      description:
        "We plan, design and build in short, focused stages, so a working product is in front of your customers in about six weeks.",
      icon: Rocket,
    },
    {
      id: "price",
      label: "Fixed price",
      title: "Know the cost before we start",
      description:
        "A written proposal with a fixed price within three working days. No hourly surprises, no hidden extras.",
      icon: ReceiptText,
    },
    {
      id: "ownership",
      label: "Yours to keep",
      title: "You own everything we build",
      description:
        "The code, the designs and the accounts are all yours. If you ever move on, you take it all with you.",
      icon: KeyRound,
    },
    {
      id: "growth",
      label: "Grows with you",
      title: "Software that grows with you",
      description:
        "Built on solid foundations and looked after by the same team, so new customers, features or locations never mean starting again.",
      icon: Sprout,
    },
  ],
} as const;

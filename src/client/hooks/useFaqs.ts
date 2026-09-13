import { useQuery } from "@tanstack/react-query";
import { getFaqs } from "@/client/services/faqsService";
import type { Site } from "@/client/types";

export function useFaqs(site?: Site) {
  return useQuery({
    queryKey: ["faqs", site],
    queryFn: ({ signal }) => getFaqs(site, signal),
  });
}

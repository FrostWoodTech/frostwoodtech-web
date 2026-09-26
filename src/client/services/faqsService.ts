import { httpClient } from "@/client/services/httpClient";
import type { ApiFaq, Site } from "@/client/types";

const SITE: Site = "agency";

/** General FAQs only; service FAQs come with `getService`. */
export async function getFaqs(
  site: Site = SITE,
  signal?: AbortSignal,
): Promise<readonly ApiFaq[]> {
  const { data } = await httpClient.get<readonly ApiFaq[]>("/public/faqs", {
    params: { site },
    signal,
  });
  return data;
}

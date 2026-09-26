import { httpClient } from "@/client/services/httpClient";
import type { ApiHome, Site } from "@/client/types";

const SITE: Site = "agency";

/** Every featured slice for the home page in one call. */
export async function getHome(
  site: Site = SITE,
  signal?: AbortSignal,
): Promise<ApiHome> {
  const { data } = await httpClient.get<ApiHome>("/public/home", {
    params: { site },
    signal,
  });
  return data;
}

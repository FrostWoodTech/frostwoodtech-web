import { httpClient } from "@/client/services/httpClient";
import { USE_STATIC_DATA, staticApi } from "@/client/services/staticApi";
import type { ApiHome, Site } from "@/client/types";

const SITE: Site = "agency";

/** Every featured slice for the home page in one call. */
export async function getHome(
  site: Site = SITE,
  signal?: AbortSignal,
): Promise<ApiHome> {
  if (USE_STATIC_DATA) return staticApi.getHome();
  const { data } = await httpClient.get<ApiHome>("/public/home", {
    params: { site },
    signal,
  });
  return data;
}

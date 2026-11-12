import { httpClient } from "@/client/services/httpClient";
import { USE_STATIC_DATA, staticApi } from "@/client/services/staticApi";
import type { SubmitContactPayload } from "@/client/types";

/** Rate-limited per IP server-side (403 `too_many_submissions`). */
export async function submitContact(
  payload: SubmitContactPayload,
): Promise<{ id: string }> {
  if (USE_STATIC_DATA) return staticApi.submit();
  const { data } = await httpClient.post<{ id: string }>(
    "/public/contact",
    payload,
  );
  return data;
}

import { httpClient } from "@/client/services/httpClient";
import type { SubmitContactPayload } from "@/client/types";

/** Rate-limited per IP server-side (403 `too_many_submissions`). */
export async function submitContact(
  payload: SubmitContactPayload,
): Promise<{ id: string }> {
  const { data } = await httpClient.post<{ id: string }>(
    "/public/contact",
    payload,
  );
  return data;
}

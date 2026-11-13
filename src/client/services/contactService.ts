import ApiError from "@/client/services/ApiError";
import type { SubmitContactPayload } from "@/client/types";

/** `api/contact.ts` (Vercel function). Error text from it is safe to show visitors. */
export async function submitContact(
  payload: SubmitContactPayload,
): Promise<{ id: string }> {
  let response: Response;
  try {
    response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    throw new ApiError(
      0,
      error instanceof Error ? error.message : "Network error",
    );
  }

  if (!response.ok) {
    const { error } = (await response.json().catch(() => ({}))) as {
      error?: string;
    };
    throw new ApiError(
      response.status,
      error ?? "That request couldn't be completed. Please try again.",
      error ? { detail: error } : undefined,
    );
  }
  return { id: "sent" };
}

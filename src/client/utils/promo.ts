/** True while `now` is within [startsAt, endsAt). Dates without a zone are read as local time. */
export function isWithinWindow(
  window: { readonly startsAt: string; readonly endsAt: string },
  now: Date = new Date(),
): boolean {
  const time = now.getTime();
  return (
    time >= new Date(window.startsAt).getTime() &&
    time < new Date(window.endsAt).getTime()
  );
}

/** Whole days left until `endsAt`, rounded up (so the last day counts as 1); 0 once it has passed. */
export function daysUntil(endsAt: string, now: Date = new Date()): number {
  const ms = new Date(endsAt).getTime() - now.getTime();
  return ms > 0 ? Math.ceil(ms / 86_400_000) : 0;
}

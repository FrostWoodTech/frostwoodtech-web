/** Up to two uppercase initials for an avatar ("maya reynolds" → "MR"), or "?" for a blank name. */
export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part.charAt(0).toUpperCase()).join("") || "?";
}

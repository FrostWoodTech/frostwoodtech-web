/** Two-digit, one-based index for numbered lists: 0 → "01". */
export const pad = (index: number) => String(index + 1).padStart(2, "0");

/**
 * The items of a markdown bullet list ("- **Design** that fits") as plain text, bold markers
 * removed. Lines that aren't bullets are skipped; API fields like `outcomes` use this shape.
 */
export function markdownBullets(markdown?: string): string[] {
  if (!markdown) return [];
  return markdown
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /^[-*]\s+/.test(line))
    .map((line) =>
      line
        .replace(/^[-*]\s+/, "")
        .replace(/\*\*(.+?)\*\*/g, "$1")
        .trim(),
    )
    .filter(Boolean);
}

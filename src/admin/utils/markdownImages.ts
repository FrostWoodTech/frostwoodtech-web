/** Matches `![alt](url "optional title")`, capturing the url. */
const IMAGE_PATTERN =
  /!\[[^\]]*\]\(\s*<?([^)\s>]+)>?(?:\s+["'][^"']*["'])?\s*\)/g;

/** A `media://` token, or a legacy absolute http(s) URL. */
function isUsableImageReference(reference: string): boolean {
  return (
    /^https?:\/\//i.test(reference) || /^media:\/\/[\w\-./]+$/.test(reference)
  );
}

/** Usable image references in order, without duplicates. */
export function extractMarkdownImages(markdown: string | undefined): string[] {
  if (!markdown) return [];

  const references = [...markdown.matchAll(IMAGE_PATTERN)]
    .map((match) => match[1])
    .filter(isUsableImageReference);

  return [...new Set(references)];
}

export function imageMarkdown(reference: string, altText: string): string {
  return `![${altText}](${reference})`;
}

const MEDIA_TOKEN_PREFIX = "media://";

/** Makes a reference loadable. Returns `undefined` for a token until `mediaBaseUrl` has loaded. */
export function resolveMediaDisplayUrl(
  reference: string,
  mediaBaseUrl: string | undefined,
): string | undefined {
  if (!reference.startsWith(MEDIA_TOKEN_PREFIX)) return reference;
  if (!mediaBaseUrl) return undefined;

  return `${mediaBaseUrl}/${reference.slice(MEDIA_TOKEN_PREFIX.length)}`;
}

export function altTextFromFileName(fileName: string): string {
  return fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .trim();
}

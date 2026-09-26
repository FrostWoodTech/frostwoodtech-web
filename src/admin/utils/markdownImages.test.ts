import { describe, expect, it } from "vitest";
import {
  altTextFromFileName,
  extractMarkdownImages,
  imageMarkdown,
  resolveMediaDisplayUrl,
} from "@/admin/utils/markdownImages";

describe("extractMarkdownImages", () => {
  it("returns an empty list for missing or image-free markdown", () => {
    expect(extractMarkdownImages(undefined)).toEqual([]);
    expect(extractMarkdownImages("")).toEqual([]);
    expect(
      extractMarkdownImages("Just [a link](https://example.com)."),
    ).toEqual([]);
  });

  it("extracts media:// tokens and absolute URLs in order", () => {
    const markdown = [
      "![first](media://articles/a.webp)",
      "text",
      "![second](https://cdn.example.com/b.png)",
    ].join("\n");
    expect(extractMarkdownImages(markdown)).toEqual([
      "media://articles/a.webp",
      "https://cdn.example.com/b.png",
    ]);
  });

  it("handles titles, angle brackets and padding", () => {
    const markdown = [
      '![a](media://x/a.png "A title")',
      "![b](<https://example.com/b.png>)",
      "![c](  media://x/c.png  )",
    ].join(" ");
    expect(extractMarkdownImages(markdown)).toEqual([
      "media://x/a.png",
      "https://example.com/b.png",
      "media://x/c.png",
    ]);
  });

  it("removes duplicates", () => {
    const markdown = "![a](media://x/a.png) ![again](media://x/a.png)";
    expect(extractMarkdownImages(markdown)).toEqual(["media://x/a.png"]);
  });

  it("ignores references that would render as broken images", () => {
    const markdown = [
      "![rel](/images/local.png)",
      "![data](data:image/png;base64,AAAA)",
      "![bad token](media://has space.png)",
      "![ok](HTTPS://EXAMPLE.COM/ok.png)",
    ].join("\n");
    expect(extractMarkdownImages(markdown)).toEqual([
      "HTTPS://EXAMPLE.COM/ok.png",
    ]);
  });

  it("round-trips with imageMarkdown", () => {
    const markdown = imageMarkdown("media://uploads/photo.jpg", "A photo");
    expect(markdown).toBe("![A photo](media://uploads/photo.jpg)");
    expect(extractMarkdownImages(markdown)).toEqual([
      "media://uploads/photo.jpg",
    ]);
  });
});

describe("resolveMediaDisplayUrl", () => {
  it("passes legacy URLs through untouched", () => {
    expect(
      resolveMediaDisplayUrl("https://cdn.example.com/a.png", undefined),
    ).toBe("https://cdn.example.com/a.png");
  });

  it("swaps the media:// prefix for the base URL", () => {
    expect(
      resolveMediaDisplayUrl(
        "media://articles/a.webp",
        "https://media.frostwood.tech",
      ),
    ).toBe("https://media.frostwood.tech/articles/a.webp");
  });

  it("returns undefined for a token while the base URL hasn't loaded", () => {
    expect(
      resolveMediaDisplayUrl("media://articles/a.webp", undefined),
    ).toBeUndefined();
    expect(
      resolveMediaDisplayUrl("media://articles/a.webp", ""),
    ).toBeUndefined();
  });
});

describe("altTextFromFileName", () => {
  it.each([
    ["hero-image.png", "hero image"],
    ["team__photo_2024.final.jpg", "team photo 2024.final"],
    ["no-extension", "no extension"],
    ["-leading-.webp", "leading"],
  ])("%j -> %j", (fileName, expected) => {
    expect(altTextFromFileName(fileName)).toBe(expected);
  });
});

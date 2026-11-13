/** Linear-light RGB in 0..1 — the space shaders should mix colours in. */
export type LinearRgb = readonly [number, number, number];

/** sRGB transfer function (IEC 61966-2-1), one channel in 0..1. */
function srgbToLinear(channel: number): number {
  return channel <= 0.04045
    ? channel / 12.92
    : Math.pow((channel + 0.055) / 1.055, 2.4);
}

/** "#7DB7FF", "7db7ff" or "#fff" → linear RGB. Throws on anything else. */
export function hexToLinearRgb(hex: string): LinearRgb {
  const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!match) throw new Error(`Invalid hex colour: "${hex}"`);

  const digits =
    match[1].length === 3
      ? match[1]
          .split("")
          .map((digit) => digit + digit)
          .join("")
      : match[1];
  const value = parseInt(digits, 16);

  return [
    srgbToLinear(((value >> 16) & 255) / 255),
    srgbToLinear(((value >> 8) & 255) / 255),
    srgbToLinear((value & 255) / 255),
  ];
}

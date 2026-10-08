/** Precision, sRGB/luminance helpers, hashing and gradient noise for GLSL ES 3.00 shaders. */
export const GLSL_COMMON = `
precision highp float;
precision highp int;

// Exact sRGB transfer curves, matching hexToLinearRgb() on the TypeScript side.
vec3 toLinear(vec3 c) {
  return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)), step(0.04045, c));
}

vec3 toSrgb(vec3 c) {
  c = clamp(c, 0.0, 1.0);
  return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
}

// WCAG relative luminance of a linear colour.
float luminance(vec3 c) {
  return dot(c, vec3(0.2126, 0.7152, 0.0722));
}

// Contrast guard: anything darker than floorLum is lifted toward white until it sits exactly on
// the floor, so text on top keeps its contrast whatever the glows or frost do.
vec3 contrastGuard(vec3 c, float floorLum) {
  float lum = luminance(c);
  if (lum >= floorLum) return c;
  return mix(c, vec3(1.0), (floorLum - lum) / max(1.0 - lum, 1e-4));
}

// PCG-style integer hash (Jarzynski & Olano 2020): identical on every GPU, unlike sin() hashes.
uvec2 pcg2d(uvec2 v) {
  v = v * 1664525u + 1013904223u;
  v.x += v.y * 1664525u;
  v.y += v.x * 1664525u;
  v ^= v >> 16u;
  v.x += v.y * 1664525u;
  v.y += v.x * 1664525u;
  v ^= v >> 16u;
  return v;
}

vec2 hash22(vec2 cell) {
  return vec2(pcg2d(uvec2(ivec2(floor(cell))))) * (1.0 / 4294967295.0);
}

float hash12(vec2 cell) {
  return hash22(cell).x;
}

vec2 gradientAt(vec2 cell) {
  float angle = hash12(cell) * 6.2831853;
  return vec2(cos(angle), sin(angle));
}

// Gradient (Perlin-style) noise, roughly -1..1.
float gradientNoise(vec2 p) {
  vec2 cell = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);

  float a = dot(gradientAt(cell), f);
  float b = dot(gradientAt(cell + vec2(1.0, 0.0)), f - vec2(1.0, 0.0));
  float c = dot(gradientAt(cell + vec2(0.0, 1.0)), f - vec2(0.0, 1.0));
  float d = dot(gradientAt(cell + vec2(1.0, 1.0)), f - vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y) * 1.414;
}

// Each octave is rotated so the layers never line up into a visible grid.
const mat2 OCTAVE_ROTATION = mat2(0.8, -0.6, 0.6, 0.8);

// Fractal noise, 0..1: soft, cloudy variation.
float fbm(vec2 p) {
  float sum = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 5; i++) {
    sum += amplitude * gradientNoise(p);
    p = OCTAVE_ROTATION * p * 2.03 + 17.17;
    amplitude *= 0.5;
  }
  return 0.5 + 0.5 * sum;
}
`;

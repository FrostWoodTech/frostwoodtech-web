import { GLSL_COMMON } from "@/client/lib/glslCommon";

/**
 * GLSL ES 3.00 (WebGL2) sources for the ice background. The picture is still: it's painted once,
 * and again only when the viewport size changes, so the heavy procedural noise costs nothing
 * after load.
 */

/** Frosted ice in light, painted straight to the canvas. */
export const SCENE_FRAG = `#version 300 es
${GLSL_COMMON}
uniform vec2 uCssSize;        // viewport in CSS px
uniform vec3 uSnow;           // palette, all linear RGB
uniform vec3 uWash;
uniform vec3 uIce;
uniform vec3 uCyan;
uniform vec3 uNavy;
uniform float uGlowStrength;
uniform float uNavyDepth;
uniform float uFrostDetail;
uniform float uMinLuminance;
uniform float uSeed;

in vec2 vUv;
out vec4 outColor;

// Ridged fractal noise: sharp crests where the noise crosses zero, which read as frost veins.
float ridged(vec2 p) {
  float sum = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 5; i++) {
    float crest = 1.0 - abs(gradientNoise(p));
    sum += amplitude * crest * crest;
    p = OCTAVE_ROTATION * p * 2.11 + 9.31;
    amplitude *= 0.5;
  }
  return sum;
}

// Distance to the nearest Voronoi cell border (0 on a border): cracks between ice plates.
float plateBorder(vec2 p) {
  vec2 cell = floor(p);
  vec2 f = fract(p);
  float nearest = 8.0;
  float second = 8.0;
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 offset = vec2(float(x), float(y));
      vec2 toPoint = offset + hash22(cell + offset) - f;
      float d = dot(toPoint, toPoint);
      if (d < nearest) {
        second = nearest;
        nearest = d;
      } else if (d < second) {
        second = d;
      }
    }
  }
  return sqrt(second) - sqrt(nearest);
}

// Soft pool of light: 1 at the centre, gone by ~radius.
float glow(vec2 point, vec2 centre, float radius) {
  float d = length(point - centre) / radius;
  return exp(-d * d * 2.2);
}

// A line of light, Gaussian across its width.
float lightLine(float offset, float width) {
  float t = offset / width;
  return exp(-t * t);
}

void main() {
  // Screen space with y pointing down, so positions read like CSS.
  vec2 uv = vec2(vUv.x, 1.0 - vUv.y);
  float shortSide = min(uCssSize.x, uCssSize.y);
  // m: layout units, 1 = the viewport's shorter side (placement of glows and streaks).
  vec2 m = uv * uCssSize / shortSide;
  vec2 corner = uCssSize / shortSide;
  // p: pattern units, 1 = 900 CSS px, so frost keeps its physical size on any screen.
  vec2 p = uv * uCssSize / 900.0;
  vec2 seed = vec2(uSeed * 13.17, uSeed * 7.31);

  // Domain warp: bends every layer below so nothing looks geometric.
  vec2 warp = vec2(fbm(p * 1.4 + seed), fbm(p * 1.4 + seed + 31.7)) - 0.5;
  vec2 mw = m + warp * 0.3;
  vec2 pw = p + warp * 0.3;

  // 1. Base: snow in the top-left easing into pale ice wash towards the bottom-right.
  vec3 col = mix(uSnow, uWash, smoothstep(0.15, 1.0, dot(uv, vec2(0.55, 0.45))));

  // 2. Light glowing up through the ice, plus a hint of navy depth in the far corner.
  col = mix(col, uIce, glow(mw, corner * vec2(0.94, 0.04), 0.85) * uGlowStrength);
  col = mix(col, uIce, glow(mw, corner * vec2(0.96, 1.0), 0.8) * uGlowStrength * 0.85);
  col = mix(col, uCyan, glow(mw, corner * vec2(0.02, 0.96), 0.7) * uGlowStrength * 0.9);
  col = mix(col, uNavy, glow(mw, corner * 1.04, 0.45) * uNavyDepth);

  // 3. Frost clouds: milky patches that only ever brighten.
  col = mix(col, uSnow, smoothstep(0.52, 0.85, fbm(pw * 2.2 + seed + 4.0)) * 0.5);

  // 4. Window frost growing in from the edges, leaving the middle calm for text.
  vec2 fromEdge = min(uv, 1.0 - uv) * uCssSize / shortSide;
  float ragged = (fbm(pw * 3.0 + seed + 9.0) - 0.5) * 0.3;
  float frost = (1.0 - smoothstep(0.03, 0.4, min(fromEdge.x, fromEdge.y) + ragged)) * uFrostDetail;

  //    Crystal veins: ridged-noise crests, embossed against the top-left light so they catch it.
  vec2 veinPoint = pw * 6.5 + seed;
  float crest = ridged(veinPoint);
  float emboss = clamp((crest - ridged(veinPoint - vec2(0.012))) * 4.0, -1.0, 1.0);
  col = mix(col, vec3(1.0), smoothstep(0.62, 0.9, crest) * 0.6 * frost);
  col += vec3(0.82, 0.92, 1.0) * max(emboss, 0.0) * 0.16 * frost;
  col *= 1.0 - max(-emboss, 0.0) * 0.07 * frost;

  //    Ice plates: faint bright cracks, strongest where the frost is.
  float crack = 1.0 - smoothstep(0.0, 0.03, plateBorder(pw * 4.2 + seed));
  col = mix(col, vec3(1.0), crack * 0.4 * mix(0.2, 1.0, frost) * uFrostDetail);

  //    Frost specks: tiny ice-blue crystals.
  float speck = step(1.0 - 0.006 * frost, hash12(floor(uv * uCssSize / 1.5) + 101.0));
  col = mix(col, uIce, speck * 0.22);

  // 5. Refraction streaks at 60° (the brand's frost-cut angle), upper right and lower left.
  //    s runs 0 at the top-left corner to 1 at the bottom-right, across the streaks.
  vec2 across = vec2(0.866, 0.5);
  vec2 along = vec2(0.5, -0.866);
  float s = dot(mw, across) / dot(corner, across);
  float broken = smoothstep(0.35, 0.75, fbm(vec2(dot(mw, along) * 1.8, s * 6.0) + seed + 2.0));
  float streaks = lightLine(s - 0.6, 0.07) * 0.22
    + lightLine(s - 0.645, 0.0024) * 0.55 * broken
    + lightLine(s - 0.672, 0.0016) * 0.4 * broken
    + lightLine(s - 0.3, 0.06) * 0.16
    + lightLine(s - 0.33, 0.002) * 0.4 * broken;
  col = mix(col, vec3(1.0), clamp(streaks, 0.0, 1.0));

  // 6. Keep every pixel light enough for text. ±½ LSB of noise hides 8-bit banding in the very
  //    soft gradients.
  vec3 encoded = toSrgb(contrastGuard(col, uMinLuminance));
  outColor = vec4(encoded + (hash12(gl_FragCoord.xy) - 0.5) / 255.0, 1.0);
}
`;

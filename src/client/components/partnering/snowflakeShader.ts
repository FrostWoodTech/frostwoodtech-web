import { GLSL_COMMON } from "@/client/lib/glslCommon";

/**
 * An ice crystal drawn as a 2D signed-distance shape and finished as solid glass: rounded,
 * see-through rods with Fresnel edges, moving highlights, light-facing rims, a refraction line,
 * crisp 60° streaks and a soft blue shadow. Output is premultiplied alpha.
 */
export const SNOWFLAKE_FRAG = `#version 300 es
${GLSL_COMMON}
uniform vec2 uResolution;   // canvas size in device px (square)
uniform float uTime;        // seconds; drives the sparkle twinkle
uniform vec3 uLight;        // unit light direction, slowly orbiting (GL axes, +z toward viewer)

in vec2 vUv;
out vec4 outColor;

const float SIN60 = 0.8660254;
// Normal of the hexagon edge next to an arm, in the folded wedge.
const vec2 EDGE_NORMAL = vec2(SIN60, 0.5);
const vec2 BRANCH_DIR = vec2(0.5, SIN60);
// Where the arms leave the centre plate; shorter arms are scaled about this point.
const float ARM_ROOT = 0.2;
// Side branches on a full-length arm: position along the spine, length, half-width. Each length
// stays well below its position, which keeps the branch inside its 30° wedge (no folding seams).
const vec3 BRANCHES[5] = vec3[5](
  vec3(0.30, 0.16, 0.031),
  vec3(0.42, 0.26, 0.029),
  vec3(0.55, 0.27, 0.026),
  vec3(0.67, 0.21, 0.023),
  vec3(0.78, 0.12, 0.019)
);
// Real snowflakes are never perfect: each arm grows to its own length (index = arm,
// counter-clockwise from the right-hand one).
const float ARM_LENGTH[6] = float[6](0.96, 0.92, 1.0, 0.86, 1.0, 0.88);
const float BEVEL = 0.014;
const float RIDGE = 0.007;

// 1. Fold the plane onto one half-arm: the arm runs along +x and the wedge covers 0–30°.
//    arm (0–5, counter-clockwise from the right) and side (0 above the spine, 1 below) record
//    which half-arm the point came from, so each one can grow differently.
vec2 foldToArm(vec2 p, out int arm, out int side) {
  float sector = 1.0471976;
  float angle = atan(p.y, p.x);
  float nearest = floor(angle / sector + 0.5);
  float local = angle - nearest * sector;
  arm = int(mod(nearest + 6.0, 6.0) + 0.5) % 6;
  side = local < 0.0 ? 1 : 0;
  local = abs(local);
  return length(p) * vec2(cos(local), sin(local));
}

float segmentDistance(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h);
}

// Distance to a segment whose half-width tapers from ra to rb.
float taperedSegment(vec2 p, vec2 a, vec2 b, float ra, float rb) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h) - mix(ra, rb, h);
}

// Hexagon with corners on the x-axis (inigo quilez's exact SDF), apothem a.
float hexagon(vec2 p, float a) {
  const vec3 k = vec3(-SIN60, 0.5, 0.57735027);
  p = abs(p);
  p -= 2.0 * min(dot(k.xy, p), 0.0) * k.xy;
  p -= vec2(clamp(p.x, -k.z * a, k.z * a), a);
  return length(p) * sign(p.y);
}

// Smooth union, so branches grow out of the spine instead of being glued on.
float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

// 2. One half-arm in the folded wedge: x = signed distance, y = distance to the centre lines
//    (where the raised ridges run). The centre plate and the ring are shared by every arm.
vec2 crystal(vec2 q, int arm, int side) {
  float d = dot(q, EDGE_NORMAL) - ARM_ROOT * SIN60;
  d = min(d, abs(dot(q, EDGE_NORMAL) - 0.31 * SIN60) - 0.008);

  float reach = ARM_LENGTH[arm];
  float tip = ARM_ROOT + (0.86 - ARM_ROOT) * reach;
  d = smin(d, hexagon(q - vec2(tip, 0.0), 0.055 * mix(0.85, 1.0, reach)), 0.012);
  d = smin(d, taperedSegment(q, vec2(0.12, 0.0), vec2(tip, 0.0), 0.042, 0.02), 0.014);
  float ridge = segmentDistance(q, vec2(0.0), vec2(tip + 0.05, 0.0));

  for (int i = 0; i < 5; i++) {
    vec3 branch = BRANCHES[i];
    // The two sides of an arm grow slightly different branches, as in a real crystal.
    float growth = 0.88 + 0.24 * hash12(vec2(float(arm * 2 + side), float(i)) + 11.0);
    float branchLength = branch.y * reach * growth;
    float width = branch.z * mix(0.8, 1.0, reach);
    vec2 start = vec2(ARM_ROOT + (branch.x - ARM_ROOT) * reach, 0.0);
    vec2 end = start + BRANCH_DIR * branchLength;
    d = smin(d, taperedSegment(q, start, end, width, width * 0.5), 0.01);
    ridge = min(ridge, segmentDistance(q, start, end));

    // Fern-like twigs, parallel to the spine, on the three longest branches.
    if (i >= 1 && i <= 3) {
      for (int j = 0; j < 2; j++) {
        float at = j == 0 ? 0.45 : 0.75;
        float twig = (j == 0 ? 0.075 : 0.05) * branchLength / 0.26;
        vec2 twigStart = start + BRANCH_DIR * branchLength * at;
        vec2 twigEnd = twigStart + vec2(twig, 0.0);
        d = smin(d, taperedSegment(q, twigStart, twigEnd, width * 0.6, width * 0.3), 0.007);
        ridge = min(ridge, segmentDistance(q, twigStart, twigEnd));
      }
    }
  }
  return vec2(d, ridge);
}

vec2 crystalAt(vec2 p) {
  int arm;
  int side;
  vec2 q = foldToArm(p, arm, side);
  return crystal(q, arm, side);
}

// 3. Ice thickness: a bevelled slab, raised along the centre lines, with growth rings engraved
//    in the centre plate.
float heightAt(vec2 p) {
  int arm;
  int side;
  vec2 q = foldToArm(p, arm, side);
  vec2 c = crystal(q, arm, side);
  float inside = -c.x;
  float h = smoothstep(0.0, BEVEL, inside);
  h += 0.55 * (1.0 - smoothstep(0.0, RIDGE, c.y)) * step(0.0, inside);

  float hexRadius = dot(q, EDGE_NORMAL) / SIN60;
  float ringOffset = abs(mod(hexRadius + 0.0275, 0.055) - 0.0275);
  float groove = 1.0 - smoothstep(0.0015, 0.005, ringOffset);
  h -= 0.35 * groove * step(0.03, hexRadius) * step(hexRadius, 0.19);
  return h;
}

void main() {
  float px = 2.0 / uResolution.y;
  vec2 p = (vUv - 0.5) * 2.0;
  vec2 shape = crystalAt(p);
  float d = shape.x;
  float coverage = 1.0 - smoothstep(-px, px, d);

  // Around the crystal, as on the header bar: a soft blue shadow below it (the shape sampled
  // a little higher) and a faint ice-blue outline hugging the edge.
  float shadowDistance = crystalAt(p + vec2(0.0, 0.035)).x;
  float shadow = exp(-max(shadowDistance, 0.0) / 0.03) * 0.12 * (1.0 - coverage);
  float outline = (1.0 - smoothstep(px * 0.5, px * 2.5, d)) * 0.45 * (1.0 - coverage);
  if (coverage <= 0.0 && shadow < 0.002 && outline <= 0.0) {
    outColor = vec4(0.0);
    return;
  }

  // Surface normal from the thickness slope (one-pixel central differences).
  float h = heightAt(p);
  vec2 e = vec2(px, 0.0);
  vec2 slope = vec2(
    heightAt(p + e.xy) - heightAt(p - e.xy),
    heightAt(p + e.yx) - heightAt(p - e.yx)
  ) / (2.0 * px);
  vec3 normal = normalize(vec3(-slope * 0.009, 1.0));

  // Which way the nearest edge faces, from the shape's distance gradient (+y = up).
  vec2 edgeFacing = normalize(vec2(
    crystalAt(p + e.xy).x - d,
    crystalAt(p + e.yx).x - d
  ) + 1e-6);

  // 4. Solid glass. Each arm, branch and twig is shaded like a rounded glass rod: across runs
  //    0 on its centre line to 1 at its edge, and the surface normal tilts outward with it.
  float inside = -d;
  float across = clamp(shape.y / max(shape.y + inside, 1e-4), 0.0, 1.0);
  vec3 rodNormal = vec3(edgeFacing * across * 0.9, sqrt(max(1.0 - across * across * 0.81, 0.0)));
  vec3 n = normalize(rodNormal + vec3(normal.xy, 0.0) * 0.6);

  // Fresnel: glass is clear where you look straight through it and denser, brighter at the
  // grazing edges.
  float fresnel = pow(1.0 - n.z, 1.6);
  float thick = clamp(h, 0.0, 1.6);
  float diagonal = clamp(dot(vec2(vUv.x, 1.0 - vUv.y), vec2(0.6, 0.8)) / 1.4, 0.0, 1.0);
  vec3 col = mix(vec3(0.94, 0.97, 1.0), vec3(0.76, 0.87, 1.0), diagonal);
  col = mix(col, vec3(0.42, 0.66, 0.96), fresnel * 0.7 + thick * 0.08);
  float alpha = 0.2 + fresnel * 0.6 + thick * 0.05;

  // Fine grain keeps it from looking like flat plastic.
  col += (hash12(gl_FragCoord.xy) - 0.5) * 0.025;

  // Highlights from the slowly moving light: a broad sheen and a crisp hot line on each rod.
  vec3 reflected = reflect(-uLight, n);
  float sheen = pow(max(reflected.z, 0.0), 10.0);
  float hotLine = pow(max(reflected.z, 0.0), 90.0);
  col = mix(col, vec3(1.0), sheen * 0.45);
  col += hotLine * 1.2;
  alpha += sheen * 0.15 + hotLine * 0.5;

  // A thin darker line just inside each edge, where light bends through the glass's thickness.
  float refractLine = smoothstep(px * 1.2, px * 2.2, inside) * (1.0 - smoothstep(px * 2.6, px * 4.0, inside));
  col = mix(col, vec3(0.2, 0.45, 0.78), refractLine * 0.55);
  alpha = max(alpha, refractLine * 0.6);

  // Crisp-edged reflection streaks at the 60° frost-cut angle, drifting with the light.
  float streakPos = dot(vec2(vUv.x, 1.0 - vUv.y), vec2(0.866, 0.5)) - sin(uTime * 0.15) * 0.18;
  float wideBand = smoothstep(0.6, 0.604, streakPos) * (1.0 - smoothstep(0.648, 0.652, streakPos));
  float thinBand = smoothstep(0.69, 0.692, streakPos) * (1.0 - smoothstep(0.698, 0.7, streakPos));
  col = mix(col, vec3(1.0), wideBand * 0.4 + thinBand * 0.6);
  alpha += (wideBand + thinBand) * 0.12;

  vec2 sparkleCell = floor(p * 70.0);
  float sparkleSeed = hash12(sparkleCell + 7.0);
  if (sparkleSeed > 0.982) {
    vec2 local = fract(p * 70.0) - 0.5;
    float falloff = max(0.0, 1.0 - length(local) * 2.0);
    float star = max(0.0, 1.0 - length(local) * 3.2) + max(0.0, 1.0 - abs(local.x * local.y) * 140.0) * 0.4 * falloff;
    float twinkle = 0.5 + 0.5 * sin(uTime * 1.6 + sparkleSeed * 80.0);
    col += star * twinkle * step(d, 0.0) * 1.2;
  }

  // Edge lit by direction: white where it faces the top-left light, glacier blue facing away.
  float rim = 1.0 - smoothstep(0.0, px * 1.4, inside);
  float towardLight = clamp(dot(edgeFacing, vec2(-0.6, 0.8)) * 0.5 + 0.5, 0.0, 1.0);
  col = mix(col, mix(vec3(0.24, 0.5, 0.82), vec3(1.0), towardLight), rim * 0.95);
  alpha = max(alpha, rim * 0.9);

  alpha = clamp(alpha, 0.0, 0.97) * coverage;
  vec3 rgb = min(col, vec3(1.0)) * alpha;

  // Composite the crystal over its outline and shadow (all premultiplied).
  vec3 underRgb = vec3(0.14, 0.39, 0.65) * shadow;
  float underAlpha = shadow;
  underRgb = vec3(0.66, 0.81, 1.0) * outline + underRgb * (1.0 - outline);
  underAlpha = outline + underAlpha * (1.0 - outline);
  outColor = vec4(rgb + underRgb * (1.0 - alpha), alpha + underAlpha * (1.0 - alpha));
}
`;

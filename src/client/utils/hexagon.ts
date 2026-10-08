export type Point = readonly [number, number];

/** Pointy-top hexagon filling the box; regular when height = width × 2/√3. */
export function hexagonPoints(
  x: number,
  y: number,
  width: number,
  height: number,
): Point[] {
  return [
    [x + width / 2, y],
    [x + width, y + height / 4],
    [x + width, y + (height * 3) / 4],
    [x + width / 2, y + height],
    [x, y + (height * 3) / 4],
    [x, y + height / 4],
  ];
}

const round = (value: number) => Number(value.toFixed(4));
const format = ([px, py]: Point) => `${round(px)} ${round(py)}`;

/**
 * SVG path through `points` with each corner rounded by a quadratic curve. The radius is capped
 * at half of the shorter adjoining edge so neighbouring curves never overlap.
 */
export function roundedPolygonPath(
  points: readonly Point[],
  radius: number,
): string {
  if (points.length < 3) return "";
  if (radius <= 0) {
    return `M ${points.map(format).join(" L ")} Z`;
  }

  const segments = points.map((point, index) => {
    const previous = points[(index - 1 + points.length) % points.length];
    const next = points[(index + 1) % points.length];
    const toPrevious: Point = [previous[0] - point[0], previous[1] - point[1]];
    const toNext: Point = [next[0] - point[0], next[1] - point[1]];
    const previousLength = Math.hypot(toPrevious[0], toPrevious[1]);
    const nextLength = Math.hypot(toNext[0], toNext[1]);
    const r = Math.min(radius, previousLength / 2, nextLength / 2);

    const start: Point = [
      point[0] + (toPrevious[0] / previousLength) * r,
      point[1] + (toPrevious[1] / previousLength) * r,
    ];
    const end: Point = [
      point[0] + (toNext[0] / nextLength) * r,
      point[1] + (toNext[1] / nextLength) * r,
    ];
    return { start, point, end };
  });

  const [first, ...rest] = segments;
  return [
    `M ${format(first.start)} Q ${format(first.point)} ${format(first.end)}`,
    ...rest.map(
      ({ start, point, end }) =>
        `L ${format(start)} Q ${format(point)} ${format(end)}`,
    ),
    "Z",
  ].join(" ");
}

/**
 * Regular pointy-top hexagon centred on (cx, cy). To nest rings evenly, shrink the circumradius
 * by inset / 0.866 and the corner by the same inset: the outlines then stay parallel.
 */
export function regularHexagonPath(
  cx: number,
  cy: number,
  circumradius: number,
  corner: number,
): string {
  const width = circumradius * Math.sqrt(3);
  return roundedPolygonPath(
    hexagonPoints(cx - width / 2, cy - circumradius, width, circumradius * 2),
    Math.max(corner, 0),
  );
}

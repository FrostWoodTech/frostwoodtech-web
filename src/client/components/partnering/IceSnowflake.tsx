import { useRef } from "react";
import { useSnowflakeRenderer } from "./useSnowflakeRenderer";

/** Snowflakes in the open corners: left %, top %, size px, duration s, delay s. */
const SNOW = [
  [4, 10, 4, 9, 0],
  [10, 30, 3, 11, 2.5],
  [20, 3, 3.5, 10, 5],
  [78, 5, 3, 12, 1],
  [90, 12, 4, 9.5, 3.5],
  [95, 34, 3, 11.5, 6],
  [6, 68, 3.5, 10.5, 4],
  [12, 86, 3, 12.5, 7],
  [24, 93, 4, 9, 2],
  [74, 91, 3, 11, 5.5],
  [88, 72, 3.5, 10, 8],
  [94, 88, 3, 12, 1.5],
] as const;

/** A translucent ice snowflake (WebGL), with the brand snowflake mark as the no-WebGL fallback. */
export default function IceSnowflake() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useSnowflakeRenderer(canvasRef);

  return (
    <div
      aria-hidden="true"
      className="relative mx-auto aspect-square w-full max-w-[280px] sm:max-w-[340px] lg:max-w-[400px]"
    >
      {SNOW.map(([left, top, size, duration, delay]) => (
        <span
          key={`${left}-${top}`}
          className="ice-snow"
          style={{
            left: `${left}%`,
            top: `${top}%`,
            width: size,
            height: size,
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`,
          }}
        />
      ))}

      <canvas ref={canvasRef} className="ice-flake-canvas absolute inset-0" />

      {/* Hidden by CSS as soon as the canvas has drawn. */}
      <svg
        viewBox="0 0 32 32"
        fill="none"
        className="ice-flake-fallback absolute inset-[12%] rotate-90 text-ice opacity-60"
      >
        <path
          d="M16 2.5v27M5 8.2l22 15.6M27 8.2L5 23.8M16 9.5l3.4 2M16 9.5l-3.4 2M16 22.5l3.4-2M16 22.5l-3.4-2"
          stroke="currentColor"
          strokeWidth="0.3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

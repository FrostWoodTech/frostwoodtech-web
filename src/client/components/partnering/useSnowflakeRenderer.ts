import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";
import { usePrefersReducedMotion } from "@/client/hooks/usePrefersReducedMotion";
import {
  createSnowflakeRenderer,
  type SnowflakeRenderer,
} from "./snowflakeRenderer";

/**
 * Draws the glass snowflake on the canvas for as long as the component is mounted. The light
 * stops under reduced motion. Without WebGL2 the canvas never gets `data-ready`, so CSS keeps
 * the fallback visible.
 */
export function useSnowflakeRenderer(
  canvasRef: RefObject<HTMLCanvasElement | null>,
): void {
  const rendererRef = useRef<SnowflakeRenderer | null>(null);
  const animate = !usePrefersReducedMotion();
  const animateRef = useRef(animate);

  // Layout effect: the first frame is drawn before the browser paints, so the fallback never flashes.
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: SnowflakeRenderer | null = null;
    try {
      renderer = createSnowflakeRenderer(canvas, {
        animate: animateRef.current,
      });
    } catch (error) {
      console.error("Snowflake failed to start:", error);
    }
    rendererRef.current = renderer;
    return () => {
      renderer?.dispose();
      rendererRef.current = null;
    };
  }, [canvasRef]);

  useEffect(() => {
    animateRef.current = animate;
    rendererRef.current?.setAnimate(animate);
  }, [animate]);
}

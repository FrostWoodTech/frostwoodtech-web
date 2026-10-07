import { useEffect, type RefObject } from "react";
import type { IceConfig } from "./iceConfig";
import { createIceRenderer, type IceRenderer } from "./iceEngine";

/** Paints the WebGL frosted ice on `canvasRef` for as long as the component is mounted. */
export function useIceBackground(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  config: IceConfig,
): void {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: IceRenderer | null = null;
    try {
      renderer = createIceRenderer(canvas, config);
    } catch (error) {
      // The background sits outside the page ErrorBoundary: never let it take the site down.
      console.error("Ice background failed to start:", error);
    }
    // Without WebGL2 the CSS gradient and glass panes stay as the background.
    return () => renderer?.dispose();
  }, [canvasRef, config]);
}

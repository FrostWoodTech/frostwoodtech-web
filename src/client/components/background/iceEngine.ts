import { hexToLinearRgb } from "@/client/utils/color";
import type { IceConfig } from "./iceConfig";
import {
  createFullscreenProgram,
  deleteFullscreenProgram,
} from "@/client/lib/webgl";
import { SCENE_FRAG } from "./iceShaders";

/** Handle returned to `useIceBackground`; the picture repaints itself on resize. */
export interface IceRenderer {
  dispose(): void;
}

/** Painting is the expensive part, so it waits for the window to stop resizing. */
const REPAINT_DEBOUNCE_MS = 150;

const UNIFORMS = [
  "uCssSize",
  "uSnow",
  "uWash",
  "uIce",
  "uCyan",
  "uNavy",
  "uGlowStrength",
  "uNavyDepth",
  "uFrostDetail",
  "uMinLuminance",
  "uSeed",
] as const;

const createGpuResources = (gl: WebGL2RenderingContext) =>
  createFullscreenProgram(gl, SCENE_FRAG, UNIFORMS, "Ice background");

/**
 * Paints the still frosted-ice picture on `canvas` with WebGL2, and again whenever its size
 * changes. Returns null when WebGL2 or the shader is unavailable; the caller keeps the CSS
 * fallback.
 */
export function createIceRenderer(
  canvas: HTMLCanvasElement,
  config: IceConfig,
): IceRenderer | null {
  const context = canvas.getContext("webgl2", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: false,
    preserveDrawingBuffer: false,
    powerPreference: "low-power",
  });
  if (!context) return null;
  // Typed non-null once here: the hoisted helpers below don't see the narrowing above.
  const gl: WebGL2RenderingContext = context;

  let gpu = createGpuResources(gl);
  if (!gpu) return null;

  const palette = {
    snow: new Float32Array(hexToLinearRgb(config.palette.snow)),
    wash: new Float32Array(hexToLinearRgb(config.palette.wash)),
    ice: new Float32Array(hexToLinearRgb(config.palette.ice)),
    cyan: new Float32Array(hexToLinearRgb(config.palette.cyan)),
    navy: new Float32Array(hexToLinearRgb(config.palette.navy)),
  };

  let painted = false;
  let repaintTimer: ReturnType<typeof setTimeout> | undefined;

  function paint(): void {
    if (!gpu || gl.isContextLost()) return;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (width === 0 || height === 0) return;

    const pixelRatio = Math.min(
      window.devicePixelRatio || 1,
      config.pixelRatioCap,
    );
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    gl.viewport(0, 0, canvas.width, canvas.height);

    const { program, uniforms, vao } = gpu;
    gl.useProgram(program);
    gl.uniform2f(uniforms.uCssSize, width, height);
    gl.uniform3fv(uniforms.uSnow, palette.snow);
    gl.uniform3fv(uniforms.uWash, palette.wash);
    gl.uniform3fv(uniforms.uIce, palette.ice);
    gl.uniform3fv(uniforms.uCyan, palette.cyan);
    gl.uniform3fv(uniforms.uNavy, palette.navy);
    gl.uniform1f(uniforms.uGlowStrength, config.glowStrength);
    gl.uniform1f(uniforms.uNavyDepth, config.navyDepth);
    gl.uniform1f(uniforms.uFrostDetail, config.frostDetail);
    gl.uniform1f(uniforms.uMinLuminance, config.minLuminance);
    gl.uniform1f(uniforms.uSeed, config.seed);
    gl.bindVertexArray(vao);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    painted = true;
    // Shown over the CSS fallback only once it holds the picture.
    canvas.dataset.ready = "true";
  }

  function onResize(): void {
    // Resizing the backing store clears it, so the first paint is immediate and later ones are
    // debounced; the canvas just stretches the old picture until the window settles.
    if (!painted) {
      paint();
      return;
    }
    clearTimeout(repaintTimer);
    repaintTimer = setTimeout(paint, REPAINT_DEBOUNCE_MS);
  }

  function onContextLost(event: Event): void {
    // preventDefault() asks the browser to restore the context later.
    event.preventDefault();
    clearTimeout(repaintTimer);
    gpu = null;
  }

  function onContextRestored(): void {
    gpu = createGpuResources(gl);
    paint();
  }

  canvas.addEventListener("webglcontextlost", onContextLost);
  canvas.addEventListener("webglcontextrestored", onContextRestored);
  const resizeObserver = new ResizeObserver(onResize);
  resizeObserver.observe(canvas);
  paint();

  return {
    dispose() {
      clearTimeout(repaintTimer);
      resizeObserver.disconnect();
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      // Free GPU memory but never call loseContext(): under StrictMode the effect re-runs on this
      // same canvas, and getContext() hands back this context, which must still work.
      if (gpu) deleteFullscreenProgram(gl, gpu);
      gpu = null;
    },
  };
}

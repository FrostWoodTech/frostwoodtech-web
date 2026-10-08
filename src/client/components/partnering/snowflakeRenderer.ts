import {
  createFullscreenProgram,
  deleteFullscreenProgram,
} from "@/client/lib/webgl";
import { SNOWFLAKE_FRAG } from "./snowflakeShader";

export interface SnowflakeRenderer {
  /** False under reduced motion: the light stops and one still frame stays on screen. */
  setAnimate(animate: boolean): void;
  dispose(): void;
}

const UNIFORMS = ["uResolution", "uTime", "uLight"] as const;
/** The light drifts slowly, so ~30fps looks identical to 60 at half the GPU work. */
const FRAME_MS = 1000 / 30;
/** Radians per second the light circles at; one orbit takes about 18s. */
const LIGHT_SPEED = 0.35;
/** Starting angle, chosen so the still frame catches glints on the upper-left bevels. */
const LIGHT_START = 2.2;
const PIXEL_RATIO_CAP = 2;

/**
 * Draws the translucent ice snowflake on `canvas` with WebGL2. The light only moves while the
 * canvas is on screen and animation is allowed. Returns null without WebGL2 or the shader.
 */
export function createSnowflakeRenderer(
  canvas: HTMLCanvasElement,
  options: { readonly animate: boolean },
): SnowflakeRenderer | null {
  const context = canvas.getContext("webgl2", {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
  });
  if (!context) return null;
  // Typed non-null once here: the hoisted helpers below don't see the narrowing above.
  const gl: WebGL2RenderingContext = context;

  const create = () =>
    createFullscreenProgram(gl, SNOWFLAKE_FRAG, UNIFORMS, "Snowflake");
  let gpu = create();
  if (!gpu) return null;

  let animate = options.animate;
  let onScreen = true;
  let frameId = 0;
  let lastTime = 0;
  let lastDraw = 0;
  let clock = 0;

  function draw(): void {
    if (!gpu || gl.isContextLost() || canvas.width === 0) return;

    const angle = LIGHT_START + clock * LIGHT_SPEED;
    const light = [Math.cos(angle) * 0.55, Math.sin(angle) * 0.55 + 0.15, 0.8];
    const length = Math.hypot(light[0], light[1], light[2]);

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(gpu.program);
    gl.uniform2f(gpu.uniforms.uResolution, canvas.width, canvas.height);
    gl.uniform1f(gpu.uniforms.uTime, clock);
    gl.uniform3f(
      gpu.uniforms.uLight,
      light[0] / length,
      light[1] / length,
      light[2] / length,
    );
    gl.bindVertexArray(gpu.vao);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    canvas.dataset.ready = "true";
  }

  const shouldRun = () => animate && onScreen && gpu !== null;

  function frame(now: number): void {
    frameId = 0;
    if (!shouldRun()) {
      lastTime = 0;
      return;
    }
    // Clamped so returning to the tab doesn't jump the light.
    clock += lastTime ? Math.min((now - lastTime) / 1000, 0.1) : 0;
    lastTime = now;
    if (now - lastDraw >= FRAME_MS) {
      lastDraw = now;
      draw();
    }
    frameId = requestAnimationFrame(frame);
  }

  function start(): void {
    if (!frameId && shouldRun()) frameId = requestAnimationFrame(frame);
  }

  function stop(): void {
    if (frameId) cancelAnimationFrame(frameId);
    frameId = 0;
    lastTime = 0;
  }

  function resize(): void {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, PIXEL_RATIO_CAP);
    const width = Math.round(canvas.clientWidth * pixelRatio);
    const height = Math.round(canvas.clientHeight * pixelRatio);
    if (width === 0 || height === 0) return;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    // Resizing clears the canvas, so repaint straight away.
    draw();
  }

  function onContextLost(event: Event): void {
    // preventDefault() asks the browser to restore the context later.
    event.preventDefault();
    stop();
    gpu = null;
  }

  function onContextRestored(): void {
    gpu = create();
    resize();
    start();
  }

  canvas.addEventListener("webglcontextlost", onContextLost);
  canvas.addEventListener("webglcontextrestored", onContextRestored);
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  const visibility = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    if (onScreen) start();
    else stop();
  });
  visibility.observe(canvas);

  resize();
  start();

  return {
    setAnimate(next) {
      animate = next;
      if (animate) start();
      else {
        stop();
        draw();
      }
    },
    dispose() {
      stop();
      resizeObserver.disconnect();
      visibility.disconnect();
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      // Never loseContext(): under StrictMode the effect re-runs on this same canvas.
      if (gpu) deleteFullscreenProgram(gl, gpu);
      gpu = null;
    },
  };
}

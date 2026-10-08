import { useRef, type CSSProperties } from "react";
import { ICE_CONFIG, type IceConfig } from "./iceConfig";
import { useIceBackground } from "./useIceBackground";

interface IceGlassBackgroundProps {
  /** Pass a stable object (e.g. a module constant): a new one each render repaints from scratch. */
  readonly config?: IceConfig;
}

/**
 * Still frosted-ice background that fills its positioned parent (the Home hero). Layers, bottom
 * to top: CSS gradient (fallback) → WebGL frosted ice → grain. Styles live in the "Ice glass
 * background" block of index.css.
 */
export default function IceGlassBackground({
  config = ICE_CONFIG,
}: IceGlassBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useIceBackground(canvasRef, config);

  // The CSS layers read the same palette and glass settings as the shader.
  const style = {
    "--ice-snow": config.palette.snow,
    "--ice-wash": config.palette.wash,
    "--ice-ice": config.palette.ice,
    "--ice-cyan": config.palette.cyan,
    "--ice-glow": `${Math.round(config.glowStrength * 100)}%`,
    "--ice-glass-blur": `${config.glass.blur}px`,
    "--ice-glass-tint": config.glass.tint,
    "--ice-glass-border": config.glass.border,
  } as CSSProperties;

  return (
    <div
      aria-hidden="true"
      className="ice-bg pointer-events-none absolute inset-0 overflow-hidden"
      style={style}
    >
      <canvas ref={canvasRef} className="ice-bg__canvas absolute inset-0" />
      <div className="ice-bg__grain" />
    </div>
  );
}

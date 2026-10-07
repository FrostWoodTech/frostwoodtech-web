/**
 * Every tweakable value of the ice background in one place. The WebGL shader and the CSS layers
 * (glass panes, fallback gradient) both read from here.
 */
export interface IceConfig {
  /** Brand colours, as hex. The shader mixes them in linear light. */
  readonly palette: {
    /** Brightest frost; top-left of the page. */
    readonly snow: string;
    /** Pale ice the page fades into towards the bottom-right. */
    readonly wash: string;
    /** Icy-blue light glowing through the ice (top-right and bottom-right). */
    readonly ice: string;
    /** Glacier-cyan glow (bottom-left). */
    readonly cyan: string;
    /** Faint depth tint in the far corner. */
    readonly navy: string;
  };
  /** How far the ice/cyan glows tint the frost (0–1). Higher reads bluer. */
  readonly glowStrength: number;
  /** Navy depth tint in the bottom-right corner (0–1). Keep it a hint. */
  readonly navyDepth: number;
  /** Frost crystals, plate cracks and specks creeping in from the edges (0 = none, 1 = default). */
  readonly frostDetail: number;
  /**
   * Contrast guard: no background pixel may be darker than this relative luminance. 0.75 keeps
   * Slate body text (#52657C) at ≥4.5:1 everywhere; don't go below 0.74.
   */
  readonly minLuminance: number;
  /** CSS glass panes. */
  readonly glass: {
    /** Backdrop blur in px — how frosted the panes look. */
    readonly blur: number;
    /** White fill opacity of the panes (0–1). */
    readonly tint: number;
    /** Opacity of the panes' 1px white edge (0–1). */
    readonly border: number;
  };
  /** Highest device pixel ratio rendered; caps GPU cost on high-DPI screens. */
  readonly pixelRatioCap: number;
  /** Changes the frost pattern; any number. */
  readonly seed: number;
}

export const ICE_CONFIG: IceConfig = {
  palette: {
    snow: "#FCFDFF",
    wash: "#EAF3FF",
    ice: "#7DB7FF",
    cyan: "#8EDCF2",
    navy: "#152840",
  },
  glowStrength: 0.32,
  navyDepth: 0.06,
  frostDetail: 1,
  minLuminance: 0.75,
  glass: {
    blur: 18,
    tint: 0.28,
    border: 0.7,
  },
  pixelRatioCap: 1.5,
  seed: 3.7,
};

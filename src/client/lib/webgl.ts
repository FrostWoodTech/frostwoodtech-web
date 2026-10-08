/** One oversized triangle covering the viewport; corners come from gl_VertexID, so no buffers. */
export const FULLSCREEN_VERT = `#version 300 es
out vec2 vUv;

void main() {
  vec2 corner = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  vUv = corner;
  gl_Position = vec4(corner * 2.0 - 1.0, 0.0, 1.0);
}
`;

export interface FullscreenProgram<Name extends string> {
  readonly program: WebGLProgram;
  readonly uniforms: Record<Name, WebGLUniformLocation | null>;
  /** Empty: the fullscreen triangle is generated from gl_VertexID. */
  readonly vao: WebGLVertexArrayObject;
}

function compileShader(
  gl: WebGL2RenderingContext,
  type: GLenum,
  source: string,
  label: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(`${label} shader:`, gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/**
 * Compiles `fragmentSource` against the fullscreen-triangle vertex shader and looks up its
 * uniforms. Returns null (after logging the info log) when compiling or linking fails.
 */
export function createFullscreenProgram<Name extends string>(
  gl: WebGL2RenderingContext,
  fragmentSource: string,
  uniformNames: readonly Name[],
  label: string,
): FullscreenProgram<Name> | null {
  const vertex = compileShader(gl, gl.VERTEX_SHADER, FULLSCREEN_VERT, label);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource, label);
  const program = gl.createProgram();
  const vao = gl.createVertexArray();

  if (!vertex || !fragment || !program || !vao) {
    if (vertex) gl.deleteShader(vertex);
    if (fragment) gl.deleteShader(fragment);
    if (program) gl.deleteProgram(program);
    if (vao) gl.deleteVertexArray(vao);
    return null;
  }

  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  // Flagged for deletion; freed together with the program.
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(`${label} program:`, gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    gl.deleteVertexArray(vao);
    return null;
  }

  const uniforms = {} as Record<Name, WebGLUniformLocation | null>;
  for (const name of uniformNames) {
    uniforms[name] = gl.getUniformLocation(program, name);
  }
  return { program, uniforms, vao };
}

/** Frees the program; skipped when the context is already lost (its objects are gone). */
export function deleteFullscreenProgram<Name extends string>(
  gl: WebGL2RenderingContext,
  resources: FullscreenProgram<Name>,
): void {
  if (gl.isContextLost()) return;
  gl.deleteProgram(resources.program);
  gl.deleteVertexArray(resources.vao);
}

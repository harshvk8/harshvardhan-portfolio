/**
 * Feature-detect WebGL before trying to mount the 3D universe. A browser
 * that reports no WebGL context (disabled, unsupported, some headless/
 * sandboxed environments) would otherwise leave the 3D canvas blank with no
 * explanation — this lets the caller show a real fallback instead.
 */
export function hasWebGL(): boolean {
  if (typeof window === "undefined") return true; // assume yes during SSR; checked again on mount
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    return !!gl && typeof WebGLRenderingContext !== "undefined";
  } catch {
    return false;
  }
}

/**
 * WebGL shader strings for the hero background noise field.
 *
 * Renders a slow-moving organic color field that shifts between
 * Deep Steel (#1a1e24) and a slightly warmer dark tone, responding
 * to both time and scroll progress.
 */

export const VERTEX_SHADER = /* glsl */ `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

export const FRAGMENT_SHADER = /* glsl */ `
  precision mediump float;

  uniform float uTime;
  uniform vec2  uResolution;
  uniform float uScrollProgress;

  /* ── Value noise (compact, no external dependency) ───────────────── */
  float hash(vec2 p) {
    p  = fract(p * vec2(127.1, 311.7));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float smoothNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);           /* smoothstep */
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  /* Fractal Brownian Motion — 4 octaves */
  float fbm(vec2 p) {
    float v   = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 4; i++) {
      v   += amp * smoothNoise(p);
      p   *= 2.1;
      amp *= 0.5;
    }
    return v;
  }

  /* ── Main ─────────────────────────────────────────────────────────── */
  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;

    /* Domain warp: fbm drives a second fbm for organic look */
    vec2 p  = uv * 2.5;
    vec2 q  = vec2(
      fbm(p + vec2(uTime * 0.04, uTime * 0.02)),
      fbm(p + vec2(1.7,          9.2))
    );
    float n = fbm(p + 0.8 * q + vec2(uTime * 0.015));

    /* Deep Steel ↔ warm dark brown */
    vec3 colorA = vec3(0.102, 0.118, 0.141); /* #1a1e24 */
    vec3 colorB = vec3(0.137, 0.118, 0.098); /* #231e19 */

    vec3 color  = mix(colorA, colorB, n * 0.65);

    /* Vignette — edges slightly darker */
    vec2 vig   = uv * (1.0 - uv.yx);
    float vign = pow(vig.x * vig.y * 15.0, 0.25);
    color      = color * (0.9 + 0.1 * vign);

    /* Scroll: shift cooler / darker */
    color = mix(color, colorA * 0.82, uScrollProgress * 0.4);

    gl_FragColor = vec4(color, 1.0);
  }
`;

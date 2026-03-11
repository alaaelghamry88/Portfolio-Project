"use client";

import { useEffect, useRef } from "react";
import { VERTEX_SHADER, FRAGMENT_SHADER } from "@/shaders/backgroundNoise";

interface Props {
  /** Ref containing current scroll progress (0→1). Read each frame — no React re-renders. */
  scrollProgressRef: React.RefObject<number>;
}

/**
 * Full-screen WebGL canvas rendering a slow-moving noise-based color field.
 * Deep Steel (#1a1e24) ↔ slightly warmer dark tone, responds to scroll.
 * Falls back to a solid background colour if WebGL is unavailable.
 */
export function ShaderBackground({ scrollProgressRef }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    /* ── WebGL context ──────────────────────────────────────────────── */
    const gl = canvas.getContext("webgl");
    if (!gl) {
      // WebGL unavailable — the CSS background fallback handles the look
      return;
    }

    /* ── Helpers ────────────────────────────────────────────────────── */
    function createShader(type: number, src: string) {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) {
        console.error(gl!.getShaderInfoLog(s));
        gl!.deleteShader(s);
        return null;
      }
      return s;
    }

    const vert = createShader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const frag = createShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vert || !frag) return;

    const program = gl.createProgram()!;
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    /* ── Full-screen quad ───────────────────────────────────────────── */
    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    /* ── Uniforms ───────────────────────────────────────────────────── */
    const uTime = gl.getUniformLocation(program, "uTime");
    const uResolution = gl.getUniformLocation(program, "uResolution");
    const uScrollProgress = gl.getUniformLocation(program, "uScrollProgress");

    /* ── Resize handler ─────────────────────────────────────────────── */
    function resize() {
      if (!canvas || !gl) return;
      canvas.width = canvas.offsetWidth * Math.min(window.devicePixelRatio, 1.5);
      canvas.height =
        canvas.offsetHeight * Math.min(window.devicePixelRatio, 1.5);
      gl.viewport(0, 0, canvas.width, canvas.height);
    }

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    /* ── IntersectionObserver — pause when off-screen ───────────────── */
    let visible = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    /* ── Render loop ────────────────────────────────────────────────── */
    let rafId = 0;
    const startTime = performance.now();

    function render() {
      rafId = requestAnimationFrame(render);
      if (!visible || !gl) return;

      const t = (performance.now() - startTime) * 0.001;
      gl.uniform1f(uTime, t);
      gl.uniform2f(uResolution, canvas!.width, canvas!.height);
      gl.uniform1f(
        uScrollProgress,
        scrollProgressRef.current ?? 0,
      );

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    render();

    /* ── Cleanup ────────────────────────────────────────────────────── */
    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      io.disconnect();
      gl.deleteProgram(program);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
      gl.deleteBuffer(buf);
    };
  }, [scrollProgressRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
      style={{
        // CSS fallback colour — shown if WebGL fails to init
        background: "#1a1e24",
      }}
    />
  );
}

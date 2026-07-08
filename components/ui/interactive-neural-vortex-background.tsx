"use client";

import { useEffect, useRef } from "react";

/**
 * Interactive WebGL "neural vortex" background — pointer-reactive animated
 * filaments. Adapted to fill its parent container (place it inside a `relative`
 * element) and recolored to the site's blue brand palette. Pauses when
 * off-screen and renders a single static frame when the user prefers reduced
 * motion. Purely decorative (aria-hidden, pointer-events: none).
 */
export default function InteractiveNeuralVortex({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointer = useRef({ x: 0, y: 0, tX: 0, tY: 0 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = (canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) {
      console.warn("WebGL not supported — skipping neural background.");
      return;
    }

    const vsSource = `
      precision mediump float;
      attribute vec2 a_position;
      varying vec2 vUv;
      void main() {
        vUv = .5 * (a_position + 1.);
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Recolored to the brand blues (deep navy-blue → light cyan-blue).
    const fsSource = `
      precision mediump float;
      varying vec2 vUv;
      uniform float u_time;
      uniform float u_ratio;
      uniform vec2 u_pointer_position;
      uniform float u_scroll_progress;
      uniform float u_dark;

      vec2 rotate(vec2 uv, float th) {
        return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
      }

      float neuro_shape(vec2 uv, float t, float p) {
        vec2 sine_acc = vec2(0.);
        vec2 res = vec2(0.);
        float scale = 8.;
        for (int j = 0; j < 15; j++) {
          uv = rotate(uv, 1.);
          sine_acc = rotate(sine_acc, 1.);
          vec2 layer = uv * scale + float(j) + sine_acc - t;
          sine_acc += sin(layer) + 2.4 * p;
          res += (.5 + .5 * cos(layer)) / scale;
          scale *= (1.2);
        }
        return res.x + res.y;
      }

      void main() {
        vec2 uv = .5 * vUv;
        uv.x *= u_ratio;
        vec2 pointer = vUv - u_pointer_position;
        pointer.x *= u_ratio;
        float p = clamp(length(pointer), 0., 1.);
        p = .5 * pow(1. - p, 2.);
        float t = .001 * u_time;
        vec3 color = vec3(0.);
        float noise = neuro_shape(uv, t, p);
        noise = 1.2 * pow(noise, 3.);
        noise += pow(noise, 10.);
        noise = max(.0, noise - .5);
        noise *= (1. - length(vUv - .5));

        // brand palette — brighter on dark theme, deeper dark-blue on light theme
        if (u_dark > 0.5) {
          color = vec3(0.09, 0.26, 0.52);
          color = mix(color, vec3(0.24, 0.62, 0.95), 0.42 + 0.14 * sin(2.0 * u_scroll_progress + 1.2));
          color += vec3(0.05, 0.14, 0.42) * sin(2.0 * u_scroll_progress + 1.5);
        } else {
          color = vec3(0.05, 0.15, 0.42);
          color = mix(color, vec3(0.10, 0.34, 0.72), 0.42 + 0.14 * sin(2.0 * u_scroll_progress + 1.2));
          color += vec3(0.03, 0.09, 0.30) * sin(2.0 * u_scroll_progress + 1.5);
        }
        color = color * noise;
        gl_FragColor = vec4(color, noise);
      }
    `;

    const compile = (source: string, type: number): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compile(vsSource, gl.VERTEX_SHADER);
    const fragmentShader = compile(fsSource, gl.FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "u_time");
    const uRatio = gl.getUniformLocation(program, "u_ratio");
    const uPointer = gl.getUniformLocation(program, "u_pointer_position");
    const uScroll = gl.getUniformLocation(program, "u_scroll_progress");
    const uDark = gl.getUniformLocation(program, "u_dark");

    // Track the active theme so the filaments recolor live on toggle
    // (bright blue on dark, deep dark-blue on light).
    const isDark = () => {
      const attr = document.documentElement.getAttribute("data-theme");
      if (attr === "dark") return true;
      if (attr === "light") return false;
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    };
    const darkRef = { current: isDark() };
    const themeObserver = new MutationObserver(() => (darkRef.current = isDark()));
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const schemeMq = window.matchMedia("(prefers-color-scheme: dark)");
    const onScheme = () => (darkRef.current = isDark());
    schemeMq.addEventListener("change", onScheme);

    // Size to the *container*, not the whole window.
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth || 1;
      const h = canvas.clientHeight || 1;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(uRatio, canvas.width / canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const drawFrame = () => {
      const now = performance.now();
      pointer.current.x += (pointer.current.tX - pointer.current.x) * 0.2;
      pointer.current.y += (pointer.current.tY - pointer.current.y) * 0.2;
      const w = canvas.clientWidth || 1;
      const h = canvas.clientHeight || 1;
      gl.uniform1f(uTime, now);
      gl.uniform2f(uPointer, pointer.current.x / w, 1 - pointer.current.y / h);
      gl.uniform1f(uScroll, window.scrollY / (2 * window.innerHeight));
      gl.uniform1f(uDark, darkRef.current ? 1 : 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const loop = () => {
      drawFrame();
      rafRef.current = requestAnimationFrame(loop);
    };

    // Pause the animation loop whenever the hero is scrolled out of view.
    let visible = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (reduceMotion) {
          drawFrame();
          return;
        }
        if (visible && rafRef.current == null) {
          rafRef.current = requestAnimationFrame(loop);
        } else if (!visible && rafRef.current != null) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    if (reduceMotion) {
      drawFrame();
    } else {
      rafRef.current = requestAnimationFrame(loop);
    }

    // Pointer is tracked window-wide (the canvas is behind the content).
    const centerPointer = () => {
      const r = canvas.getBoundingClientRect();
      pointer.current.tX = pointer.current.x = r.width / 2;
      pointer.current.tY = pointer.current.y = r.height / 2;
    };
    centerPointer();

    const onPointer = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.current.tX = e.clientX - r.left;
      pointer.current.tY = e.clientY - r.top;
    };
    const onTouch = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      const r = canvas.getBoundingClientRect();
      pointer.current.tX = touch.clientX - r.left;
      pointer.current.tY = touch.clientY - r.top;
    };
    window.addEventListener("pointermove", onPointer);
    window.addEventListener("touchmove", onTouch, { passive: true });

    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      io.disconnect();
      themeObserver.disconnect();
      schemeMq.removeEventListener("change", onScheme);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("touchmove", onTouch);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(vertexBuffer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}

"use client";

import { useEffect, useRef } from "react";

/**
 * Tracks the cursor over its parent element and exposes its position as the
 * `--mx` / `--my` CSS variables (percentages), which power the spotlight/glow
 * effects in globals.css. Pointer devices only; no-op on touch.
 * Pass `glow` to also render the hero's larger cursor-follow glow layer.
 */
export default function PointerSpotlight({ glow = false }: { glow?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const host = ref.current?.parentElement as HTMLElement | null;
    if (!host) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      const r = host.getBoundingClientRect();
      const mx = ((e.clientX - r.left) / r.width) * 100;
      const my = ((e.clientY - r.top) / r.height) * 100;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        host.style.setProperty("--mx", `${mx}%`);
        host.style.setProperty("--my", `${my}%`);
      });
    };
    host.addEventListener("mousemove", onMove);
    return () => {
      host.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {glow && <div className="cursor-glow" aria-hidden="true" />}
      <span ref={ref} className="hidden" aria-hidden="true" />
    </>
  );
}

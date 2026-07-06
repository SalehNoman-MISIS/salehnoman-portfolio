"use client";

import { useState, useEffect, useCallback } from "react";
import type { GalleryItem } from "@/data/projects";
import SmartImage from "./SmartImage";
import Icon from "./Icon";
import { assetSrc } from "@/lib/asset";

export default function Gallery({ slug, items }: { slug: string; items: GalleryItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const srcOf = (file: string) => assetSrc(slug, file);

  const close = useCallback(() => setOpenIndex(null), []);

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") setOpenIndex((i) => (i === null ? i : (i + 1) % items.length));
      if (e.key === "ArrowLeft") setOpenIndex((i) => (i === null ? i : (i - 1 + items.length) % items.length));
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openIndex, items.length, close]);

  return (
    <>
      <div className="grid items-start gap-5 sm:grid-cols-2">
        {items.map((it, i) => (
          <figure key={it.file} className="group overflow-hidden rounded-xl border border-[var(--hairline)] bg-[var(--card)]" style={{ boxShadow: "var(--shadow)" }}>
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              className="relative block aspect-[16/10] w-full cursor-zoom-in overflow-hidden bg-[var(--header-tint)]"
              aria-label={`Enlarge: ${it.alt}`}
            >
              <SmartImage src={srcOf(it.file)} alt={it.alt} fit="contain" priority={i < 2} sizes="(max-width: 768px) 100vw, 45vw" className="transition-transform duration-500 group-hover:scale-[1.02]" />
            </button>
            {it.caption && <figcaption className="border-t border-[var(--hairline)] px-4 py-2.5 text-xs text-[var(--muted)]">{it.caption}</figcaption>}
          </figure>
        ))}
      </div>

      {openIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
          onClick={close}
        >
          <div className="relative max-h-[92vh] max-w-[92vw]" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={srcOf(items[openIndex].file)} alt={items[openIndex].alt} className="max-h-[88vh] max-w-[92vw] rounded-xl object-contain" />
            {items[openIndex].caption && (
              <p className="mt-2 text-center text-sm text-white/80">{items[openIndex].caption}</p>
            )}
            <button
              type="button"
              onClick={close}
              className="absolute -right-3 -top-3 grid size-9 place-items-center rounded-full bg-white text-[var(--navy)] shadow-lg"
              aria-label="Close preview"
            >
              <Icon name="x" size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

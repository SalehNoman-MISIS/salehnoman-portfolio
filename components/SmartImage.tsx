import Image from "next/image";

/**
 * Renders an optimized next/image for raster screenshots (fill layout) and a
 * plain <img> passthrough for SVG diagrams. Must be placed inside a `relative`
 * parent with a defined aspect ratio.
 */
export default function SmartImage({
  src,
  alt,
  fit = "cover",
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  className = "",
}: {
  src: string;
  alt: string;
  fit?: "cover" | "contain";
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const isSvg = src.toLowerCase().endsWith(".svg");
  const object = fit === "cover" ? "object-cover" : "object-contain";

  if (isSvg) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={`absolute inset-0 h-full w-full ${object} ${className}`}
      />
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={`${object} ${className}`}
    />
  );
}

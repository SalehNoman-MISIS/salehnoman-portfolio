import { testimonialsContent as t, liveTestimonials } from "@/data/testimonials";
import Section from "./Section";
import Icon from "./Icon";

export default function Testimonials() {
  // Hidden on the live site until real (non-placeholder) reviews are added.
  if (liveTestimonials.length === 0) return null;

  return (
    <Section id="reviews" eyebrow={t.eyebrow} title={t.title} icon="star">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {liveTestimonials.map((r, i) => (
          <figure
            key={i}
            className="flex h-full flex-col rounded-2xl border border-[var(--hairline)] bg-[var(--card)] p-6"
            style={{ boxShadow: "var(--shadow)", "--reveal-delay": `${(i % 3) * 70}ms` }}
            data-reveal
          >
            <div className="flex items-center gap-0.5 text-[var(--accent)]">
              {Array.from({ length: Math.max(0, Math.min(5, Number(r.rating) || 5)) }).map((_, j) => (
                <Icon key={j} name="star" size={16} className="fill-current" strokeWidth={0} />
              ))}
            </div>
            <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-[var(--ink)]">
              “{r.quote}”
            </blockquote>
            <figcaption className="mt-4 border-t border-[var(--hairline)] pt-3">
              <span className="block text-sm font-bold text-[var(--navy)]">{r.author}</span>
              <span className="block text-xs text-[var(--muted)]">{r.role}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}

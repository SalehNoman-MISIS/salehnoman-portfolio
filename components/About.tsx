import { about, highlights } from "@/data/about";
import { site } from "@/data/site";
import Section from "./Section";
import Icon from "./Icon";

export default function About() {
  return (
    <Section id="about" eyebrow="About" title="Turning messy web data into models and products" icon="quote">
      <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-14">
        <div data-reveal>
          <div className="space-y-4 text-base leading-relaxed text-[var(--ink)] sm:text-lg">
            {about.bio.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
            {about.facts.map((f) => (
              <li key={f} className="inline-flex items-center gap-2 text-sm text-[var(--muted)]">
                <Icon name="check" size={16} className="text-[var(--accent)]" />
                {f}
              </li>
            ))}
          </ul>

          <p className="mt-6 text-sm font-medium text-[var(--accent-strong)]">{site.openTo}</p>
        </div>

        <div className="grid grid-cols-2 gap-4" data-reveal style={{ "--reveal-delay": "120ms" }}>
          {highlights.map((h) => (
            <div
              key={h.label}
              className="rounded-2xl border border-[var(--hairline)] bg-[var(--card)] p-5 transition-transform hover:-translate-y-1"
              style={{ boxShadow: "var(--shadow)" }}
            >
              <Icon name={h.icon} size={22} className="text-[var(--accent)]" />
              <p className="mt-3 text-2xl font-extrabold tracking-tight text-[var(--navy)] sm:text-[1.75rem]">{h.value}</p>
              <p className="mt-1 text-xs leading-snug text-[var(--muted)]">{h.label}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

import { education, certifications, honors } from "@/data/education";
import Section from "./Section";
import Icon from "./Icon";

export default function Education() {
  return (
    <Section id="education" eyebrow="Education & Certifications" title="Formal training in data science, IT and languages" icon="graduation-cap">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
        <div data-reveal>
          <h3 className="mb-5 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[var(--navy)]">
            <Icon name="graduation-cap" size={16} className="text-[var(--accent)]" /> Education
          </h3>
          <ul className="space-y-4">
            {education.map((e) => (
              <li
                key={e.degree}
                className={`rounded-2xl border bg-[var(--card)] p-5 ${
                  e.highlight ? "border-[var(--accent)]/40 ring-1 ring-inset ring-[var(--accent)]/20" : "border-[var(--hairline)]"
                }`}
                style={{ boxShadow: "var(--shadow)" }}
              >
                <div className="flex items-start justify-between gap-3">
                  <h4 className="text-sm font-bold text-[var(--navy)] sm:text-base">{e.degree}</h4>
                  <span className="shrink-0 text-xs font-medium text-[var(--muted)]">{e.period}</span>
                </div>
                <p className="mt-1 text-sm text-[var(--muted)]">{e.org}</p>
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-2xl border border-[var(--hairline)] bg-[var(--header-tint)] p-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[var(--navy)]">
              <Icon name="award" size={16} className="text-[var(--accent)]" /> Honors
            </h3>
            <ul className="space-y-2">
              {honors.map((h) => (
                <li key={h} className="flex gap-2 text-sm text-[var(--ink)]">
                  <Icon name="check" size={16} className="mt-0.5 shrink-0 text-[var(--accent)]" />
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div data-reveal style={{ "--reveal-delay": "120ms" }}>
          <h3 className="mb-5 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[var(--navy)]">
            <Icon name="award" size={16} className="text-[var(--accent)]" /> Certifications
          </h3>
          <ul className="space-y-2.5">
            {certifications.map((c) => (
              <li key={c.name} className="flex items-start gap-3 rounded-xl border border-[var(--hairline)] bg-[var(--card)] px-4 py-3">
                <Icon name="check" size={16} className="mt-0.5 shrink-0 text-[var(--accent)]" />
                <div className="flex flex-1 flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                  <span className="text-sm font-medium text-[var(--ink)]">{c.name}</span>
                  <span className="text-xs text-[var(--muted)]">{c.org} · {c.date}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

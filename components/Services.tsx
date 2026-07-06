import { servicesContent as s } from "@/data/services";
import Section from "./Section";
import Icon from "./Icon";

export default function Services() {
  return (
    <Section id="services" eyebrow={s.eyebrow} title={s.title} icon="workflow" intro={s.intro} tint>
      {/* offerings */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {s.offerings.map((o, i) => (
          <div
            key={o.title}
            className="spotlight group relative rounded-2xl border border-[var(--hairline)] bg-[var(--card)] p-5 transition-transform hover:-translate-y-1"
            style={{ boxShadow: "var(--shadow)", "--reveal-delay": `${(i % 3) * 70}ms` }}
            data-reveal
          >
            <span className="grid size-10 place-items-center rounded-xl bg-[var(--header-tint)] text-[var(--accent)]">
              <Icon name={o.icon} size={20} />
            </span>
            <h3 className="mt-3 text-base font-bold text-[var(--navy)]">{o.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted)]">{o.desc}</p>
          </div>
        ))}
      </div>

      {/* platform "logo" wall */}
      <div className="mt-12" data-reveal>
        <h3 className="mb-5 text-sm font-bold uppercase tracking-wide text-[var(--navy)]">
          {s.platformsIntro}
        </h3>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {s.platforms.map((p) => (
            <li
              key={p.name}
              className="flex items-center gap-3 rounded-xl border border-[var(--hairline)] bg-[var(--pill-bg)] px-3.5 py-3 transition-all hover:-translate-y-0.5 hover:border-[var(--accent)]"
            >
              <span
                className="grid size-10 shrink-0 place-items-center rounded-lg text-sm font-extrabold text-white shadow-sm"
                style={{ background: `linear-gradient(140deg, ${p.color}, ${p.color}cc)` }}
                aria-hidden="true"
              >
                {p.short}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-[var(--navy)]">{p.name}</span>
                <span className="block truncate text-[11px] text-[var(--muted)]">{p.category}</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-[var(--muted)]">
          Platform names and colours are shown for reference only — all trademarks belong to their respective owners.
        </p>
      </div>
    </Section>
  );
}

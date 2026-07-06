import { experience } from "@/data/experience";
import Section from "./Section";
import Icon from "./Icon";

export default function Experience() {
  return (
    <Section id="experience" eyebrow="Experience" title="Six years across data, automation and IT" icon="briefcase">
      <ol className="relative ml-1">
        <span className="absolute left-[7px] top-2 bottom-2 w-px bg-[var(--hairline)]" aria-hidden="true" />
        {experience.map((job, i) => (
          <li key={i} className="relative pl-8 pb-10 last:pb-0" data-reveal style={{ "--reveal-delay": `${i * 70}ms` }}>
            <span
              className={`absolute left-0 top-1.5 grid size-[15px] place-items-center rounded-full ring-4 ring-[var(--page)] ${
                job.current ? "bg-[var(--accent)]" : "bg-[var(--bar-start)]"
              }`}
              aria-hidden="true"
            >
              {job.current && <span className="absolute inline-flex size-[15px] animate-ping rounded-full bg-[var(--accent)] opacity-60" />}
            </span>

            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
              <h3 className="text-base font-bold text-[var(--navy)] sm:text-lg">{job.role}</h3>
              <span className="shrink-0 text-xs font-medium text-[var(--muted)] sm:text-sm">{job.period}</span>
            </div>

            <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-sm font-semibold text-[var(--accent-strong)]">
              {job.org}
              <span className="inline-flex items-center gap-1 text-xs font-normal text-[var(--muted)]">
                <Icon name="map-pin" size={13} /> {job.location}
              </span>
              {job.current && (
                <span className="rounded-full bg-[var(--accent)]/12 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--accent-strong)] ring-1 ring-inset ring-[var(--accent)]/30">
                  Current
                </span>
              )}
            </p>

            <ul className="mt-3 space-y-2">
              {job.bullets.map((b, j) => (
                <li key={j} className="flex gap-2.5 text-sm leading-relaxed text-[var(--ink)]">
                  <Icon name="arrow-right" size={15} className="mt-1 shrink-0 text-[var(--accent)]" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </Section>
  );
}

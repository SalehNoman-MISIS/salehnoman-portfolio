import { projectsByOrder } from "@/data/projects";
import { moreProjects } from "@/data/more-projects";
import Section from "./Section";
import ProjectCard from "./ProjectCard";
import Icon from "./Icon";

export default function Projects() {
  return (
    <Section
      id="projects"
      eyebrow="Projects"
      title="Selected work — shipped end-to-end"
      icon="layers"
      intro="Machine learning, resilient web scraping, ETL, automation and full-stack apps — including commercial, licensed products. Click any card for the full case study."
      tint
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projectsByOrder.map((p, i) => (
          <ProjectCard key={p.slug} project={p} index={i} />
        ))}
      </div>

      <div className="mt-12" data-reveal>
        <h3 className="mb-5 text-sm font-bold uppercase tracking-wide text-[var(--navy)]">More builds</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {moreProjects.map((m) => (
            <div key={m.title} className="flex h-full flex-col rounded-xl border border-[var(--hairline)] bg-[var(--card)] p-5">
              <div className="flex items-start justify-between gap-3">
                <h4 className="text-sm font-bold text-[var(--navy)]">{m.title}</h4>
                {m.github && (
                  <a
                    href={m.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-[var(--muted)] transition-colors hover:text-[var(--accent-strong)]"
                    aria-label={`${m.title} on GitHub`}
                  >
                    <Icon name="github" size={17} />
                  </a>
                )}
              </div>
              <p className="mt-2 flex-1 text-xs leading-relaxed text-[var(--muted)]">{m.blurb}</p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {m.tech.map((t) => (
                  <li key={t} className="inline-flex items-center rounded-full border border-[var(--hairline)] bg-[var(--pill-bg)] px-2 py-0.5 text-[11px] font-medium text-[var(--accent-strong)]">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

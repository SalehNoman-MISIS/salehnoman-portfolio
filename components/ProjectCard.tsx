import type { Project } from "@/data/projects";
import SmartImage from "./SmartImage";
import Icon from "./Icon";

export default function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  const href = `/projects/${project.slug}`;
  const pills = project.tech.slice(0, 4);
  const extra = project.tech.length - pills.length;
  const thumb = `/screenshots/${project.slug}/${project.thumb}`;

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--hairline)] bg-[var(--card)] transition-all duration-300 hover:-translate-y-1"
      style={{ boxShadow: "var(--shadow)", borderLeft: "4px solid var(--accent)", "--reveal-delay": `${(index % 3) * 80}ms` }}
      data-reveal
    >
      <a href={href} className="flex h-full flex-col">
        <div className="relative aspect-[16/10] overflow-hidden border-b border-[var(--hairline)] bg-[var(--header-tint)]">
          <SmartImage
            src={thumb}
            alt={`${project.title} — preview`}
            fit="cover"
            priority={index < 3}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
            className="transition-transform duration-500 group-hover:scale-[1.04]"
          />
          {project.featured && (
            <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-[var(--page)]/90 px-2.5 py-1 text-[11px] font-bold text-[var(--accent-strong)] shadow-sm backdrop-blur ring-1 ring-inset ring-[var(--hairline)]">
              <Icon name="sparkles" size={12} /> Featured
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--accent)]">{project.category}</p>
          <h3 className="mt-1.5 text-lg font-bold leading-snug text-[var(--navy)] transition-colors group-hover:text-[var(--accent-strong)]">
            {project.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{project.oneLiner}</p>

          <ul className="mt-4 flex flex-wrap gap-1.5">
            {pills.map((t) => (
              <li key={t} className="inline-flex items-center rounded-full border border-[var(--hairline)] bg-[var(--pill-bg)] px-2 py-0.5 text-[11px] font-medium text-[var(--accent-strong)]">
                {t}
              </li>
            ))}
            {extra > 0 && <li className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[11px] font-medium text-[var(--muted)]">+{extra} more</li>}
          </ul>

          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent-strong)]">
            View case study
            <Icon name="arrow-right" size={16} className="transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </a>
    </article>
  );
}

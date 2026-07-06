import type { ReactNode } from "react";
import Icon from "./Icon";

export default function Section({
  id,
  eyebrow,
  title,
  icon,
  intro,
  tint = false,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  icon?: string;
  intro?: string;
  tint?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-24 py-16 sm:py-20 lg:py-24"
      style={tint ? { backgroundColor: "var(--header-tint)" } : undefined}
    >
      <div className="mx-auto w-full max-w-[1140px] px-5 sm:px-6 lg:px-8">
        <header className="mb-10 sm:mb-12" data-reveal>
          <p className="section-title flex items-center gap-2 text-xs sm:text-sm">
            {icon && <Icon name={icon} size={16} className="text-[var(--accent)]" />}
            <span>{eyebrow}</span>
          </p>
          <h2 className="mt-2 max-w-3xl text-2xl font-extrabold tracking-tight text-[var(--navy)] sm:text-3xl lg:text-4xl">
            {title}
          </h2>
          <span className="mt-3 block h-0.5 w-12 rounded-full bg-[var(--accent)]" />
          {intro && (
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--muted)]">
              {intro}
            </p>
          )}
        </header>
        {children}
      </div>
    </section>
  );
}

import type { ReactNode } from "react";

type Props = {
  title: string;
  description: string;
  children: ReactNode;
};

export function StaticPage({ title, description, children }: Props) {
  return (
    <main className="flex flex-1 flex-col">
      <section className="page-px relative border-b border-[color:var(--header-border)]/80 py-[var(--section-py)]">
        <div className="page-container max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[color:var(--header-border)] bg-[var(--header-surface)] px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--hero-muted)] backdrop-blur-md">
            <span className="size-1 rounded-full bg-[var(--accent)]" />
            Install fonts
          </div>
          <h1 className="text-3xl font-semibold tracking-[-0.02em] text-[var(--foreground)] sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-[var(--hero-muted)] sm:text-lg">
            {description}
          </p>
        </div>
      </section>

      <section className="page-px relative pb-20 pt-10 md:pb-24 md:pt-12">
        <div className="page-container max-w-3xl">
          <div className="static-prose space-y-5 text-sm leading-relaxed text-[var(--foreground)]/90 sm:text-base">
            {children}
          </div>
        </div>
      </section>
    </main>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { APP_STORE_IFONT_URL } from "@/lib/mobile-app-links";
import { AppleMark } from "@/components/MobileAppStoreIcons";
import { AccentTitle } from "@/components/AccentTitle";
import { prefersReducedMotion } from "@/lib/motion";
import type { HomeMarketingSection } from "@/data/home-marketing";

type TabIconName =
  | "devices"
  | "library"
  | "import"
  | "identify"
  | "features"
  | "shield";

type TabEntry = {
  key: string;
  tabLabel: string;
  icon: TabIconName;
  title: string;
  paragraphs: string[];
  highlights: string[];
};

const TAB_LABELS: Record<string, string> = {
  "apple-screens": "Every Screen",
  library: "Font Library",
  "more-features": "More Features",
  trusted: "Trusted & Safe",
};

const TAB_ICONS: Record<string, TabIconName> = {
  "apple-screens": "devices",
  library: "library",
  "more-features": "features",
  trusted: "shield",
};

const MAX_HIGHLIGHTS = 8;

/** Pulls a short list of "feature title" style highlights out of whatever
 * structured field a section happens to have populated. */
function featureHighlights(section: HomeMarketingSection): string[] {
  if (section.blocks?.length) return section.blocks.map((b) => b.title);
  if (section.labeledItems?.length) return section.labeledItems.map((i) => i.label);
  if (section.bullets?.length) return section.bullets;
  if (section.reasons?.length) return section.reasons.map((r) => r.title);
  if (section.subtitle) return [section.subtitle];
  return [];
}

/** "import-finder" renders as two cards (Import + Identify) everywhere
 * else on the site, so it becomes two separate tabs here too - one entry
 * per real section title, not one merged tab. */
function buildTabEntries(sections: HomeMarketingSection[]): TabEntry[] {
  const entries: TabEntry[] = [];

  for (const section of sections) {
    if (section.id === "import-finder") {
      entries.push({
        key: "import",
        tabLabel: "Import Fonts",
        icon: "import",
        title: section.title,
        paragraphs: section.paragraphs,
        highlights: section.blocks?.map((b) => b.title) ?? section.bullets ?? [],
      });
      entries.push({
        key: "identify",
        tabLabel: "Identify a Font",
        icon: "identify",
        title: section.subtitle ?? "Identify a Font From an Image",
        paragraphs: section.afterSubtitle ?? [],
        highlights: section.labeledItems?.map((i) => i.label) ?? [],
      });
      continue;
    }

    entries.push({
      key: section.id,
      tabLabel: TAB_LABELS[section.id] ?? section.title,
      icon: TAB_ICONS[section.id] ?? "features",
      title: section.title,
      paragraphs: section.paragraphs,
      highlights: featureHighlights(section),
    });
  }

  return entries;
}

function TabIcon({ name, className }: { name: TabIconName; className?: string }) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };
  switch (name) {
    case "devices":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="12.5" height="9" rx="1.3" />
          <rect x="14.5" y="9.5" width="6.5" height="10.5" rx="1.3" />
        </svg>
      );
    case "library":
      return (
        <svg {...common}>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      );
    case "import":
      return (
        <svg {...common}>
          <path d="M12 4v10" />
          <path d="M8 10l4 4 4-4" />
          <path d="M5 18h14" />
        </svg>
      );
    case "identify":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="6.5" />
          <path d="M16 16l4 4" />
        </svg>
      );
    case "features":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="7" height="7" rx="1.2" />
          <rect x="13" y="4" width="7" height="7" rx="1.2" />
          <rect x="4" y="13" width="7" height="7" rx="1.2" />
          <rect x="13" y="13" width="7" height="7" rx="1.2" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 3.2l7 2.8v5.7c0 4.6-3 7.7-7 9.1-4-1.4-7-4.5-7-9.1V6l7-2.8z" />
          <path d="M9 12l2 2 4-4.2" />
        </svg>
      );
  }
}

function ArrowIcon({ direction, className }: { direction: "left" | "right"; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {direction === "left" ? <path d="M14.5 6l-6 6 6 6" /> : <path d="M9.5 6l6 6-6 6" />}
    </svg>
  );
}

/**
 * Mobile-only summary of sections 6-11 ("Powerful Features"): a tab strip
 * of section names, a content panel below that swaps per tab, and an
 * auto-advancing slider (paused on hover/touch and while off-screen) so it
 * cycles through every section on its own. Rendered only under `md:hidden`
 * by the caller - large screens keep rendering those sections as before,
 * untouched.
 */
export function HomePowerfulFeaturesTabs({
  sections,
}: {
  sections: HomeMarketingSection[];
}) {
  const entries = buildTabEntries(sections);
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const pausedRef = useRef(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const playRef = useRef<() => void>(() => {});
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const count = entries.length;
  const current = entries[active] ?? entries[0];

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel || prefersReducedMotion() || count < 2) return;

    let timer: number | undefined;
    let inView = false;

    const stop = () => {
      window.clearTimeout(timer);
      timer = undefined;
    };
    const play = () => {
      stop();
      if (!inView || pausedRef.current) return;
      timer = window.setTimeout(() => {
        setDirection(1);
        setActive((i) => (i + 1) % count);
        play();
      }, 3800);
    };
    playRef.current = play;

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = Boolean(entry?.isIntersecting);
        if (inView) play();
        else stop();
      },
      { threshold: 0.3 },
    );
    io.observe(panel);
    return () => {
      io.disconnect();
      stop();
    };
  }, [count]);

  useEffect(() => {
    tabRefs.current[active]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [active]);

  if (!current) return null;

  const pause = () => {
    pausedRef.current = true;
    panelRef.current?.classList.add("is-paused");
  };
  const resume = () => {
    pausedRef.current = false;
    panelRef.current?.classList.remove("is-paused");
    playRef.current();
  };

  const goTo = (index: number, dir: 1 | -1) => {
    setDirection(dir);
    setActive(((index % count) + count) % count);
    playRef.current();
  };

  const highlights = current.highlights.slice(0, MAX_HIGHLIGHTS);
  const extraCount = current.highlights.length - highlights.length;

  return (
    <section className="full-bleed page-px relative border-t border-[color:var(--header-border)]/40 py-9">
      <div className="w-full text-center">
        <span className="mb-2 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--hero-muted)]">
          <span className="size-1 rounded-full bg-[var(--accent)]" />
          Powerful Features
        </span>
        <h2 className="section-h2">Everything Install Font Can Do</h2>
      </div>

      <nav
        aria-label="Powerful features"
        className="powerful-feature-tabs-scroll relative mt-6 flex flex-nowrap gap-1 overflow-x-auto overscroll-x-contain border-b border-[color:var(--header-border)] pb-0"
      >
        {entries.map((entry, i) => {
          const on = i === active;
          return (
            <button
              key={entry.key}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              onClick={() => goTo(i, i > active ? 1 : i < active ? -1 : 1)}
              aria-pressed={on}
              className={`group relative inline-flex shrink-0 snap-start items-center gap-2 px-3.5 pb-3.5 pt-2 text-[13.5px] font-semibold leading-snug tracking-tight transition-colors duration-200 ${
                on ? "text-[var(--accent)]" : "text-[var(--hero-muted)] hover:text-[var(--foreground)]"
              }`}
            >
              <TabIcon
                name={entry.icon}
                className={`size-4 transition-opacity duration-200 ${on ? "opacity-100" : "opacity-50 group-hover:opacity-80"}`}
              />
              {entry.tabLabel}
              <span
                className={`absolute inset-x-2 -bottom-px h-[2px] rounded-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent)] transition-opacity duration-200 ${
                  on ? "opacity-100" : "opacity-0"
                }`}
                aria-hidden
              />
            </button>
          );
        })}
      </nav>

      <div
        ref={panelRef}
        onPointerEnter={pause}
        onPointerLeave={resume}
        className="relative mt-5 min-h-[13rem]"
      >
        <div className="flex items-center justify-between gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_14%,transparent)] text-[var(--accent)]">
            <TabIcon name={current.icon} className="size-5" />
          </span>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] tabular-nums tracking-[0.16em] text-[var(--hero-muted)]">
              {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Previous feature"
                onClick={() => goTo(active - 1, -1)}
                className="flex size-10 items-center justify-center rounded-full border border-[color:var(--header-border)] bg-[var(--header-surface)]/60 text-[var(--foreground)] transition-colors duration-200 hover:border-[color:var(--accent)] hover:bg-[color-mix(in_oklab,var(--accent)_14%,transparent)] hover:text-[var(--accent)] active:scale-95"
              >
                <ArrowIcon direction="left" className="size-4.5" />
              </button>
              <button
                type="button"
                aria-label="Next feature"
                onClick={() => goTo(active + 1, 1)}
                className="flex size-10 items-center justify-center rounded-full border border-[color:var(--header-border)] bg-[var(--header-surface)]/60 text-[var(--foreground)] transition-colors duration-200 hover:border-[color:var(--accent)] hover:bg-[color-mix(in_oklab,var(--accent)_14%,transparent)] hover:text-[var(--accent)] active:scale-95"
              >
                <ArrowIcon direction="right" className="size-4.5" />
              </button>
            </div>
          </div>
        </div>

        <div
          key={current.key}
          className={direction === 1 ? "powerful-feature-slide-next" : "powerful-feature-slide-prev"}
        >
          <h3 className="mt-3 text-[1.4rem] font-semibold leading-[1.2] tracking-[-0.02em] text-[var(--foreground)]">
            <AccentTitle text={current.title} />
          </h3>
          {current.paragraphs[0] ? (
            <p className="mt-2.5 text-sm leading-relaxed text-[var(--hero-muted)]">
              {current.paragraphs[0]}
            </p>
          ) : null}

          {highlights.length ? (
            <ul className="mt-4 flex flex-wrap gap-2">
              {highlights.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-[color:color-mix(in_oklab,var(--accent)_30%,var(--header-border))] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] px-3 py-1.5 text-[12px] font-medium text-[var(--foreground)]"
                >
                  {item}
                </li>
              ))}
              {extraCount > 0 ? (
                <li className="rounded-full border border-[color:var(--header-border)] px-3 py-1.5 text-[12px] font-medium text-[var(--hero-muted)]">
                  +{extraCount} more
                </li>
              ) : null}
            </ul>
          ) : null}
        </div>

        <span
          key={active}
          className="more-feat-progress mt-5 block h-px w-full origin-left bg-[var(--accent)]"
          aria-hidden
        />
      </div>

      {/* Shared CTA - stays put across every tab instead of fading with the slider. */}
      <div className="mt-5 flex justify-center">
        <a
          href={APP_STORE_IFONT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="cta-highlight cta-highlight-compact"
        >
          <AppleMark className="size-4" />
          Try Free Now
        </a>
      </div>
    </section>
  );
}

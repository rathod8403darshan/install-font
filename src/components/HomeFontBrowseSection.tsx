"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  CATEGORY_META,
  CATEGORY_ORDER,
  getAllCategoryFonts,
  getCategoryFonts,
  type FontCategorySlug,
} from "@/data/font-categories";
import {
  getSubcategories,
  isSubcategorySlug,
} from "@/data/category-subcategories";
import { CategoryFontSection } from "@/components/CategoryFontSection";
import { FontSortDropdown } from "@/components/FontSortDropdown";
import {
  DEFAULT_FONT_SORT,
  sortCategoryFonts,
  type FontSortMode,
} from "@/lib/font-sort";

type BrowseCategory = FontCategorySlug | "all";

const HOME_PAGE_SIZE = 20;

function chipClass(active: boolean) {
  return `inline-flex shrink-0 snap-start rounded-full border px-3 py-1.5 text-center text-[11.5px] font-medium leading-snug tracking-tight transition-colors duration-200 sm:px-3.5 sm:py-2 sm:text-[12.5px] md:text-[13px] ${
    active
      ? "border-[color:var(--chip-active-border)] bg-[var(--chip-active-bg)] text-[var(--foreground)]"
      : "border-[color:var(--header-border)] bg-[var(--chip-bg)] text-[var(--foreground)]/88 hover:border-[color:color-mix(in_oklab,var(--brand-blue)_24%,var(--header-border))] hover:bg-[var(--header-hover)] hover:text-[var(--foreground)]"
  }`;
}

export function HomeFontBrowseSection() {
  const [category, setCategory] = useState<BrowseCategory>("all");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [sort, setSort] = useState<FontSortMode>(DEFAULT_FONT_SORT);

  const subs = category !== "all" ? getSubcategories(category) : [];

  const filtered = useMemo(() => {
    if (category === "all") {
      return getAllCategoryFonts();
    }
    if (activeTag && isSubcategorySlug(category, activeTag)) {
      return getCategoryFonts(category, activeTag);
    }
    return getCategoryFonts(category);
  }, [category, activeTag]);

  const sorted = useMemo(
    () => sortCategoryFonts(filtered, sort),
    [filtered, sort],
  );

  const title =
    category === "all"
      ? "Browse All Fonts"
      : activeTag
        ? (subs.find((s) => s.slug === activeTag)?.label ??
          CATEGORY_META[category].label)
        : CATEGORY_META[category].label;

  const subtitle =
    category === "all"
      ? "Thousands of free Google Fonts - filter by category, topic, and sort order."
      : CATEGORY_META[category].blurb;

  const onCategoryChange = (next: BrowseCategory) => {
    setCategory(next);
    setActiveTag(null);
  };

  return (
    <section
      id="browse-fonts"
      className="content-section page-px relative border-t border-[color:var(--header-border)]/80 py-[var(--section-py)]"
    >
      <div className="page-container">
        <header className="mb-6">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[color:var(--header-border)] bg-[var(--header-surface)] px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--hero-muted)]">
            <span className="size-1 rounded-full bg-[var(--accent)]" />
            {sorted.length} fonts
          </div>
          <p className="max-w-2xl text-sm text-[var(--hero-muted)] sm:text-base">
            Pick a category and topic, then sort by what you need.
          </p>
        </header>

        <nav
          aria-label="Font categories"
          className="category-chip-scroll mb-4 flex flex-nowrap items-center gap-2 overflow-x-auto overscroll-x-contain pb-0.5 md:flex-wrap md:gap-2.5 md:overflow-visible"
        >
          <button
            type="button"
            onClick={() => onCategoryChange("all")}
            className={chipClass(category === "all")}
          >
            All
          </button>
          {CATEGORY_ORDER.map((slug) => (
            <button
              key={slug}
              type="button"
              onClick={() => onCategoryChange(slug)}
              className={chipClass(category === slug)}
            >
              <span className="md:hidden">{CATEGORY_META[slug].navLabel}</span>
              <span className="hidden md:inline">{CATEGORY_META[slug].label}</span>
            </button>
          ))}
        </nav>

        {category !== "all" ? (
          <nav
            aria-label="Font topics"
            className="category-chip-scroll mb-6 flex flex-nowrap items-center gap-2 overflow-x-auto overscroll-x-contain pb-0.5 md:flex-wrap md:gap-2.5 md:overflow-visible"
          >
            <button
              type="button"
              onClick={() => setActiveTag(null)}
              className={chipClass(!activeTag)}
            >
              All
            </button>
            {subs.map((sub) => (
              <button
                key={sub.slug}
                type="button"
                onClick={() => setActiveTag(sub.slug)}
                className={chipClass(activeTag === sub.slug)}
              >
                <span className="md:hidden">{sub.shortLabel}</span>
                <span className="hidden md:inline">{sub.label}</span>
              </button>
            ))}
          </nav>
        ) : null}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-semibold tracking-[-0.025em] text-[var(--foreground)] sm:text-3xl md:text-4xl lg:text-[2.6rem]">
              {title}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--hero-muted)] sm:text-base">
              {subtitle}
            </p>
            {category !== "all" ? (
              <Link
                href={`/fonts/${category}`}
                className="mt-3 inline-flex text-sm font-medium text-[var(--accent)] transition-opacity hover:opacity-80"
              >
                Open full {CATEGORY_META[category].shortLabel} page →
              </Link>
            ) : null}
          </div>
          <FontSortDropdown value={sort} onChange={setSort} className="shrink-0" />
        </div>

        <CategoryFontSection
          key={`home-${category}-${activeTag ?? "all"}-${sort}`}
          items={sorted}
          sectionId={`home-browse-${category}-${activeTag ?? "all"}-${sort}`}
          pageSize={HOME_PAGE_SIZE}
        />
      </div>
    </section>
  );
}

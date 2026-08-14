"use client";

import Link from "next/link";
import { CATEGORY_META, type FontCategorySlug } from "@/data/font-categories";
import type { FontSearchResult } from "@/lib/font-search";

function resultAccent(result: FontSearchResult): string | undefined {
  const slug =
    result.kind === "category"
      ? (result.slug as FontCategorySlug)
      : result.category;
  if (!slug || !(slug in CATEGORY_META)) return undefined;
  return CATEGORY_META[slug as FontCategorySlug].accent;
}

type Props = {
  listboxId: string;
  results: FontSearchResult[];
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  onSelect: (result: FontSearchResult) => void;
  query: string;
  showEmpty: boolean;
  showHint?: boolean;
  className?: string;
  emptyClassName?: string;
};

export function FontSearchResults({
  listboxId,
  results,
  activeIndex,
  onActiveIndexChange,
  onSelect,
  query,
  showEmpty,
  showHint = false,
  className = "",
  emptyClassName = "px-3 py-8 text-center text-sm text-[var(--hero-muted)]",
}: Props) {
  return (
    <div className={className}>
      {showHint ? (
        <p className="px-3 py-5 text-center text-sm text-[var(--hero-muted)]">
          Type a font name, movie title, or category
        </p>
      ) : null}

      {showEmpty ? (
        <p className={emptyClassName}>
          No fonts found for &ldquo;{query.trim()}&rdquo;
        </p>
      ) : null}

      {results.length > 0 ? (
        <ul
          id={listboxId}
          role="listbox"
          aria-label="Search results"
          className="flex flex-col gap-0.5"
        >
          {results.map((result, index) => {
            const active = index === activeIndex;
            const accent = resultAccent(result);

            return (
              <li key={`${result.kind}-${result.slug}`} role="presentation">
                <Link
                  id={`${listboxId}-option-${index}`}
                  role="option"
                  aria-selected={active}
                  href={result.href}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelect(result);
                  }}
                  onMouseEnter={() => onActiveIndexChange(index)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                    active
                      ? "bg-[var(--header-hover)] text-[var(--foreground)]"
                      : "text-[var(--foreground)]/90 hover:bg-[var(--header-hover)]/70"
                  }`}
                >
                  <span
                    className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-[color:var(--header-border)] bg-[var(--header-surface)] text-[11px] font-semibold uppercase tracking-wide text-[var(--hero-muted)]"
                    style={
                      accent
                        ? {
                            boxShadow: `0 0 0 1px color-mix(in oklab, var(--${accent}) 35%, transparent)`,
                          }
                        : undefined
                    }
                  >
                    {result.kind === "category" ? "#" : "Aa"}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">
                      {result.title}
                    </span>
                    <span className="block truncate text-xs text-[var(--hero-muted)]">
                      {result.subtitle}
                    </span>
                  </span>
                  <span className="shrink-0 text-[10px] font-medium uppercase tracking-wider text-[var(--header-muted)]">
                    {result.kind === "category" ? "Category" : "Font"}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

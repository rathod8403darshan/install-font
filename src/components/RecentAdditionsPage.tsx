"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { recentAdditions } from "@/data/font-showcase";
import { ShowcaseFontGrid } from "@/components/ShowcaseFontGrid";
import { FontSortDropdown } from "@/components/FontSortDropdown";
import { LoadMoreButton } from "@/components/LoadMoreButton";
import { useLoadMore } from "@/hooks/use-load-more";
import { DEFAULT_FONT_SORT, type FontSortMode } from "@/lib/font-sort";
import { sortShowcaseCards } from "@/lib/showcase-sort";
import { AccentTitle } from "@/components/AccentTitle";

const PAGE_SIZE = 8;

export function RecentAdditionsPage() {
  const [sort, setSort] = useState<FontSortMode>("latest");

  const sorted = useMemo(
    () => sortShowcaseCards(recentAdditions, sort),
    [sort],
  );

  const { visibleItems, visibleCount, total, hasMore, remaining, loadMore } =
    useLoadMore(sorted, PAGE_SIZE);

  return (
    <main className="flex flex-1 flex-col">
      <section className="page-px relative border-b border-[color:var(--header-border)]/80 py-[var(--section-py)]">
        <div className="page-container">
          <header className="mx-auto mb-10 max-w-2xl text-center md:mb-12">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[color:var(--header-border)] bg-[var(--header-surface)] px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--hero-muted)]">
              <span className="size-1 rounded-full bg-[var(--accent)]" />
              {total} fonts
            </div>
            <h1 className="text-3xl font-semibold tracking-[-0.02em] text-[var(--foreground)] sm:text-4xl md:text-[2.75rem]">
              <AccentTitle text="Recent Additions" />
            </h1>
            <p className="mt-2 text-base text-[var(--hero-muted)] sm:text-lg">
              Latest and Greatest Fonts
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[var(--hero-muted)]/90">
              New picks added weekly - preview famous and trending typefaces,
              then open any font to download or install on your phone.
            </p>
          </header>

          <div className="mx-auto mb-8 max-w-md">
            <FontSortDropdown value={sort} onChange={setSort} />
          </div>

          <ShowcaseFontGrid
            items={visibleItems}
            sectionId={`recent-additions-${sort}`}
            surface="light"
          />

          {hasMore ? (
            <div className="mt-12 flex flex-col items-center gap-3">
              <p className="text-[12px] text-[var(--header-muted)]">
                Showing {visibleCount} of {total}
              </p>
              <LoadMoreButton onClick={loadMore} remaining={remaining} />
            </div>
          ) : null}

          <p className="mt-14 text-center text-sm text-[var(--hero-muted)]">
            <Link
              href="/"
              className="font-medium text-[var(--foreground)]/85 underline-offset-4 transition-colors hover:text-[var(--foreground)] hover:underline"
            >
              ← Back to home
            </Link>
            <span className="mx-2 opacity-40">·</span>
            <Link
              href="/fonts/movie"
              className="font-medium text-[var(--accent)] underline-offset-4 transition-colors hover:underline"
            >
              Browse all fonts
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

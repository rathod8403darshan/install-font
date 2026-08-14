"use client";

import { useEffect, useId, useMemo, useState } from "react";
import {
  PAGE_SIZE,
  buildCategoryStylesheetHref,
  type CategoryFont,
} from "@/data/font-categories";
import { useLoadMore } from "@/hooks/use-load-more";
import { FontCategoryGrid } from "@/components/FontCategoryGrid";
import { LoadMoreButton } from "@/components/LoadMoreButton";
import { FontSortDropdown } from "@/components/FontSortDropdown";
import {
  DEFAULT_FONT_SORT,
  sortCategoryFonts,
  type FontSortMode,
} from "@/lib/font-sort";

type Props = {
  items: CategoryFont[];
  sectionId: string;
  pageSize?: number;
  /** Show Popular / Trending / Latest dropdown above the grid. */
  showSort?: boolean;
};

export function CategoryFontSection({
  items,
  sectionId,
  pageSize = PAGE_SIZE,
  showSort = false,
}: Props) {
  const linkId = useId().replace(/:/g, "");
  const [sort, setSort] = useState<FontSortMode>(DEFAULT_FONT_SORT);

  const sortedItems = useMemo(
    () => (showSort ? sortCategoryFonts(items, sort) : items),
    [items, showSort, sort],
  );

  const sectionKey = showSort ? `${sectionId}-${sort}` : sectionId;

  const { visibleItems, visibleCount, total, hasMore, remaining, loadMore } =
    useLoadMore(sortedItems, pageSize);

  useEffect(() => {
    const href = buildCategoryStylesheetHref(visibleItems);
    if (!href) return;

    let link = document.getElementById(linkId) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.id = linkId;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
    link.href = href;

    return () => {
      link?.remove();
    };
  }, [linkId, visibleItems]);

  return (
    <>
      {showSort ? (
        <div className="mb-8">
          <FontSortDropdown
            value={sort}
            onChange={setSort}
            className="w-full max-w-none"
          />
          <p className="mt-4 text-[12px] text-[var(--header-muted)]">
            Showing {visibleCount} of {total}
          </p>
        </div>
      ) : (
        <p className="mb-6 text-[12px] text-[var(--header-muted)]">
          Showing {visibleCount} of {total}
        </p>
      )}
      <FontCategoryGrid items={visibleItems} sectionId={sectionKey} />
      {hasMore ? (
        <div className="mt-12 flex flex-col items-center gap-3">
          <LoadMoreButton onClick={loadMore} remaining={remaining} />
        </div>
      ) : null}
    </>
  );
}

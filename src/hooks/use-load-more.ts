"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { PAGE_SIZE } from "@/data/font-categories";

export function useLoadMore<T>(items: T[], pageSize: number = PAGE_SIZE) {
  const total = items.length;
  const [visibleCount, setVisibleCount] = useState(() =>
    Math.min(pageSize, total),
  );

  useEffect(() => {
    setVisibleCount(Math.min(pageSize, items.length));
  }, [items, pageSize]);

  const visibleItems = useMemo(
    () => items.slice(0, visibleCount),
    [items, visibleCount],
  );

  const hasMore = visibleCount < total;
  const remaining = total - visibleCount;

  const loadMore = useCallback(() => {
    setVisibleCount((count) => Math.min(count + pageSize, total));
  }, [pageSize, total]);

  return {
    visibleItems,
    visibleCount,
    total,
    hasMore,
    remaining,
    loadMore,
  };
}

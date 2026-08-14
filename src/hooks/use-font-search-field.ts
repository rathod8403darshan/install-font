"use client";

import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { searchFonts, type FontSearchResult } from "@/lib/font-search";

type Options = {
  limit?: number;
  onNavigate?: () => void;
};

export function useFontSearchField({ limit = 12, onNavigate }: Options = {}) {
  const router = useRouter();
  const listboxId = useId();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const trimmedQuery = query.trim();
  const results = useMemo(
    () => searchFonts(query, limit),
    [query, limit],
  );

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const goToResult = useCallback(
    (result: FontSearchResult) => {
      onNavigate?.();
      router.push(result.href);
    },
    [onNavigate, router],
  );

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const pick = results[activeIndex] ?? results[0];
      if (pick) goToResult(pick);
    },
    [activeIndex, goToResult, results],
  );

  const onInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (results.length === 0) return;
        setActiveIndex((i) => (i + 1) % results.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (results.length === 0) return;
        setActiveIndex((i) => (i - 1 + results.length) % results.length);
      } else if (e.key === "Enter" && results.length > 0) {
        e.preventDefault();
        goToResult(results[activeIndex] ?? results[0]!);
      }
    },
    [activeIndex, goToResult, results],
  );

  return {
    query,
    setQuery,
    trimmedQuery,
    activeIndex,
    setActiveIndex,
    results,
    listboxId,
    onSubmit,
    onInputKeyDown,
    goToResult,
    showEmpty: trimmedQuery.length > 0 && results.length === 0,
    showResults: results.length > 0,
  };
}

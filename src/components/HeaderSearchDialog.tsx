"use client";

import { useCallback, useEffect, useRef } from "react";
import { FontSearchResults } from "@/components/FontSearchResults";
import { useFontSearchField } from "@/hooks/use-font-search-field";

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3-3" />
    </svg>
  );
}

type Props = {
  open: boolean;
  onClose: () => void;
  panelRef: React.RefObject<HTMLDivElement | null>;
  backdropRef: React.RefObject<HTMLButtonElement | null>;
};

export function HeaderSearchDialog({
  open,
  onClose,
  panelRef,
  backdropRef,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const search = useFontSearchField({
    limit: 12,
    onNavigate: onClose,
  });

  const reset = useCallback(() => {
    search.setQuery("");
    search.setActiveIndex(0);
  }, [search.setQuery, search.setActiveIndex]);

  useEffect(() => {
    if (!open) {
      reset();
      return;
    }
    const id = window.setTimeout(() => inputRef.current?.focus(), 60);
    return () => window.clearTimeout(id);
  }, [open, reset]);

  const handleSelect = useCallback(
    (result: Parameters<typeof search.goToResult>[0]) => {
      reset();
      search.goToResult(result);
    },
    [reset, search],
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center px-4 pt-3 sm:px-6"
      role="dialog"
      aria-modal="true"
      aria-label="Search fonts"
    >
      <button
        ref={backdropRef}
        type="button"
        aria-label="Close search"
        className="absolute inset-0 bg-[var(--search-overlay)] backdrop-blur-md backdrop-saturate-150"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        className="relative z-10 flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-[color:var(--search-bar-border)] bg-[var(--search-bar-bg)] shadow-[0_24px_80px_-12px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:max-w-xl md:max-w-2xl"
      >
        <form
          onSubmit={search.onSubmit}
          className="flex items-center gap-3 border-b border-[color:var(--header-border)]/80 px-4 py-3 sm:px-5"
        >
          <SearchIcon className="size-5 shrink-0 text-[var(--header-muted)]" />
          <input
            ref={inputRef}
            type="search"
            value={search.query}
            onChange={(e) => search.setQuery(e.target.value)}
            onKeyDown={search.onInputKeyDown}
            placeholder="Search fonts, categories…"
            className="min-w-0 flex-1 bg-transparent text-[15px] text-[var(--foreground)] outline-none placeholder:text-[var(--search-input-placeholder)]"
            role="combobox"
            aria-expanded={search.showResults}
            aria-controls={search.listboxId}
            aria-autocomplete="list"
            aria-activedescendant={
              search.showResults
                ? `${search.listboxId}-option-${search.activeIndex}`
                : undefined
            }
            autoComplete="off"
          />
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[var(--header-muted)] tabular-nums tracking-wide transition-colors hover:bg-[var(--header-hover)] hover:text-[var(--foreground)]"
          >
            Esc
          </button>
        </form>

        <FontSearchResults
          listboxId={search.listboxId}
          results={search.results}
          activeIndex={search.activeIndex}
          onActiveIndexChange={search.setActiveIndex}
          onSelect={handleSelect}
          query={search.query}
          showEmpty={search.showEmpty}
          showHint={search.trimmedQuery.length === 0}
          className="max-h-[min(52vh,400px)] overflow-y-auto overscroll-contain px-2 py-2 sm:px-3"
        />
      </div>
    </div>
  );
}

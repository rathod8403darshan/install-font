"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FontSearchResults } from "@/components/FontSearchResults";
import { useFontSearchField } from "@/hooks/use-font-search-field";

function SearchGlyph({ className }: { className?: string }) {
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

const POPULAR_SEARCHES = [
  { label: "Movie fonts", query: "movie" },
  { label: "Neon script", query: "script" },
  { label: "Pixel game", query: "pixel" },
  { label: "Marker", query: "marker" },
] as const;

type Props = {
  submitButtonRef?: React.RefObject<HTMLButtonElement | null>;
  popularSectionRef?: React.RefObject<HTMLDivElement | null>;
};

export function HeroFontSearch({
  submitButtonRef,
  popularSectionRef,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const search = useFontSearchField({ limit: 8 });

  const panelOpen =
    dropdownOpen &&
    (search.showResults || search.showEmpty || search.trimmedQuery.length > 0);

  const closeDropdown = useCallback(() => {
    setDropdownOpen(false);
  }, []);

  useEffect(() => {
    const onDocPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        closeDropdown();
      }
    };
    document.addEventListener("pointerdown", onDocPointer);
    return () => document.removeEventListener("pointerdown", onDocPointer);
  }, [closeDropdown]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDropdown();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeDropdown]);

  const handleSelect = useCallback(
    (result: Parameters<typeof search.goToResult>[0]) => {
      closeDropdown();
      search.setQuery("");
      search.goToResult(result);
    },
    [closeDropdown, search],
  );

  const applyPopular = (query: string) => {
    search.setQuery(query);
    setDropdownOpen(true);
    inputRef.current?.focus();
  };

  return (
    <div ref={rootRef} className="relative z-[80] w-full isolate">
      <form
        role="search"
        onSubmit={search.onSubmit}
        className="group relative z-[2] flex flex-col gap-2 rounded-2xl border border-[color:var(--search-bar-border)] bg-[var(--search-bar-bg)] p-1.5 shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset,0_24px_60px_-28px_rgba(0,0,0,0.55)] backdrop-blur-2xl transition-[border-color,box-shadow] duration-300 focus-within:border-[color:color-mix(in_oklab,var(--brand-blue)_35%,var(--search-bar-border))] focus-within:shadow-[0_0_0_1px_color-mix(in_oklab,var(--brand-blue)_22%,transparent),0_24px_60px_-20px_color-mix(in_oklab,var(--accent)_18%,transparent)] sm:flex-row sm:items-center sm:gap-0 sm:p-2"
      >
        <div className="flex min-h-[48px] flex-1 items-center gap-3 px-3 sm:px-4">
          <SearchGlyph className="size-[18px] shrink-0 text-[var(--header-muted)] transition-colors duration-200 group-focus-within:text-[var(--brand-blue)]" />
          <input
            ref={inputRef}
            type="search"
            name="q"
            value={search.query}
            onChange={(e) => {
              search.setQuery(e.target.value);
              setDropdownOpen(true);
            }}
            onFocus={() => setDropdownOpen(true)}
            onKeyDown={search.onInputKeyDown}
            placeholder="Search typefaces, categories…"
            autoComplete="off"
            className="min-w-0 flex-1 bg-transparent text-[15px] text-[var(--foreground)] outline-none placeholder:text-[var(--search-input-placeholder)] sm:text-base"
            aria-label="Search fonts"
            role="combobox"
            aria-expanded={panelOpen}
            aria-controls={search.listboxId}
            aria-autocomplete="list"
            aria-activedescendant={
              search.showResults
                ? `${search.listboxId}-option-${search.activeIndex}`
                : undefined
            }
          />
          <kbd className="hidden shrink-0 items-center gap-1 rounded-md border border-[color:var(--header-border)] bg-[var(--header-hover)] px-1.5 py-0.5 font-mono text-[10px] font-medium text-[var(--header-muted)] sm:inline-flex">
            ⌘ K
          </kbd>
        </div>
        <button
          ref={submitButtonRef}
          type="submit"
          className="mx-1.5 mb-1.5 shrink-0 rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-zinc-950 shadow-[0_0_24px_-6px_color-mix(in_oklab,var(--accent)_45%,transparent)] transition-[filter,box-shadow] duration-200 hover:brightness-110 hover:shadow-[0_0_36px_-4px_color-mix(in_oklab,var(--accent)_60%,transparent)] active:scale-[0.98] sm:mx-0 sm:mb-0 sm:py-2.5"
        >
          Search
        </button>
      </form>

      {panelOpen ? (
        <div
          className="relative z-[1] mt-2 overflow-hidden rounded-2xl border border-[color:var(--search-bar-border)] bg-[var(--search-bar-bg)] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.65)] backdrop-blur-2xl"
          role="region"
          aria-label="Search suggestions"
        >
          <FontSearchResults
            listboxId={search.listboxId}
            results={search.results}
            activeIndex={search.activeIndex}
            onActiveIndexChange={search.setActiveIndex}
            onSelect={handleSelect}
            query={search.query}
            showEmpty={search.showEmpty}
            className="max-h-[min(42vh,280px)] overflow-y-auto overscroll-contain px-2 py-2"
          />
        </div>
      ) : null}

      <div
        ref={popularSectionRef}
        className={`mt-6 w-full transition-opacity duration-200 ${panelOpen ? "pointer-events-none opacity-40" : ""}`}
      >
        <p className="mb-2.5 text-center text-[12px] text-[var(--hero-muted)] lg:text-left">
          Popular:
        </p>
        <div className="-mx-[var(--page-gutter)] px-[var(--page-gutter)] sm:mx-0 sm:px-0">
          <div className="category-chip-scroll flex flex-nowrap items-center gap-2 overflow-x-auto overscroll-x-contain pb-1 sm:flex-wrap sm:justify-center sm:overflow-visible sm:pb-0 lg:justify-start">
            {POPULAR_SEARCHES.map(({ label, query }) => (
              <button
                key={label}
                type="button"
                onClick={() => applyPopular(query)}
                className="inline-flex shrink-0 rounded-full border border-[color:var(--header-border)] bg-[var(--header-surface)] px-3 py-1.5 text-[11.5px] text-[var(--foreground)]/80 backdrop-blur-md transition-[border-color,background-color,color,transform] duration-200 hover:-translate-y-px hover:border-[var(--accent)]/40 hover:bg-[var(--header-hover)] hover:text-[var(--foreground)]"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

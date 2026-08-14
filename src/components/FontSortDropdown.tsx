"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  DEFAULT_FONT_SORT,
  FONT_SORT_OPTIONS,
  type FontSortMode,
} from "@/lib/font-sort";

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`size-4 shrink-0 text-[var(--foreground)]/70 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      className="size-4 shrink-0 text-[var(--foreground)]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

type Props = {
  value?: FontSortMode;
  onChange: (mode: FontSortMode) => void;
  className?: string;
};

export function FontSortDropdown({
  value = DEFAULT_FONT_SORT,
  onChange,
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const activeLabel =
    FONT_SORT_OPTIONS.find((o) => o.value === value)?.label ?? "Trending";

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={`relative w-full sm:w-[min(100%,220px)] ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((o) => !o)}
        className="font-sort-trigger flex w-full items-center justify-between gap-3 rounded-2xl border border-[color:var(--header-border)] bg-[var(--header-surface-solid)] px-4 py-3 text-left text-[15px] font-medium text-[var(--foreground)] shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset] transition-[border-color,background-color,box-shadow] duration-200 hover:border-[color:color-mix(in_oklab,var(--accent)_28%,var(--header-border))] hover:bg-[var(--header-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
      >
        <span>{activeLabel}</span>
        <ChevronIcon open={open} />
      </button>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-label="Sort fonts"
          className="font-sort-menu absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-2xl border border-[color:var(--header-border)] bg-[var(--header-surface-solid)] py-1.5 shadow-[0_20px_50px_-16px_rgba(0,0,0,0.65)] backdrop-blur-xl"
        >
          {FONT_SORT_OPTIONS.map((option) => {
            const selected = option.value === value;
            return (
              <li key={option.value} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-[15px] transition-colors ${
                    selected
                      ? "bg-[var(--header-hover)] text-[var(--foreground)]"
                      : "text-[var(--foreground)]/88 hover:bg-[var(--header-hover)] hover:text-[var(--foreground)]"
                  }`}
                >
                  <span className="flex size-4 items-center justify-center">
                    {selected ? <CheckIcon /> : null}
                  </span>
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

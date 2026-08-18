"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  buildCategoryStylesheetHref,
  getCategoryFontBySlug,
  type CategoryFont,
} from "@/data/font-categories";
import { observeCardReveal } from "@/lib/motion";

const FEATURED_SLUGS = [
  "im-fell-english-sc",
  "grape-nuts",
  "devonshire",
  "dm-serif-text",
  "changa-one",
] as const;

function featuredFonts(): CategoryFont[] {
  return FEATURED_SLUGS.map((slug) => getCategoryFontBySlug(slug)).filter(
    (font): font is CategoryFont => Boolean(font),
  );
}

export function HomeDiscoverFontCards() {
  const rootRef = useRef<HTMLUListElement>(null);
  const items = featuredFonts();
  const stylesheetHref = buildCategoryStylesheetHref(items);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    return observeCardReveal(root, "[data-font-card]", 70);
  }, [items.length]);

  if (!items.length) return null;

  return (
    <>
      {stylesheetHref ? (
        <link rel="stylesheet" href={stylesheetHref} />
      ) : null}
      <ul
        ref={rootRef}
        className="font-card-grid mt-10 grid list-none grid-cols-2 gap-4 sm:mt-12 sm:gap-5 md:grid-cols-3 lg:grid-cols-5 lg:gap-6"
      >
        {items.map((item, index) => (
          <li
            key={item.slug}
            data-font-card
            className={`discover-card group/card ${index >= 4 ? "max-md:hidden" : ""}`}
            style={{ ["--delay" as never]: `${index * 0.18}s` }}
          >
            <div
              data-card-face
              className="discover-card-face relative aspect-[4/5] overflow-hidden rounded-[20px] border border-[color:var(--card-border)] bg-[var(--card-bg)]"
            >
              <div
                className="font-card-cursor-glow pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
                aria-hidden
              />
              <div className="discover-card-shine pointer-events-none absolute inset-0" aria-hidden />

              <div className="pointer-events-none absolute inset-x-3 top-3 z-30 flex items-center">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--card-border)] bg-[var(--chip-bg)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[var(--foreground)]/80">
                  <span className="discover-live-dot size-1 rounded-full bg-[var(--accent)]" />
                  Free
                </span>
              </div>

              <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-4 pb-12 pt-14 text-center">
                <span
                  className="discover-specimen text-[clamp(1.25rem,2.4vw,1.85rem)] leading-none tracking-tight text-[var(--foreground)]"
                  style={{ fontFamily: item.stack }}
                >
                  {item.family}
                </span>
              </div>

              <div className="pointer-events-none absolute inset-x-3 bottom-3 z-10 flex items-center justify-between text-[11px] text-[var(--foreground)]/55">
                <span className="truncate">{item.family}</span>
                <span
                  className="discover-aa text-base"
                  style={{ fontFamily: item.stack }}
                  aria-hidden
                >
                  Aa
                </span>
              </div>

              <Link
                href={`/fonts/${item.slug}`}
                aria-label={`Preview ${item.family}`}
                className="absolute inset-0 z-20"
              />
            </div>

            <Link
              href={`/fonts/${item.slug}`}
              className="mt-3 block text-left text-[13px] leading-snug text-[var(--foreground)]/85 transition-colors duration-300 hover:text-[var(--foreground)]"
            >
              {item.family}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

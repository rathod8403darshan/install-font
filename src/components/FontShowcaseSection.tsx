"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { ShowcaseCard } from "@/data/font-showcase";
import {
  PREVIEW_FONT_META,
  buildGoogleFontSnippet,
} from "@/fonts/preview-fonts";
import { PAGE_SIZE } from "@/data/font-categories";
import { useLoadMore } from "@/hooks/use-load-more";
import { observeCardReveal } from "@/lib/motion";
import { LoadMoreButton } from "@/components/LoadMoreButton";
import { CopyCssButton } from "@/components/CopyCssButton";
import { FontFavoriteButton } from "@/components/FontFavoriteButton";
import { AccentTitle } from "@/components/AccentTitle";
import { likedIdFromSlug } from "@/lib/liked-fonts";

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

type FontShowcaseSectionProps = {
  sectionId: string;
  title: string;
  subtitle: string;
  items: ShowcaseCard[];
  /** Cards revealed per “Load more” click (default: category page size). */
  pageSize?: number;
  viewMoreTop?: boolean;
  viewMoreBottom?: boolean;
  /** Category or listing URL for the header “View all” link. */
  viewMoreHref?: string;
};

export function FontShowcaseSection({
  sectionId,
  title,
  subtitle,
  items,
  pageSize = PAGE_SIZE,
  viewMoreTop = false,
  viewMoreBottom = true,
  viewMoreHref,
}: FontShowcaseSectionProps) {
  const rootRef = useRef<HTMLElement>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const { visibleItems, visibleCount, total, hasMore, remaining, loadMore } =
    useLoadMore(items, pageSize);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    return observeCardReveal(root, "[data-font-card]", 28);
  }, [sectionId, visibleCount]);

  const copyCss = async (item: ShowcaseCard, cardId: string) => {
    let snippet: string | null = null;
    if (item.fontKey) {
      const meta = PREVIEW_FONT_META[item.fontKey];
      snippet = buildGoogleFontSnippet(meta.googleQuery, meta.stack);
    } else if (item.googleQuery && item.stack) {
      snippet = buildGoogleFontSnippet(item.googleQuery, item.stack);
    }
    if (!snippet) return;
    try {
      await navigator.clipboard.writeText(snippet);
      setCopiedKey(cardId);
      window.setTimeout(() => setCopiedKey(null), 1800);
    } catch {
      setCopiedKey(null);
    }
  };

  // Build a single <link> for any category fonts in this section.
  const runtimeFamilies = visibleItems
    .filter((it) => !it.fontKey && it.googleQuery)
    .map((it) => `family=${it.googleQuery}`)
    .join("&");
  const runtimeHref = runtimeFamilies
    ? `https://fonts.googleapis.com/css2?${runtimeFamilies}&display=swap`
    : null;

  return (
    <section
      ref={rootRef}
      id={sectionId}
      className="content-section page-px relative border-t border-[color:var(--header-border)]/80 py-[var(--section-py)]"
    >
      <div className="page-container">
        <header className="mb-10 flex flex-col items-start gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-x-8 md:mb-12">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[color:var(--header-border)] bg-[var(--header-surface)] px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--hero-muted)] backdrop-blur-md">
              <span className="size-1 rounded-full bg-[var(--accent)]" />
              {total} fonts
            </div>
            <h2 className="text-3xl font-semibold tracking-[-0.02em] text-[var(--foreground)] sm:text-4xl md:text-[2.6rem]">
              <AccentTitle text={title} />
            </h2>
            <p className="mt-1.5 text-sm text-[var(--hero-muted)] sm:text-base">
              {subtitle}
            </p>
          </div>
          {viewMoreHref ? (
            <Link
              href={viewMoreHref}
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-[var(--foreground)]/80 transition-colors hover:text-[var(--foreground)]"
            >
              View all
              <ArrowIcon className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          ) : null}
        </header>

        {viewMoreTop && hasMore ? (
          <div className="mb-10 flex justify-center">
            <LoadMoreButton onClick={loadMore} remaining={remaining} />
          </div>
        ) : null}

        {runtimeHref ? <link rel="stylesheet" href={runtimeHref} /> : null}

        <ul className="font-card-grid grid list-none grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:gap-7">
          {visibleItems.map((item, index) => {
            const meta = item.fontKey ? PREVIEW_FONT_META[item.fontKey] : null;
            const cardId = `${sectionId}-${index}`;
            const familyName = meta
              ? meta.googleQuery.split(":")[0]?.replace(/\+/g, " ")
              : (item.family ?? item.label);
            const fontClass = meta?.className ?? "";
            const fontStyle: React.CSSProperties | undefined = meta
              ? undefined
              : item.stack
                ? { fontFamily: item.stack }
                : undefined;
            return (
              <li key={cardId} data-font-card className="group/card">
                <div
                  data-card-face
                  className="relative aspect-[4/5] overflow-hidden rounded-[20px] border border-[color:var(--card-border)] bg-[var(--card-bg)]"
                  style={
                    {
                      ["--mx" as never]: "50%",
                      ["--my" as never]: "50%",
                    } as React.CSSProperties
                  }
                >
                  <div
                    className="font-card-cursor-glow pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
                    aria-hidden
                  />

                  <div className="pointer-events-none absolute inset-0 rounded-[20px] ring-1 ring-inset ring-white/0 transition duration-300 group-hover/card:ring-white/10" />

                  <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-5 pb-12 pt-14 text-center">
                    <span
                      className={`text-[clamp(1.1rem,4.5vw,2.25rem)] leading-none tracking-tight text-[var(--foreground)] ${fontClass}`}
                      style={fontStyle}
                    >
                      {item.previewText}
                    </span>
                  </div>

                  <div className="pointer-events-none absolute inset-x-3 bottom-3 z-10 flex items-center justify-between text-[11px] text-[var(--foreground)]/55">
                    <span className="truncate">{familyName}</span>
                    <span
                      className={`text-base ${fontClass}`}
                      style={fontStyle}
                    >
                      Aa
                    </span>
                  </div>

                  <Link
                    href={`/fonts/${item.slug}`}
                    aria-label={`Open ${item.label}`}
                    className="absolute inset-0 z-20"
                  />

                  <div className="pointer-events-none absolute inset-x-3 top-3 z-30 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--card-border)] bg-[var(--chip-bg)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[var(--foreground)]/80 backdrop-blur">
                      <span className="size-1 rounded-full bg-[var(--accent)]" />
                      Free
                    </span>
                    <div className="pointer-events-auto flex items-center gap-1.5">
                      <CopyCssButton
                        copied={copiedKey === cardId}
                        onClick={(e) => {
                          e.stopPropagation();
                          copyCss(item, cardId);
                        }}
                      />
                      <FontFavoriteButton
                        likedId={likedIdFromSlug(item.slug)}
                        label={`Save ${item.label}`}
                        size="sm"
                      />
                    </div>
                  </div>
                </div>

                <Link
                  href={`/fonts/${item.slug}`}
                  className="mt-3 block text-left text-[13px] leading-snug text-[var(--foreground)]/85 transition-colors hover:text-[var(--foreground)]"
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {viewMoreBottom && hasMore ? (
          <div className="mt-14 flex flex-col items-center gap-3">
            <p className="text-[12px] text-[var(--header-muted)]">
              Showing {visibleCount} of {total}
            </p>
            <LoadMoreButton onClick={loadMore} remaining={remaining} />
          </div>
        ) : null}
      </div>
    </section>
  );
}

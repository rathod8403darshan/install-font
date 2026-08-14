"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  PREVIEW_FONT_META,
  buildGoogleFontSnippet,
} from "@/fonts/preview-fonts";
import type { ShowcaseCard } from "@/data/font-showcase";
import { observeCardReveal } from "@/lib/motion";
import { CopyCssButton } from "@/components/CopyCssButton";
import { FontFavoriteButton } from "@/components/FontFavoriteButton";
import { likedIdFromSlug } from "@/lib/liked-fonts";

export type ShowcaseGridItem = ShowcaseCard & {
  /** Exact id in liked storage (used on /liked page). */
  likedStorageId?: string;
};

type Props = {
  items: ShowcaseGridItem[];
  sectionId: string;
  /** Light = white preview tile (Recent Additions style). */
  surface?: "dark" | "light";
  /** Liked fonts page: hearts filled, actions always visible, unlike removes card. */
  likedPage?: boolean;
};

export function ShowcaseFontGrid({
  items,
  sectionId,
  surface = "dark",
  likedPage = false,
}: Props) {
  const rootRef = useRef<HTMLUListElement>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const isLight = surface === "light";

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    return observeCardReveal(root, "[data-font-card]", 28);
  }, [sectionId, items.length]);

  const runtimeFamilies = items
    .filter((it) => !it.fontKey && it.googleQuery)
    .map((it) => `family=${it.googleQuery}`)
    .join("&");
  const runtimeHref = runtimeFamilies
    ? `https://fonts.googleapis.com/css2?${runtimeFamilies}&display=swap`
    : null;

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

  return (
    <>
      {runtimeHref ? <link rel="stylesheet" href={runtimeHref} /> : null}
      <ul
        ref={rootRef}
        className="font-card-grid grid list-none grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:gap-7"
      >
        {items.map((item, index) => {
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
          const likedId = item.likedStorageId ?? likedIdFromSlug(item.slug);
          const actionBtnVisibility = likedPage
            ? "opacity-100"
            : "opacity-0 transition-[opacity,transform,background-color] duration-200 group-hover/card:translate-y-0 group-hover/card:opacity-100";

          return (
            <li key={cardId} data-font-card className="group/card">
              <div
                data-card-face
                className={
                  isLight
                    ? "relative aspect-square overflow-hidden rounded-[20px] border border-[color:color-mix(in_oklab,var(--foreground)_12%,transparent)] bg-white shadow-[0_12px_40px_-24px_rgba(0,0,0,0.45)]"
                    : "relative aspect-[4/5] overflow-hidden rounded-[20px] border border-[color:var(--card-border)] bg-[var(--card-bg)]"
                }
                style={
                  {
                    ["--mx" as never]: "50%",
                    ["--my" as never]: "50%",
                  } as React.CSSProperties
                }
              >
                {!isLight ? (
                  <div
                    className="font-card-cursor-glow pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
                    aria-hidden
                  />
                ) : null}

                <div
                  className={`pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-4 text-center ${isLight ? "pt-2 pb-2" : "px-5 pb-12 pt-14"}`}
                >
                  <span
                    className={`leading-none tracking-tight ${
                      isLight
                        ? `text-[clamp(0.95rem,3.8vw,1.65rem)] text-zinc-900 ${fontClass}`
                        : `text-[clamp(1.1rem,4.5vw,2.25rem)] text-[var(--foreground)] ${fontClass}`
                    }`}
                    style={fontStyle}
                  >
                    {item.previewText}
                  </span>
                </div>

                {!isLight ? (
                  <>
                    <div className="pointer-events-none absolute inset-x-3 bottom-3 z-10 flex items-center justify-between text-[11px] text-[var(--foreground)]/55">
                      <span className="truncate">{familyName}</span>
                      <span
                        className={`text-base ${fontClass}`}
                        style={fontStyle}
                      >
                        Aa
                      </span>
                    </div>
                    <div className="pointer-events-none absolute inset-x-3 top-3 z-30 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--card-border)] bg-[var(--chip-bg)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[var(--foreground)]/80">
                        <span className="size-1 rounded-full bg-[var(--accent)]" />
                        Free
                      </span>
                      <div className="pointer-events-auto flex items-center gap-1.5">
                        <CopyCssButton
                          copied={copiedKey === cardId}
                          visibilityClass={actionBtnVisibility}
                          onClick={(e) => {
                            e.stopPropagation();
                            copyCss(item, cardId);
                          }}
                        />
                        <FontFavoriteButton
                          likedId={likedId}
                          label={`Save ${item.label}`}
                          size="sm"
                          variant={likedPage ? "liked" : "card"}
                        />
                      </div>
                    </div>
                  </>
                ) : null}

                <Link
                  href={`/fonts/${item.slug}`}
                  aria-label={`Open ${item.label}`}
                  className="absolute inset-0 z-20"
                />
              </div>

              <Link
                href={`/fonts/${item.slug}`}
                className={`mt-3 block text-center text-[13px] leading-snug transition-colors sm:text-left ${
                  isLight
                    ? "text-[var(--foreground)]/90 hover:text-[var(--foreground)]"
                    : "text-[var(--foreground)]/85 hover:text-[var(--foreground)]"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}

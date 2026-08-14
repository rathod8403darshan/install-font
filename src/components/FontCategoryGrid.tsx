"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { CategoryFont } from "@/data/font-categories";
import { observeCardReveal } from "@/lib/motion";
import { FontFavoriteButton } from "@/components/FontFavoriteButton";
import { likedIdFromSlug } from "@/lib/liked-fonts";

type Props = {
  items: CategoryFont[];
  sectionId: string;
};

export function FontCategoryGrid({ items, sectionId }: Props) {
  const rootRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    return observeCardReveal(root, "[data-cat-card]", 28);
  }, [sectionId, items.length]);

  return (
    <ul
      ref={rootRef}
      className="font-card-grid grid list-none grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:gap-7 2xl:grid-cols-5 2xl:gap-8"
    >
      {items.map((item, index) => {
        const cardId = `${sectionId}-${index}`;
        return (
          <li key={cardId} data-cat-card className="group/card">
            <div
              data-cat-face
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
                  className="text-[clamp(1.35rem,2.7vw,2rem)] leading-none tracking-tight text-[var(--foreground)]"
                  style={{ fontFamily: item.stack }}
                >
                  {item.family}
                </span>
              </div>

              <div className="pointer-events-none absolute inset-x-3 bottom-3 z-10 flex items-center justify-between text-[11px] text-[var(--foreground)]/55">
                <span className="truncate">{item.family}</span>
                <span
                  className="text-base"
                  style={{ fontFamily: item.stack }}
                  aria-hidden
                >
                  Aa
                </span>
              </div>

              <Link
                href={`/fonts/${item.slug}`}
                aria-label={`Open ${item.family}`}
                className="absolute inset-0 z-20"
              />

              <div className="pointer-events-none absolute inset-x-3 top-3 z-30 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--card-border)] bg-[var(--chip-bg)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[var(--foreground)]/80">
                  <span className="size-1 rounded-full bg-[var(--accent)]" />
                  Free
                </span>
                <FontFavoriteButton
                  likedId={likedIdFromSlug(item.slug)}
                  label={`Save ${item.family}`}
                  size="sm"
                />
              </div>
            </div>

            <Link
              href={`/fonts/${item.slug}`}
              className="mt-3 block text-left text-[13px] leading-snug text-[var(--foreground)]/85 transition-colors hover:text-[var(--foreground)]"
            >
              {item.family}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

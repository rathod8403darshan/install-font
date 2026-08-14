"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ShowcaseFontGrid } from "@/components/ShowcaseFontGrid";
import { useLikedFonts } from "@/hooks/use-liked-fonts";
import { resolveLikedItems } from "@/lib/liked-fonts";

export function LikedFontsPage() {
  const { ids, count } = useLikedFonts();

  const items = useMemo(() => resolveLikedItems(ids), [ids]);
  const gridItems = useMemo(
    () =>
      items.map((item) => ({
        ...item.card,
        likedStorageId: item.id,
      })),
    [items],
  );

  return (
    <main className="flex flex-1 flex-col">
      <section className="page-px relative border-b border-[color:var(--header-border)]/80 py-[var(--section-py)]">
        <div className="page-container">
          <header className="mx-auto mb-10 max-w-2xl text-center md:mb-12">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[color:var(--header-border)] bg-[var(--header-surface)] px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--hero-muted)]">
              <span className="size-1 rounded-full bg-[var(--accent)]" />
              {count} liked
            </div>
            <h1 className="text-3xl font-semibold tracking-[-0.02em] text-[var(--foreground)] sm:text-4xl md:text-[2.75rem]">
              Liked Fonts
            </h1>
            <p className="mt-2 text-base text-[var(--hero-muted)] sm:text-lg">
              Fonts you saved with the heart — stored on this device
            </p>
          </header>

          {gridItems.length > 0 ? (
            <ShowcaseFontGrid
              items={gridItems}
              sectionId="liked-fonts"
              surface="dark"
              likedPage
            />
          ) : (
            <div className="mx-auto max-w-md rounded-2xl border border-[color:var(--card-border)] bg-[var(--card-bg)] px-6 py-12 text-center">
              <p className="text-lg font-medium text-[var(--foreground)]">
                No liked fonts yet
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--hero-muted)]">
                Tap the heart on any font card or in the generator suggestions
                to add it here.
              </p>
              <Link
                href="/"
                className="mt-6 inline-flex items-center justify-center rounded-xl border border-[color:var(--header-border)] bg-[var(--header-surface)] px-5 py-2.5 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--header-hover)]"
              >
                Browse fonts
              </Link>
            </div>
          )}

          {gridItems.length > 0 ? (
            <p className="mt-12 text-center text-sm text-[var(--hero-muted)]">
              <Link
                href="/"
                className="font-medium text-[var(--foreground)]/85 underline-offset-4 transition-colors hover:text-[var(--foreground)] hover:underline"
              >
                ← Browse more fonts
              </Link>
            </p>
          ) : null}
        </div>
      </section>
    </main>
  );
}

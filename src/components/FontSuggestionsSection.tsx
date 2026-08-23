"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  PREVIEW_FONT_KEYS,
  PREVIEW_FONT_META,
  googleFontsSpecimenUrl,
  previewFontDisplayName,
  type PreviewFontKey,
} from "@/fonts/preview-fonts";
import { downloadGoogleFontTtf } from "@/lib/download-font-client";
import { observeCardReveal } from "@/lib/motion";
import { FontFavoriteButton } from "@/components/FontFavoriteButton";
import { AccentTitle } from "@/components/AccentTitle";
import { useLikedFonts } from "@/hooks/use-liked-fonts";
import { likedIdForPreviewKey } from "@/lib/liked-fonts";

function CloudDownloadIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 13V8" />
      <path d="m9 11 3 3 3-3" />
      <path d="M17.5 19H6.5a4.5 4.5 0 0 1-.88-8.93A6 6 0 0 1 18 10.5a4.5 4.5 0 0 1 .5 8.5Z" />
    </svg>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" />
    </svg>
  );
}

const actionBtnClass =
  "flex size-10 shrink-0 items-center justify-center rounded-full border border-[color:var(--header-border)] bg-[var(--header-surface)] text-[var(--foreground)] transition-[border-color,background-color,transform] duration-200 hover:border-[color:color-mix(in_oklab,var(--accent)_30%,var(--header-border))] hover:bg-[var(--header-hover)] active:scale-95 disabled:cursor-wait disabled:opacity-55";

const SECTION_ID = "font-suggestions";

type Props = {
  text: string;
  selectedKey: PreviewFontKey;
  onSelect: (key: PreviewFontKey) => void;
};

export function FontSuggestionsSection({ text, selectedKey, onSelect }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const { isLiked } = useLikedFonts();
  const [downloadingKey, setDownloadingKey] = useState<PreviewFontKey | null>(
    null,
  );
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const displayText = text.trim() || "Preview";

  const orderedKeys = useMemo(() => {
    const keys = [...PREVIEW_FONT_KEYS];
    const selected = keys.filter((k) => k === selectedKey);
    const liked = keys.filter(
      (k) =>
        k !== selectedKey && isLiked(likedIdForPreviewKey(k)),
    );
    const rest = keys.filter(
      (k) =>
        k !== selectedKey && !isLiked(likedIdForPreviewKey(k)),
    );
    return [...selected, ...liked, ...rest];
  }, [selectedKey, isLiked]);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    return observeCardReveal(root, "[data-suggestion-card]", 24);
  }, [displayText, orderedKeys.length]);

  const handleDownload = useCallback(async (key: PreviewFontKey) => {
    const meta = PREVIEW_FONT_META[key];
    setDownloadingKey(key);
    setDownloadError(null);
    try {
      await downloadGoogleFontTtf(
        meta.googleQuery,
        previewFontDisplayName(key),
      );
    } catch {
      setDownloadError(`Could not download ${previewFontDisplayName(key)}`);
      window.setTimeout(() => setDownloadError(null), 2800);
    } finally {
      setDownloadingKey(null);
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      id={SECTION_ID}
      className="content-section page-px relative border-t border-[color:var(--header-border)]/80 py-[var(--section-py)]"
      aria-labelledby={`${SECTION_ID}-title`}
    >
      <div className="page-container">
        <header className="mb-8 md:mb-10">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[color:var(--header-border)] bg-[var(--header-surface)] px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--hero-muted)] backdrop-blur-md">
            <span className="size-1 rounded-full bg-[var(--accent)]" />
            {orderedKeys.length} styles
          </div>
          <h2
            id={`${SECTION_ID}-title`}
            className="text-3xl font-semibold tracking-[-0.02em] text-[var(--foreground)] sm:text-4xl md:text-[2.6rem]"
          >
            <AccentTitle text="Font Suggestions" />
          </h2>
          <p className="mt-1.5 max-w-2xl text-sm text-[var(--hero-muted)] sm:text-base">
            See &ldquo;{displayText}&rdquo; in different fonts - tap a card to
            use it in the generator above. Heart a font to add it to your{" "}
            <a
              href="/liked"
              className="font-medium text-[var(--foreground)]/90 underline-offset-4 hover:underline"
            >
              liked fonts
            </a>
            .
          </p>
          {downloadError ? (
            <p className="mt-3 text-[12px] text-[var(--accent)]" role="status">
              {downloadError}
            </p>
          ) : null}
        </header>

        <ul className="grid list-none grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2 lg:gap-6">
          {orderedKeys.map((key) => {
            const meta = PREVIEW_FONT_META[key];
            const name = previewFontDisplayName(key);
            const selected = key === selectedKey;
            const specimenUrl = googleFontsSpecimenUrl(meta.googleQuery);
            const likedId = likedIdForPreviewKey(key);

            return (
              <li key={key} data-suggestion-card>
                <article
                  className={`flex h-full flex-col overflow-hidden rounded-2xl border bg-[var(--card-bg)] transition-[border-color,box-shadow] duration-200 ${
                    selected
                      ? "border-[color:var(--chip-active-border)] shadow-[0_0_0_1px_color-mix(in_oklab,var(--accent)_25%,transparent)]"
                      : "border-[color:var(--card-border)]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onSelect(key)}
                    className="flex min-h-[9rem] flex-1 items-center justify-center px-6 py-8 text-center transition-colors hover:bg-[var(--header-hover)]/35 sm:min-h-[10rem]"
                    aria-pressed={selected}
                    aria-label={`Use ${name} in the generator`}
                  >
                    <span
                      className={`max-w-full break-words font-semibold leading-[1.05] tracking-tight text-[var(--foreground)] ${meta.className}`}
                      style={{
                        fontSize: "clamp(1.65rem, 5vw, 2.75rem)",
                      }}
                    >
                      {displayText}
                    </span>
                  </button>

                  <div className="flex items-end justify-between gap-3 border-t border-[color:var(--header-border)]/80 px-4 py-3.5 sm:px-5">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[var(--foreground)]">
                        {name}
                      </p>
                      <p className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11px] text-[var(--header-muted)]">
                        <span>Google Fonts</span>
                        <a
                          href={specimenUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center text-[var(--foreground)]/70 transition-colors hover:text-[var(--foreground)]"
                          aria-label={`${name} on Google Fonts`}
                          title="View on Google Fonts"
                        >
                          <GlobeIcon className="size-3.5" />
                        </a>
                        <span className="text-[var(--foreground)]/35">·</span>
                        <span className="text-[var(--foreground)]/50">Free</span>
                      </p>
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <FontFavoriteButton
                        likedId={likedId}
                        label={`Save ${name}`}
                        size="md"
                        variant="toolbar"
                      />
                      <button
                        type="button"
                        onClick={() => handleDownload(key)}
                        disabled={downloadingKey === key}
                        className={actionBtnClass}
                        aria-label={`Download ${name}`}
                        title="Download font"
                      >
                        <CloudDownloadIcon className="size-[18px]" />
                      </button>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

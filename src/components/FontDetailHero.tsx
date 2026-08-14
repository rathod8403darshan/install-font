"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { PREVIEW_FONT_META, type PreviewFontKey } from "@/fonts/preview-fonts";
import { downloadGoogleFontTtf } from "@/lib/download-font-client";
import { FontFavoriteButton } from "@/components/FontFavoriteButton";
import { likedIdFromSlug } from "@/lib/liked-fonts";
import {
  APP_STORE_IFONT_URL,
  GOOGLE_PLAY_INSTALLFONT_URL,
  redirectToMobileAppStore,
} from "@/lib/mobile-app-links";
import { AppleMark, GooglePlayMark } from "@/components/MobileAppStoreIcons";
import {
  buildDescription,
  buildVariants,
  type ShowcaseCard,
} from "@/data/font-showcase";

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
  );
}

function ArrowUpIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 19V5" />
      <path d="m5 12 7-7 7 7" />
    </svg>
  );
}

function CartIcon({ className }: { className?: string }) {
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
      <path d="M3 3h2l2.4 12.1A1.5 1.5 0 0 0 8.9 16.5h9.45a1.5 1.5 0 0 0 1.47-1.2L21 8H6" />
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
    </svg>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2l1.7 4.6L18 8l-4.3 1.4L12 14l-1.7-4.6L6 8l4.3-1.4L12 2zM19 14l.8 2L22 17l-2.2.5L19 20l-.8-2.5L16 17l2.2-.5L19 14zM5.5 15l.6 1.4L7.5 17l-1.4.6L5.5 19l-.6-1.4L3.5 17l1.4-.6L5.5 15z" />
    </svg>
  );
}

function DownloadIcon({ className }: { className?: string }) {
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
      <path d="M21 15v3a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-3" />
      <path d="M7 10l5 5 5-5" />
      <path d="M12 15V3" />
    </svg>
  );
}

export function FontDetailHero({ card }: { card: ShowcaseCard }) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const appsRef = useRef<HTMLDivElement>(null);
  const [downloadingKey, setDownloadingKey] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const scrollToGenerator = useCallback(() => {
    const el = document.getElementById("font-generator");
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }, []);

  const handleDownload = useCallback(
    async (fontKey: PreviewFontKey, variantName: string) => {
      const meta = PREVIEW_FONT_META[fontKey];
      setDownloadingKey(fontKey);
      setDownloadError(null);
      try {
        await downloadGoogleFontTtf(meta.googleQuery, variantName);
      } catch {
        setDownloadError(
          "Download failed. Check your connection and try again.",
        );
      } finally {
        setDownloadingKey(null);
      }
    },
    [],
  );

  const meta = card.fontKey ? PREVIEW_FONT_META[card.fontKey] : null;
  const previewClass = meta?.className ?? "";
  const previewStyle: React.CSSProperties | undefined = meta
    ? undefined
    : card.stack
      ? { fontFamily: card.stack }
      : undefined;
  const runtimeStylesheet =
    !meta && card.googleQuery
      ? `https://fonts.googleapis.com/css2?family=${card.googleQuery}&display=swap`
      : null;
  const description = buildDescription(card);
  const variants = buildVariants(card);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const desc = descRef.current;
    const thumb = thumbRef.current;
    const panel = panelRef.current;
    const apps = appsRef.current;
    if (!section || !title || !desc || !thumb || !panel || !apps) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      const chars = title.querySelectorAll<HTMLElement>("[data-char]");
      const paragraphs = desc.querySelectorAll<HTMLElement>("p");
      const variantBlocks = panel.querySelectorAll<HTMLElement>("[data-variant]");
      const appLinks = apps.querySelectorAll<HTMLElement>("a");

      gsap.set(thumb, { opacity: 0, x: -24, scale: 0.96 });
      gsap.set(chars, { yPercent: 110, rotationX: -70, opacity: 0 });
      gsap.set(paragraphs, { opacity: 0, y: 16 });
      gsap.set(panel, { opacity: 0, x: 40 });
      gsap.set(variantBlocks, { opacity: 0, y: 18 });
      gsap.set(apps, { opacity: 0, y: 28 });
      gsap.set(appLinks, { opacity: 0, y: 22, scale: 0.88 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(thumb, { opacity: 1, x: 0, scale: 1, duration: 0.55 })
        .to(
          chars,
          {
            yPercent: 0,
            rotationX: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.025,
            ease: "back.out(1.5)",
          },
          "-=0.4",
        )
        .to(
          paragraphs,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: "power2.out",
          },
          "-=0.4",
        )
        .to(panel, { opacity: 1, x: 0, duration: 0.6 }, "-=0.55")
        .to(
          variantBlocks,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out",
          },
          "-=0.35",
        )
        .to(apps, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, "-=0.55")
        .to(
          appLinks,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.55,
            stagger: 0.14,
            ease: "back.out(1.25)",
          },
          "-=0.45",
        );
    }, section);

    return () => ctx.revert();
  }, []);

  const titleChars = card.label.split("").map((c, i) => (
    <span
      key={`${c}-${i}`}
      data-char
      aria-hidden
      className="inline-block will-change-transform"
    >
      {c === " " ? "\u00A0" : c}
    </span>
  ));

  return (
    <section
      ref={sectionRef}
      className="page-px relative pb-14 pt-10 md:pt-14"
    >
      {runtimeStylesheet ? (
        <link rel="stylesheet" href={runtimeStylesheet} />
      ) : null}
      <div className="page-container">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[var(--hero-muted)] transition-colors hover:text-[var(--foreground)]"
        >
          <ArrowLeftIcon className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
          Back to fonts
        </Link>

        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-[1fr_280px] lg:grid-cols-[1.4fr_1fr] lg:gap-10">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-[200px_1fr] sm:gap-8">
            <div
              ref={thumbRef}
              className="mx-auto flex aspect-square w-full max-w-[240px] items-center justify-center overflow-hidden rounded-2xl border border-[color:var(--card-border)] bg-[var(--card-bg)] p-4 backdrop-blur-xl will-change-transform sm:mx-0 sm:max-w-none"
            >
              <span
                className={`text-center text-[clamp(1.2rem,2.4vw,1.5rem)] leading-tight text-[var(--foreground)] ${previewClass}`}
                style={previewStyle}
              >
                {card.previewText}
              </span>
            </div>

            <div>
              <h1
                ref={titleRef}
                className="inline-flex flex-wrap items-baseline overflow-hidden text-3xl font-semibold tracking-[-0.02em] text-[var(--foreground)] sm:text-4xl md:text-[2.4rem]"
                style={{ perspective: "900px" }}
              >
                {titleChars}
              </h1>

              <div
                ref={descRef}
                className="mt-4 space-y-3 text-[15px] leading-relaxed text-[var(--hero-muted)] sm:text-base"
              >
                {description.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              <div ref={appsRef} className="mt-8">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--hero-muted)]">
                  Mobile apps
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={GOOGLE_PLAY_INSTALLFONT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex min-w-[140px] flex-1 items-center justify-center gap-2.5 overflow-hidden rounded-xl border border-[color:var(--header-border)] bg-[var(--header-surface)] px-3.5 py-2.5 text-[13px] font-semibold text-[var(--foreground)]/95 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset] backdrop-blur-md transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-[var(--accent)]/40 hover:shadow-[0_14px_40px_-16px_color-mix(in_oklab,var(--accent)_40%,transparent)] sm:flex-initial"
                  >
                    <span className="pointer-events-none absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[100%]" />
                    <GooglePlayMark className="relative size-6 shrink-0" />
                    <span className="relative">Google Play</span>
                  </a>
                  <a
                    href={APP_STORE_IFONT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex min-w-[140px] flex-1 items-center justify-center gap-2.5 overflow-hidden rounded-xl border border-[color:var(--header-border)] bg-[var(--header-surface)] px-3.5 py-2.5 text-[13px] font-semibold text-[var(--foreground)]/95 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset] backdrop-blur-md transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-[var(--accent-3)]/40 hover:shadow-[0_14px_40px_-16px_color-mix(in_oklab,var(--accent-3)_35%,transparent)] sm:flex-initial"
                  >
                    <span className="pointer-events-none absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[100%]" />
                    <AppleMark className="relative size-6 shrink-0" />
                    <span className="relative">App Store</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <aside
            ref={panelRef}
            className="relative overflow-hidden rounded-2xl border border-[color:var(--card-border)] bg-[var(--card-bg)] p-6 backdrop-blur-xl"
          >
            <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-[var(--accent)]/70" />

            <header className="mb-6 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--foreground)]">
                Fonts Used
              </span>
              <div className="flex items-center gap-3 text-[12px] text-[var(--hero-muted)]">
                <button
                  type="button"
                  aria-label="Scroll up"
                  className="rounded-full p-1 transition-colors hover:bg-[var(--header-hover)] hover:text-[var(--foreground)]"
                >
                  <ArrowUpIcon className="size-3.5" />
                </button>
                <FontFavoriteButton
                  likedId={likedIdFromSlug(card.slug)}
                  label={`Save ${card.label}`}
                  size="sm"
                  variant="toolbar"
                  className="!opacity-100"
                />
              </div>
            </header>

            {downloadError ? (
              <p
                className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-[12px] text-red-300"
                role="alert"
              >
                {downloadError}
              </p>
            ) : null}

            <div className="space-y-7">
              {variants.map((v) => {
                const vm = PREVIEW_FONT_META[v.fontKey];
                const isDownloading = downloadingKey === v.fontKey;
                return (
                  <div key={v.name} data-variant>
                    <div className="flex items-center gap-2 text-[12px] text-[var(--hero-muted)]">
                      <span className="truncate">{v.name}</span>
                      <span
                        className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                          v.badge === "Original"
                            ? "bg-[var(--accent-3)]/15 text-[var(--accent-3)]"
                            : "bg-[var(--accent)]/15 text-[var(--accent)]"
                        }`}
                      >
                        {v.badge}
                      </span>
                    </div>

                    <div
                      className={`mt-2 text-[clamp(1.6rem,3vw,2.1rem)] leading-tight tracking-tight text-[var(--foreground)] ${vm.className}`}
                    >
                      {card.previewText}
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        disabled={isDownloading}
                        onClick={() => handleDownload(v.fontKey, v.name)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent)] px-3.5 py-1.5 text-[12px] font-semibold text-zinc-950 shadow-[0_0_18px_-6px_color-mix(in_oklab,var(--accent)_55%,transparent)] transition-[filter,box-shadow,opacity] duration-200 hover:brightness-110 hover:shadow-[0_0_24px_-4px_color-mix(in_oklab,var(--accent)_70%,transparent)] disabled:cursor-wait disabled:opacity-70"
                      >
                        <DownloadIcon className="size-3.5" />
                        {isDownloading ? "Downloading…" : "Download"}
                      </button>
                      <button
                        type="button"
                        onClick={redirectToMobileAppStore}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--header-border)] bg-[var(--header-surface)] px-3 py-1.5 text-[12px] font-medium text-[var(--foreground)]/90 backdrop-blur-md transition-[border-color,background-color] hover:border-[var(--accent)]/40 hover:bg-[var(--header-hover)]"
                      >
                        <CartIcon className="size-3.5" />
                        Get
                      </button>
                      <button
                        type="button"
                        onClick={scrollToGenerator}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--header-border)] bg-[var(--header-surface)] px-3 py-1.5 text-[12px] font-medium text-[var(--foreground)]/90 backdrop-blur-md transition-[border-color,background-color] hover:border-[var(--accent)]/40 hover:bg-[var(--header-hover)]"
                      >
                        <SparklesIcon className="size-3.5 text-[var(--accent)]" />
                        Generate
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { prefersReducedMotion } from "@/lib/motion";

const SPECIMENS = [
  { font: "ui-sans-serif, system-ui, sans-serif", sample: "Aa", preview: "The quick brown fox", href: "/fonts/inter" },
  { font: "Georgia, 'Times New Roman', serif", sample: "Aa", preview: "The quick brown fox", href: "/fonts/cinzel" },
  { font: "'Segoe Script', 'Bradley Hand', cursive", sample: "Aa", preview: "The quick brown fox", href: "/fonts/lobster" },
  { font: "'Comic Sans MS', 'Chalkboard SE', cursive", sample: "Aa", preview: "The quick brown fox", href: "/fonts/pacifico" },
  { font: "Impact, Haettenschweiler, sans-serif", sample: "Aa", preview: "The quick brown fox", href: "/fonts/bebas-neue" },
];

function twoLineTeaser(paragraphs: string[]): string {
  const first = paragraphs[0] ?? "";
  if (first.length >= 90) return first;
  return [first, paragraphs[1]].filter(Boolean).join(" ");
}

export function HomeLibraryVisual({
  items,
  blocks = [],
}: {
  items: { label: string; text: string }[];
  blocks?: { title: string; paragraphs: string[] }[];
}) {
  const uid = useId().replace(/:/g, "");
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [source, setSource] = useState<number | null>(null);
  const current = items[active] ?? items[0];
  const specimen = SPECIMENS[active] ?? SPECIMENS[0];

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (prefersReducedMotion()) {
      root.classList.add("library-stage-active");
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        root.classList.add("library-stage-active");
        io.disconnect();
      },
      { threshold: 0.2 },
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      className="relative mt-8 overflow-hidden rounded-2xl border border-[color:var(--header-border)] bg-[var(--header-surface)]/30"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,color-mix(in_oklab,var(--accent)_14%,transparent),transparent_55%)]" />

      <div className="relative border-b border-[color:var(--header-border)]">
        <svg
          className="pointer-events-none absolute inset-0 size-full"
          viewBox="0 0 640 120"
          preserveAspectRatio="none"
          aria-hidden
        >
          <defs>
            <linearGradient id={`${uid}-line`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0" />
              <stop offset="50%" stopColor="var(--accent)" stopOpacity="0.5" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <line x1="16" y1="28" x2="624" y2="28" pathLength={1} className="library-draw" stroke={`url(#${uid}-line)`} strokeWidth="1" />
          <line x1="16" y1="60" x2="624" y2="60" stroke="var(--accent)" strokeOpacity="0.1" strokeDasharray="3 8" />
          <line x1="16" y1="92" x2="624" y2="92" pathLength={1} className="library-draw library-draw-delay" stroke={`url(#${uid}-line)`} strokeWidth="1" />
        </svg>
        <div className="relative z-[1] flex items-center gap-4 px-4 py-4 sm:gap-6 sm:px-5">
          <p
            key={current?.label}
            className="library-glyph shrink-0 text-[3.5rem] leading-none tracking-tight text-[var(--foreground)] sm:text-[4.25rem]"
            style={{ fontFamily: specimen.font }}
          >
            {specimen.sample}
          </p>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold tabular-nums tracking-[0.18em] text-[var(--accent)]">
              {String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
            </p>
            <p
              key={`${current?.label}-preview`}
              className="library-readout mt-0.5 truncate text-[1.05rem] leading-tight text-[var(--foreground)]/90 sm:text-[1.25rem]"
              style={{ fontFamily: specimen.font }}
            >
              {specimen.preview}
            </p>
            <p className="mt-0.5 text-[13px] font-medium text-[var(--accent)]">
              {current?.label}
            </p>
          </div>
          {specimen.href ? (
            <Link
              href={specimen.href}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[color:color-mix(in_oklab,var(--accent)_40%,var(--header-border))] bg-[color-mix(in_oklab,var(--accent)_12%,transparent)] px-3 py-2 text-[12px] font-semibold text-[var(--accent)] transition-[background-color,border-color,transform] duration-200 hover:-translate-y-px hover:border-[var(--accent)] hover:bg-[color-mix(in_oklab,var(--accent)_18%,transparent)]"
            >
              View
              <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          ) : null}
        </div>
      </div>

      <div className="relative grid grid-cols-1 lg:grid-cols-2">
        <ul className="lg:border-r lg:border-[color:var(--header-border)]">
          {items.map((item, i) => {
            const on = i === active;
            return (
              <li key={item.label}>
                <button
                  type="button"
                  aria-pressed={on}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className={`w-full px-4 py-2.5 text-left outline-none transition-colors duration-200 ${
                    i < items.length - 1 ? "border-b border-[color:var(--header-border)]" : "max-lg:border-b max-lg:border-[color:var(--header-border)]"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span
                      className="flex size-7 shrink-0 items-center justify-center text-[1rem] leading-none text-[var(--foreground)]"
                      style={{ fontFamily: SPECIMENS[i]?.font ?? "inherit" }}
                      aria-hidden
                    >
                      {SPECIMENS[i]?.sample ?? "Aa"}
                    </span>
                    <span className={`min-w-0 flex-1 truncate text-[13px] font-semibold ${on ? "text-[var(--foreground)]" : "text-[var(--foreground)]/80"}`}>
                      {item.label}
                    </span>
                    <span className="text-[10px] tabular-nums text-[var(--hero-muted)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {blocks.length ? (
          <div
            className="flex flex-col lg:min-h-full"
            onMouseLeave={() => setSource(null)}
          >
            {blocks.map((block, i) => {
              const on = i === source;
              const teaser = twoLineTeaser(block.paragraphs);
              const extra = block.paragraphs.slice(1);
              return (
                <article
                  key={block.title}
                  tabIndex={0}
                  onMouseEnter={() => setSource(i)}
                  onFocus={() => setSource(i)}
                  onBlur={(e) => {
                    if (!e.currentTarget.parentElement?.contains(e.relatedTarget)) {
                      setSource(null);
                    }
                  }}
                  className={`flex flex-1 flex-col justify-center px-4 py-3.5 outline-none transition-[background-color,box-shadow] duration-300 ${
                    i < blocks.length - 1 ? "border-b border-[color:var(--header-border)]" : ""
                  } ${
                    on
                      ? "bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] shadow-[inset_0_0_40px_-18px_color-mix(in_oklab,var(--accent)_55%,transparent)]"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <LibrarySourceMark variant={i === 0 ? "google" : "archive"} active={on} />
                    <div className="min-w-0 flex-1">
                      <h3
                        className={`text-[14px] font-semibold tracking-[-0.01em] transition-colors duration-300 ${
                          on ? "text-[var(--accent)]" : "text-[var(--foreground)]"
                        }`}
                      >
                        {block.title}
                      </h3>
                      {teaser ? (
                        <p
                          className={`mt-1 text-[13px] leading-snug text-[var(--hero-muted)] ${
                            on ? "" : "line-clamp-2"
                          }`}
                        >
                          {on ? block.paragraphs[0] : teaser}
                        </p>
                      ) : null}
                      {extra.length ? (
                        <div
                          className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                            on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                          }`}
                        >
                          <div className="min-h-0 overflow-hidden">
                            <div
                              className={`space-y-1.5 pt-1.5 transition-opacity duration-300 ${
                                on ? "opacity-100" : "opacity-0"
                              }`}
                            >
                              {extra.map((p) => (
                                <p
                                  key={p.slice(0, 48)}
                                  className="text-[13px] leading-snug text-[var(--hero-muted)]"
                                >
                                  {p}
                                </p>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function LibrarySourceMark({
  variant,
  active,
}: {
  variant: "google" | "archive";
  active: boolean;
}) {
  return (
    <span
      className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border text-[var(--accent)] transition-[border-color,background-color,box-shadow] duration-300 ${
        active
          ? "border-[color:color-mix(in_oklab,var(--accent)_55%,var(--header-border))] bg-[color-mix(in_oklab,var(--accent)_14%,transparent)] shadow-[0_0_16px_-6px_color-mix(in_oklab,var(--accent)_70%,transparent)]"
          : "border-[color:var(--header-border)] bg-[var(--header-surface)]/50"
      }`}
    >
      <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        {variant === "google" ? (
          <path d="M12 7.2a4.8 4.8 0 1 0 4.2 2.5h-4.2v2.6h7A8 8 0 1 1 12 4" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <>
            <path d="M5 19V6.5A1.5 1.5 0 0 1 6.5 5H19v14H6.5A1.5 1.5 0 0 0 5 20.5V19z" strokeLinejoin="round" />
            <path d="M9 9h7M9 13h5" strokeLinecap="round" />
          </>
        )}
      </svg>
    </span>
  );
}

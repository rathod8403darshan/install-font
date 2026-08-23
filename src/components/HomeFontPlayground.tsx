"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import gsap from "gsap";
import {
  PREVIEW_FONT_KEYS,
  PREVIEW_FONT_META,
  type PreviewFontKey,
} from "@/fonts/preview-fonts";
import { familyDisplayName } from "@/data/font-showcase";
import {
  applyStylePreset,
  buildPreviewTextStyle,
  createDefaultGeneratorSettings,
  GENERATOR_STYLE_BLURBS,
  GENERATOR_STYLE_PRESETS,
  previewSettingsForPreset,
  type GeneratorSettings,
} from "@/lib/font-generator";
import { prefersReducedMotion } from "@/lib/motion";

const HOME_PRESETS = GENERATOR_STYLE_PRESETS.filter((p) =>
  ["plain", "super-mario", "neon", "retro-3d"].includes(p.id),
);

function StepMark({ n }: { n: string }) {
  return (
    <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-[10px] font-bold leading-none text-[#09090b]">
      {n}
    </span>
  );
}

function PlaygroundFontPicker({
  value,
  onChange,
}: {
  value: PreviewFontKey;
  onChange: (key: PreviewFontKey) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const activeMeta = PREVIEW_FONT_META[value];

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
    <div ref={rootRef} className="relative z-20">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label="Choose font"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-[color:color-mix(in_oklab,var(--accent)_28%,var(--header-border))] bg-[var(--search-bar-bg)] px-3 py-3 text-left outline-none transition-[border-color,background-color,box-shadow] hover:border-[color:color-mix(in_oklab,var(--accent)_50%,var(--header-border))] focus-visible:border-[var(--accent)] focus-visible:shadow-[0_0_0_3px_color-mix(in_oklab,var(--accent)_22%,transparent)]"
      >
        <span
          className={`min-w-0 truncate text-[16px] text-[var(--foreground)] ${activeMeta.className}`}
        >
          {familyDisplayName(value)}
        </span>
        <svg
          className={`size-4 shrink-0 text-[var(--accent)] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-label="Choose font"
          className="font-sort-menu absolute left-0 right-0 z-50 mt-2 max-h-64 overflow-y-auto rounded-xl border border-[color:var(--header-border)] bg-[var(--header-surface-solid)] py-1 shadow-[0_20px_50px_-16px_rgba(0,0,0,0.75)]"
        >
          {PREVIEW_FONT_KEYS.map((key) => {
            const selected = key === value;
            const meta = PREVIEW_FONT_META[key];
            return (
              <li key={key} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(key);
                    setOpen(false);
                  }}
                  className={`flex w-full px-3 py-2 text-left transition-colors ${
                    selected
                      ? "bg-[var(--header-hover)] text-[var(--accent)]"
                      : "text-[var(--foreground)] hover:bg-[var(--header-hover)]"
                  }`}
                >
                  <span className={`truncate text-[15px] ${meta.className}`}>
                    {familyDisplayName(key)}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

export function HomeFontPlayground({ intro }: { intro?: ReactNode }) {
  const [previewText, setPreviewText] = useState("iPhone");
  const [settings, setSettings] = useState<GeneratorSettings>(() =>
    createDefaultGeneratorSettings("pacifico"),
  );

  const stageRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLParagraphElement>(null);

  const activeMeta = PREVIEW_FONT_META[settings.fontKey];
  const display = previewText.trim() || "iPhone";
  const textStyle = useMemo(() => {
    const style = buildPreviewTextStyle({
      ...settings,
      fontSize: Math.min(settings.fontSize, 120),
    });
    return { ...style, fontSize: "clamp(3rem, 7.5vw, 6.25rem)" };
  }, [settings]);

  const presetLabel =
    HOME_PRESETS.find((p) => p.id === settings.stylePresetId)?.label ?? "Plain";

  const setFont = (fontKey: PreviewFontKey) => {
    setSettings((s) => ({ ...s, fontKey }));
  };

  const setPreset = (presetId: string) => {
    setSettings((s) => applyStylePreset(s, presetId));
  };

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const activate = () => stage.classList.add("playground-active");

    if (prefersReducedMotion()) {
      activate();
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        activate();
        io.disconnect();
      },
      { threshold: 0.28 },
    );
    io.observe(stage);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = previewRef.current;
    if (!el || prefersReducedMotion()) return;
    gsap.fromTo(
      el,
      { opacity: 0, y: 22, scale: 0.92, filter: "blur(10px)" },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.55,
        ease: "power3.out",
      },
    );
  }, [settings.fontKey, settings.stylePresetId, display]);

  return (
    <div
      data-m-item
      className="grid min-w-0 grid-cols-1 items-start gap-8 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] md:gap-8 lg:gap-10"
    >
      <div className="min-w-0">
        {intro}

        <div className="relative mt-7 overflow-hidden rounded-2xl border border-[color:color-mix(in_oklab,var(--accent)_28%,var(--header-border))] bg-[color-mix(in_oklab,var(--accent)_5%,var(--header-surface))] p-4 shadow-[0_0_40px_-18px_color-mix(in_oklab,var(--accent)_45%,transparent)] sm:p-5">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,color-mix(in_oklab,var(--accent)_12%,transparent),transparent_60%)]" />

          <div className="relative space-y-6">
            <div>
              <p className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--foreground)]">
                <StepMark n="1" />
                Type your text
              </p>
              <label className="block">
                <span className="sr-only">Type the text to preview</span>
                <span className="relative block">
                  <svg
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--accent)]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    aria-hidden
                  >
                    <path d="M4 20h16" strokeLinecap="round" />
                    <path d="M9 4l-3 16M18 4l-3 16M8 9h9" strokeLinecap="round" />
                  </svg>
                  <input
                    type="text"
                    value={previewText}
                    onChange={(e) => setPreviewText(e.target.value)}
                    maxLength={24}
                    placeholder="Type here to change the preview"
                    autoComplete="off"
                    className="w-full rounded-xl border-2 border-[color:color-mix(in_oklab,var(--accent)_45%,var(--header-border))] bg-[var(--search-bar-bg)] py-3 pl-10 pr-14 text-[15px] font-medium text-[var(--foreground)] outline-none placeholder:text-[var(--hero-muted)] transition-[border-color,box-shadow] focus:border-[var(--accent)] focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--accent)_22%,transparent)]"
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] tabular-nums text-[var(--hero-muted)]">
                    {previewText.length}/24
                  </span>
                </span>
              </label>
              <p className="mt-2 text-[12px] leading-snug text-[var(--hero-muted)]">
                Edit this field. The styled result updates as you type.
              </p>
            </div>

            <div>
              <p className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--foreground)]">
                <StepMark n="2" />
                Choose a font
              </p>
              <PlaygroundFontPicker value={settings.fontKey} onChange={setFont} />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--foreground)]">
                  <StepMark n="3" />
                  Choose a style
                </p>
                <p className="text-[10px] font-medium tabular-nums tracking-[0.14em] text-[var(--accent)]">
                  {String(
                    HOME_PRESETS.findIndex((p) => p.id === settings.stylePresetId) +
                      1,
                  ).padStart(2, "0")}{" "}
                  / {String(HOME_PRESETS.length).padStart(2, "0")}
                </p>
              </div>

              <div className="overflow-hidden rounded-xl border border-[color:var(--header-border)] bg-[var(--header-surface)]/25">
                {HOME_PRESETS.map((preset, i) => {
                  const selected = settings.stylePresetId === preset.id;
                  const previewSettings = previewSettingsForPreset(
                    settings.fontKey,
                    preset.id,
                  );
                  const miniStyle: CSSProperties = {
                    ...buildPreviewTextStyle({
                      ...previewSettings,
                      fontSize: 22,
                    }),
                    lineHeight: 1,
                  };
                  const blurb = GENERATOR_STYLE_BLURBS[preset.id] ?? "";

                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setPreset(preset.id)}
                      aria-pressed={selected}
                      className={`group/style flex w-full items-center justify-between gap-4 px-3.5 py-3.5 text-left outline-none transition-[background-color,box-shadow] duration-300 ${
                        i < HOME_PRESETS.length - 1
                          ? "border-b border-[color:var(--header-border)]"
                          : ""
                      } ${
                        selected
                          ? "bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] shadow-[inset_3px_0_0_0_var(--accent)]"
                          : "hover:bg-[var(--header-surface)]/45"
                      }`}
                    >
                      <span className="min-w-0 flex-1">
                        <span
                          className={`block text-[13px] font-semibold tracking-wide transition-colors ${
                            selected
                              ? "text-[var(--accent)]"
                              : "text-[var(--foreground)] group-hover/style:text-[var(--accent)]"
                          }`}
                        >
                          {preset.label}
                        </span>
                        {blurb ? (
                          <span className="mt-1 block line-clamp-2 text-[12px] font-normal leading-snug tracking-normal text-[var(--hero-muted)]">
                            {blurb}
                          </span>
                        ) : null}
                      </span>
                      <span
                        className={`shrink-0 rounded-lg border px-3 py-2 transition-[border-color,background-color,box-shadow] duration-300 ${
                          selected
                            ? "border-[color:color-mix(in_oklab,var(--accent)_55%,var(--header-border))] bg-[color-mix(in_oklab,var(--accent)_14%,transparent)] shadow-[0_0_22px_-8px_color-mix(in_oklab,var(--accent)_70%,transparent)]"
                            : "border-[color:var(--header-border)] bg-[var(--background)]/45 group-hover/style:border-[color:color-mix(in_oklab,var(--accent)_40%,var(--header-border))] group-hover/style:bg-[color-mix(in_oklab,var(--accent)_8%,transparent)]"
                        }`}
                      >
                        <span
                          className={`${activeMeta.className} max-w-[9.5rem] truncate text-right sm:max-w-[11rem]`}
                          style={miniStyle}
                        >
                          ABCDEF
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={stageRef}
        className="playground-stage group/preview relative flex min-h-[18rem] flex-col justify-center overflow-hidden rounded-2xl border border-[color:color-mix(in_oklab,var(--accent)_45%,var(--header-border))] bg-[color-mix(in_oklab,var(--accent)_7%,var(--header-surface))] px-5 py-6 shadow-[0_0_52px_-12px_color-mix(in_oklab,var(--accent)_62%,transparent)] sm:min-h-[22rem] sm:px-6 sm:py-7 md:sticky md:top-[calc(var(--site-header-offset)+1.25rem)] md:min-h-[24rem] lg:min-h-[28rem]"
      >
        <div className="pointer-events-none playground-stage-glow absolute inset-0 bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--accent)_18%,transparent),transparent_68%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/55 to-transparent" />

        <div className="relative mb-5 flex items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--foreground)]">
            <span className="inline-flex size-5 items-center justify-center rounded-full border border-[color:color-mix(in_oklab,var(--accent)_50%,var(--header-border))] text-[10px] font-bold text-[var(--accent)]">
              4
            </span>
            Result
          </p>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[color:color-mix(in_oklab,var(--accent)_40%,var(--header-border))] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
            <span className="playground-live-dot size-1.5 rounded-full bg-[var(--accent)]" />
            Live preview
          </span>
        </div>

        <div className="relative flex min-h-[11rem] flex-1 flex-col items-center justify-center sm:min-h-[14rem]">
          <span className="playground-guide playground-guide-1 pointer-events-none absolute left-[8%] right-[8%] top-[22%] h-px bg-[var(--header-border)]" />
          <span className="playground-guide playground-guide-2 pointer-events-none absolute left-[8%] right-[8%] top-1/2 h-px bg-[color:color-mix(in_oklab,var(--accent)_40%,var(--header-border))]" />
          <span className="playground-guide playground-guide-3 pointer-events-none absolute left-[8%] right-[8%] top-[78%] h-px bg-[var(--header-border)]" />

          <p
            ref={previewRef}
            className={`relative z-[1] max-w-full break-words text-center font-semibold leading-[1.05] tracking-tight ${activeMeta.className}`}
            style={textStyle}
          >
            {display}
          </p>
        </div>

        <p className="relative mt-5 text-center text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--hero-muted)] transition-colors group-hover/preview:text-[var(--accent)]">
          {familyDisplayName(settings.fontKey)} · {presetLabel}
        </p>
      </div>
    </div>
  );
}

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
      <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--hero-muted)]">
        Choose font
      </p>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((o) => !o)}
        className="mt-2 flex w-full items-center justify-between gap-2 border-0 border-b border-[color:var(--header-border)] bg-transparent py-2 text-left outline-none transition-[border-color] hover:border-[color:color-mix(in_oklab,var(--accent)_40%,var(--header-border))] focus-visible:border-[var(--accent)]"
      >
        <span
          className={`min-w-0 truncate text-[15px] text-[var(--foreground)] ${activeMeta.className}`}
        >
          {familyDisplayName(value)}
        </span>
        <svg
          className={`size-4 shrink-0 text-[var(--hero-muted)] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
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
  const sampleRef = useRef<HTMLParagraphElement>(null);

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

  useEffect(() => {
    const el = sampleRef.current;
    if (!el || prefersReducedMotion()) return;
    gsap.fromTo(
      el,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.32, ease: "power2.out" },
    );
  }, [settings.fontKey, display]);

  return (
    <div
      data-m-item
      className="grid min-w-0 grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)] lg:gap-12"
    >
      <div className="min-w-0">
        {intro}

        <div className="mt-7 space-y-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="block text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--hero-muted)]">
                Preview text
              </span>
              <input
                type="text"
                value={previewText}
                onChange={(e) => setPreviewText(e.target.value)}
                maxLength={24}
                className="mt-2 w-full border-0 border-b border-[color:var(--header-border)] bg-transparent py-2 text-sm text-[var(--foreground)] outline-none transition-[border-color] focus:border-[var(--accent)]"
              />
            </label>

            <PlaygroundFontPicker value={settings.fontKey} onChange={setFont} />
          </div>

          <p
            ref={sampleRef}
            className={`truncate text-[1.35rem] leading-none text-[var(--foreground)] ${activeMeta.className}`}
          >
            {display}
          </p>

          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--hero-muted)]">
              Choose style
            </p>
            <div className="mt-2 border-t border-[color:var(--header-border)]">
              {HOME_PRESETS.map((preset) => {
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
                    className="group/style flex w-full items-center justify-between gap-4 border-b border-[color:var(--header-border)] py-3.5 text-left outline-none"
                  >
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block text-[13px] font-medium tracking-wide transition-colors ${
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
                          ? "border-[color:color-mix(in_oklab,var(--accent)_55%,var(--header-border))] bg-[color-mix(in_oklab,var(--accent)_12%,transparent)] shadow-[0_0_22px_-8px_color-mix(in_oklab,var(--accent)_70%,transparent)]"
                          : "border-[color:var(--header-border)] bg-[var(--header-surface)]/40 group-hover/style:border-[color:color-mix(in_oklab,var(--accent)_40%,var(--header-border))] group-hover/style:bg-[color-mix(in_oklab,var(--accent)_8%,transparent)]"
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

      <div
        ref={stageRef}
        className="playground-stage relative flex min-h-[18rem] flex-col justify-center overflow-hidden rounded-2xl border border-[color:color-mix(in_oklab,var(--accent)_40%,var(--header-border))] bg-[color-mix(in_oklab,var(--accent)_6%,var(--header-surface))] px-5 py-6 shadow-[0_0_48px_-14px_color-mix(in_oklab,var(--accent)_58%,transparent)] sm:min-h-[22rem] sm:px-6 sm:py-7 lg:sticky lg:top-[calc(var(--site-header-offset)+1.25rem)] lg:min-h-[26rem]"
      >
        <div className="pointer-events-none playground-stage-glow absolute inset-0 bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--accent)_16%,transparent),transparent_68%)]" />

        <div className="relative mb-6 flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--hero-muted)]">
            Live preview
          </p>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
            <span className="playground-live-dot size-1.5 rounded-full bg-[var(--accent)]" />
            Live
          </span>
        </div>

        <div className="relative flex min-h-[11rem] flex-col items-center justify-center sm:min-h-[14rem]">
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

        <p className="relative mt-6 text-center text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--hero-muted)]">
          {familyDisplayName(settings.fontKey)} - {presetLabel}
        </p>
      </div>
    </div>
  );
}

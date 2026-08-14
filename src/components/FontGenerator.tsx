"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import {
  PREVIEW_FONT_KEYS,
  PREVIEW_FONT_META,
  type PreviewFontKey,
} from "@/fonts/preview-fonts";
import {
  applyStylePreset,
  buildPreviewContainerStyle,
  buildPreviewTextStyle,
  createDefaultGeneratorSettings,
  FONT_SIZE_OPTIONS,
  GENERATOR_STYLE_PRESETS,
  perLetterTransform,
  previewSettingsForPreset,
  splitPreviewCharacters,
  type GeneratorSettings,
} from "@/lib/font-generator";
import { familyDisplayName, type ShowcaseCard } from "@/data/font-showcase";
import { downloadGoogleFontTtf } from "@/lib/download-font-client";

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

function ShareIcon({ className }: { className?: string }) {
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
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.59 13.51l6.82 3.98M15.41 6.51l-6.82 3.98" />
    </svg>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--foreground)]/55">
      {children}
    </span>
  );
}

function Toggle({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-2 ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors duration-200 ${
          checked ? "bg-[var(--accent)]" : "bg-[var(--header-border)]"
        }`}
      >
        <span
          className={`absolute top-0.5 size-4 rounded-full bg-white shadow transition-[left] duration-200 ${
            checked ? "left-[18px]" : "left-0.5"
          }`}
        />
      </button>
      <span className="text-[11px] font-medium uppercase tracking-wide text-[var(--foreground)]/90">
        {label}
      </span>
    </label>
  );
}

function ColorField({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className={`min-w-0 ${disabled ? "pointer-events-none opacity-45" : ""}`}>
      <FieldLabel>{label}</FieldLabel>
      <div className="mt-1.5 flex min-w-0 items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="size-9 shrink-0 cursor-pointer rounded-lg border border-[color:var(--header-border)] bg-transparent p-0.5"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="min-w-0 flex-1 rounded-lg border border-[color:var(--header-border)] bg-[var(--header-surface)] px-2 py-1.5 font-mono text-[10px] uppercase tracking-wide text-[var(--foreground)] outline-none focus:border-[var(--accent)]/40"
        />
      </div>
    </div>
  );
}

function SelectField<T extends string | number>({
  label,
  value,
  onChange,
  options,
  disabled,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  disabled?: boolean;
}) {
  return (
    <div className={`min-w-0 ${disabled ? "pointer-events-none opacity-45" : ""}`}>
      <FieldLabel>{label}</FieldLabel>
      <select
        value={String(value)}
        onChange={(e) => {
          const raw = e.target.value;
          const match = options.find((o) => String(o.value) === raw);
          if (match) onChange(match.value);
        }}
        disabled={disabled}
        className="mt-1.5 w-full rounded-lg border border-[color:var(--header-border)] bg-[var(--header-surface)] px-2.5 py-2 text-[12px] text-[var(--foreground)] outline-none focus:border-[var(--accent)]/40"
      >
        {options.map((o) => (
          <option key={String(o.value)} value={String(o.value)}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function SliderField({
  label,
  value,
  min,
  max,
  onChange,
  disabled,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className={`min-w-0 ${disabled ? "pointer-events-none opacity-45" : ""}`}>
      <div className="flex items-center justify-between gap-2">
        <FieldLabel>{label}</FieldLabel>
        <span className="text-[10px] tabular-nums text-[var(--header-muted)]">
          {value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[var(--header-border)] accent-[var(--accent)]"
      />
    </div>
  );
}

function Divider() {
  return <hr className="border-0 border-t border-[color:var(--header-border)]" />;
}

const controlRowClass = "flex min-w-0 flex-col gap-3";

function ControlOptionRow({ children }: { children: React.ReactNode }) {
  return <div className={controlRowClass}>{children}</div>;
}

function StylePresetPicker({
  fontKey,
  fontClassName,
  selectedId,
  onSelect,
}: {
  fontKey: PreviewFontKey;
  fontClassName: string;
  selectedId: string;
  onSelect: (presetId: string) => void;
}) {
  return (
    <div>
      <FieldLabel>Choose style</FieldLabel>
      <div className="mt-2 space-y-2">
        {GENERATOR_STYLE_PRESETS.map((preset) => {
          const selected = preset.id === selectedId;
          const previewSettings = previewSettingsForPreset(fontKey, preset.id);
          const miniStyle: React.CSSProperties = {
            ...buildPreviewTextStyle({ ...previewSettings, fontSize: 22 }),
            lineHeight: 1.05,
          };

          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelect(preset.id)}
              aria-pressed={selected}
              className={`w-full min-w-0 rounded-xl border px-3 py-2.5 text-left transition-[border-color,background-color,box-shadow] ${
                selected
                  ? "border-[color:var(--chip-active-border)] bg-[var(--chip-active-bg)] ring-1 ring-[color:color-mix(in_oklab,var(--accent)_35%,transparent)]"
                  : "border-[color:var(--header-border)] bg-[var(--header-surface)] hover:border-[color:color-mix(in_oklab,var(--accent)_22%,var(--header-border))] hover:bg-[var(--header-hover)]"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold tracking-wide text-[var(--foreground)]">
                  {preset.label}
                </span>
                <span
                  className={`flex size-4 shrink-0 items-center justify-center rounded-full border ${
                    selected
                      ? "border-[var(--accent)] bg-[var(--accent)]"
                      : "border-[color:var(--header-border)] bg-transparent"
                  }`}
                  aria-hidden
                >
                  {selected ? (
                    <span className="size-1.5 rounded-full bg-white" />
                  ) : null}
                </span>
              </div>
              <div className="mt-2 max-w-full overflow-hidden rounded-lg border border-[color:var(--header-border)]/70 bg-[var(--background)]/60 px-2 py-2">
                <span
                  className={`${fontClassName} block max-w-full truncate text-center`}
                  style={miniStyle}
                >
                  ABCDEF
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

type FontGeneratorProps = {
  card: ShowcaseCard;
  previewText: string;
  onPreviewTextChange: (text: string) => void;
  fontKey: PreviewFontKey;
  onFontKeyChange: (key: PreviewFontKey) => void;
};

export function FontGenerator({
  card,
  previewText,
  onPreviewTextChange,
  fontKey,
  onFontKeyChange,
}: FontGeneratorProps) {
  const [settings, setSettings] = useState<GeneratorSettings>(() =>
    createDefaultGeneratorSettings(fontKey),
  );
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [shareMessage, setShareMessage] = useState<string | null>(null);

  const previewRef = useRef<HTMLDivElement>(null);
  const stagedFontRef = useRef(settings.fontKey);

  useEffect(() => {
    setSettings((s) =>
      s.fontKey === fontKey ? s : { ...s, fontKey },
    );
  }, [fontKey]);

  const patch = useCallback(
    (partial: Partial<GeneratorSettings>) => {
      setSettings((s) => ({ ...s, ...partial }));
      if (partial.fontKey !== undefined) {
        onFontKeyChange(partial.fontKey);
      }
    },
    [onFontKeyChange],
  );

  const activeMeta = PREVIEW_FONT_META[settings.fontKey];
  const downloadGoogleQuery =
    card.googleQuery ?? activeMeta.googleQuery;
  const downloadLabel =
    card.family ?? card.label ?? familyDisplayName(settings.fontKey);

  const handleDownloadFont = useCallback(async () => {
    setDownloading(true);
    setDownloadError(null);
    try {
      await downloadGoogleFontTtf(downloadGoogleQuery, downloadLabel);
    } catch {
      setDownloadError("Download failed. Try again.");
    } finally {
      setDownloading(false);
    }
  }, [downloadGoogleQuery, downloadLabel]);

  const handleShare = useCallback(async () => {
    const url = window.location.href;
    const title = `${card.label} — Installfont`;
    const text = `Preview and download ${card.label} on Installfont.`;
    setShareMessage(null);
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
        return;
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setShareMessage("Link copied");
      window.setTimeout(() => setShareMessage(null), 2200);
    } catch {
      setShareMessage("Could not share");
      window.setTimeout(() => setShareMessage(null), 2200);
    }
  }, [card.label]);

  const containerStyle = useMemo(
    () => buildPreviewContainerStyle(settings),
    [settings],
  );
  const textStyle = useMemo(() => buildPreviewTextStyle(settings), [settings]);
  const characters = useMemo(
    () => splitPreviewCharacters(previewText, settings),
    [previewText, settings],
  );

  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const changedFont = stagedFontRef.current !== settings.fontKey;
    stagedFontRef.current = settings.fontKey;
    if (reduce || !changedFont) return;

    gsap.fromTo(
      el,
      { opacity: 0.4, y: 10 },
      {
        opacity: 1,
        y: 0,
        duration: 0.35,
        ease: "power2.out",
      },
    );
  }, [settings.fontKey]);

  return (
    <section
      id="font-generator"
      className="page-px relative scroll-mt-[var(--site-header-offset)] border-t border-[color:var(--header-border)]/80 py-[var(--section-py)]"
    >
      <div className="page-container">
        <header className="mb-10">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[color:var(--header-border)] bg-[var(--header-surface)] px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--hero-muted)] backdrop-blur-md">
            <span className="size-1 rounded-full bg-[var(--accent)]" />
            Live preview
          </div>
          <h2 className="text-3xl font-semibold tracking-[-0.02em] text-[var(--foreground)] sm:text-4xl">
            {card.label} Generator
          </h2>
          <p className="mt-1.5 max-w-xl text-sm text-[var(--hero-muted)] sm:text-base">
            Adjust every control on the left — the preview updates instantly on
            the right. Font suggestions appear below.
          </p>
        </header>

        <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-[minmax(300px,400px)_1fr] lg:items-stretch lg:gap-8">
          <div className="flex min-w-0 max-h-[min(820px,calc(100dvh-var(--site-header-offset)-11rem+100px))] flex-col overflow-hidden rounded-2xl border border-[color:var(--card-border)] bg-[var(--card-bg)] backdrop-blur-xl">
            <div className="shrink-0 space-y-3 border-b border-[color:var(--header-border)] p-4 sm:p-5 sm:pb-4">
              <div>
                <FieldLabel>Preview text</FieldLabel>
                <input
                  type="text"
                  value={previewText}
                  onChange={(e) => onPreviewTextChange(e.target.value)}
                  placeholder="Enter preview text…"
                  className="mt-1.5 w-full rounded-lg border border-[color:var(--header-border)] bg-[var(--header-surface)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]/40"
                />
              </div>

              <SelectField
                label="Choose font"
                value={settings.fontKey}
                onChange={(fontKey) => patch({ fontKey })}
                options={PREVIEW_FONT_KEYS.map((key) => ({
                  value: key,
                  label: familyDisplayName(key),
                }))}
              />

              <div className="rounded-xl border border-[color:var(--header-border)] bg-[var(--header-surface)] px-3 py-3 text-center">
                <span
                  className={`block truncate text-base text-[var(--foreground)] ${activeMeta.className}`}
                >
                  {previewText || card.previewText}
                </span>
              </div>
            </div>

            <div className="generator-panel-scroll min-h-0 min-w-0 flex-1 space-y-5 px-4 pb-6 pt-4 sm:px-5">
              <StylePresetPicker
                fontKey={settings.fontKey}
                fontClassName={activeMeta.className}
                selectedId={settings.stylePresetId}
                onSelect={(stylePresetId) =>
                  setSettings((s) => applyStylePreset(s, stylePresetId))
                }
              />

              <div className="min-w-0 space-y-4">
                <FieldLabel>Size &amp; colors</FieldLabel>
                <div className="grid min-w-0 grid-cols-1 gap-4">
                <SelectField
                  label="Font size"
                  value={settings.fontSize}
                  onChange={(fontSize) => patch({ fontSize })}
                  options={FONT_SIZE_OPTIONS.map((n) => ({
                    value: n,
                    label: `${n}px`,
                  }))}
                />
                <ColorField
                  label="Font color"
                  value={settings.fontColor}
                  onChange={(fontColor) => patch({ fontColor })}
                  disabled={settings.gradientEnabled}
                />
                <ColorField
                  label="Background"
                  value={settings.backgroundColor}
                  onChange={(backgroundColor) => patch({ backgroundColor })}
                />
                </div>
              </div>

            <button
              type="button"
              onClick={() => patch({ advancedOpen: !settings.advancedOpen })}
              aria-expanded={settings.advancedOpen}
              className="flex w-full min-w-0 items-center justify-between gap-2 rounded-xl border border-[color:var(--header-border)] bg-[var(--header-surface)] px-3.5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--foreground)] transition-colors hover:bg-[var(--header-hover)]"
            >
              Advanced options
              <svg
                className={`size-4 shrink-0 text-[var(--hero-muted)] transition-transform ${settings.advancedOpen ? "rotate-180" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {settings.advancedOpen ? (
              <div className="min-w-0 space-y-4 rounded-xl border border-[color:var(--header-border)] bg-[var(--header-surface)]/35 p-4">
                <ControlOptionRow>
                  <Toggle
                    label="Stroke"
                    checked={settings.strokeEnabled}
                    onChange={(strokeEnabled) => patch({ strokeEnabled })}
                  />
                  <div className="grid min-w-0 grid-cols-2 gap-3">
                    <SelectField
                      label="Stroke size"
                      value={settings.strokeSize}
                      onChange={(strokeSize) => patch({ strokeSize })}
                      disabled={!settings.strokeEnabled}
                      options={[1, 2, 3, 4, 5, 6, 8, 10].map((n) => ({
                        value: n,
                        label: `${n}px`,
                      }))}
                    />
                    <ColorField
                      label="Stroke color"
                      value={settings.strokeColor}
                      onChange={(strokeColor) => patch({ strokeColor })}
                      disabled={!settings.strokeEnabled}
                    />
                  </div>
                </ControlOptionRow>

                <Divider />

                <ControlOptionRow>
                  <Toggle
                    label="Stroke 2"
                    checked={settings.stroke2Enabled}
                    onChange={(stroke2Enabled) => patch({ stroke2Enabled })}
                  />
                  <div className="grid min-w-0 grid-cols-2 gap-3">
                    <SelectField
                      label="Stroke size"
                      value={settings.stroke2Size}
                      onChange={(stroke2Size) => patch({ stroke2Size })}
                      disabled={!settings.stroke2Enabled}
                      options={[1, 2, 3, 4, 5].map((n) => ({
                        value: n,
                        label: `${n}px`,
                      }))}
                    />
                    <ColorField
                      label="Stroke 2 color"
                      value={settings.stroke2Color}
                      onChange={(stroke2Color) => patch({ stroke2Color })}
                      disabled={!settings.stroke2Enabled}
                    />
                  </div>
                </ControlOptionRow>

                <Divider />

                <ControlOptionRow>
                  <Toggle
                    label="Gradient"
                    checked={settings.gradientEnabled}
                    onChange={(gradientEnabled) => patch({ gradientEnabled })}
                  />
                  <div className="grid min-w-0 grid-cols-2 gap-3">
                    <ColorField
                      label="Gradient start"
                      value={settings.gradientStart}
                      onChange={(gradientStart) => patch({ gradientStart })}
                      disabled={!settings.gradientEnabled}
                    />
                    <ColorField
                      label="Gradient end"
                      value={settings.gradientEnd}
                      onChange={(gradientEnd) => patch({ gradientEnd })}
                      disabled={!settings.gradientEnabled}
                    />
                  </div>
                </ControlOptionRow>

                <Divider />

                <ControlOptionRow>
                  <Toggle
                    label="Per letter"
                    checked={settings.perLetterEnabled}
                    onChange={(perLetterEnabled) => patch({ perLetterEnabled })}
                  />
                  <div className="grid min-w-0 grid-cols-2 gap-3">
                    <SelectField
                      label="Angle"
                      value={settings.perLetterAngle}
                      onChange={(perLetterAngle) => patch({ perLetterAngle })}
                      disabled={!settings.perLetterEnabled}
                      options={[
                        { value: "horizontal", label: "Horizontal" },
                        { value: "arc", label: "Arc" },
                        { value: "vertical", label: "Vertical" },
                      ]}
                    />
                    <SelectField
                      label="Distance"
                      value={settings.perLetterDistance}
                      onChange={(perLetterDistance) =>
                        patch({ perLetterDistance })
                      }
                      disabled={!settings.perLetterEnabled}
                      options={[0, 2, 4, 6, 8, 12, 16].map((n) => ({
                        value: n,
                        label: String(n),
                      }))}
                    />
                  </div>
                </ControlOptionRow>

                <div className="flex flex-wrap gap-3">
                  <Toggle
                    label="Shadow"
                    checked={settings.shadowEnabled}
                    onChange={(shadowEnabled) => patch({ shadowEnabled })}
                  />
                  <Toggle
                    label="3D"
                    checked={settings.threeDEnabled}
                    onChange={(threeDEnabled) => patch({ threeDEnabled })}
                  />
                  <Toggle
                    label="Dots between"
                    checked={settings.dotsBetweenEnabled}
                    onChange={(dotsBetweenEnabled) =>
                      patch({ dotsBetweenEnabled })
                    }
                  />
                </div>

                <Divider />

                <div className="flex min-w-0 flex-col gap-3">
                  <Toggle
                    label="Shadow depth"
                    checked={settings.shadowDepthEnabled}
                    onChange={(shadowDepthEnabled) =>
                      patch({ shadowDepthEnabled })
                    }
                  />
                  <SliderField
                    label="Depth"
                    value={settings.shadowDepth}
                    min={1}
                    max={16}
                    onChange={(shadowDepth) => patch({ shadowDepth })}
                    disabled={!settings.shadowDepthEnabled}
                  />
                </div>
                <ColorField
                  label="Shadow color"
                  value={settings.shadowDepthColor}
                  onChange={(shadowDepthColor) => patch({ shadowDepthColor })}
                  disabled={!settings.shadowDepthEnabled}
                />

                <Divider />

                <div className="flex min-w-0 flex-col gap-3">
                  <Toggle
                    label="Zoom depth"
                    checked={settings.zoomDepthEnabled}
                    onChange={(zoomDepthEnabled) => patch({ zoomDepthEnabled })}
                  />
                  <SliderField
                    label="Zoom"
                    value={settings.zoomDepth}
                    min={0}
                    max={100}
                    onChange={(zoomDepth) => patch({ zoomDepth })}
                    disabled={!settings.zoomDepthEnabled}
                  />
                </div>
                <ColorField
                  label="Zoom color"
                  value={settings.zoomDepthColor}
                  onChange={(zoomDepthColor) => patch({ zoomDepthColor })}
                  disabled={!settings.zoomDepthEnabled}
                />

                <Divider />

                <div className="flex min-w-0 flex-col gap-3">
                  <Toggle
                    label="Perspective"
                    checked={settings.perspectiveDepthEnabled}
                    onChange={(perspectiveDepthEnabled) =>
                      patch({ perspectiveDepthEnabled })
                    }
                  />
                  <SliderField
                    label="Perspective"
                    value={settings.perspectiveDepth}
                    min={0}
                    max={100}
                    onChange={(perspectiveDepth) => patch({ perspectiveDepth })}
                    disabled={!settings.perspectiveDepthEnabled}
                  />
                </div>
                <ColorField
                  label="Perspective color"
                  value={settings.perspectiveDepthColor}
                  onChange={(perspectiveDepthColor) =>
                    patch({ perspectiveDepthColor })
                  }
                  disabled={!settings.perspectiveDepthEnabled}
                />

                <Divider />

                <div className="grid min-w-0 grid-cols-1 gap-4">
                  <SliderField
                    label="Tilt"
                    value={settings.tilt}
                    min={-45}
                    max={45}
                    onChange={(tilt) => patch({ tilt })}
                  />
                  <SliderField
                    label="Opacity"
                    value={settings.opacity}
                    min={10}
                    max={100}
                    onChange={(opacity) => patch({ opacity })}
                  />
                  <SliderField
                    label="Bend"
                    value={settings.bend}
                    min={-30}
                    max={30}
                    onChange={(bend) => patch({ bend })}
                  />
                </div>
              </div>
            ) : null}
            </div>
          </div>

          <div
            className="relative overflow-hidden rounded-2xl border border-[color:var(--card-border)] backdrop-blur-xl transition-[background-color] duration-200"
            style={containerStyle}
          >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/40 to-transparent" />

              <div className="absolute right-3 top-3 z-20 flex items-stretch sm:right-4 sm:top-4">
                <div
                  className="flex overflow-hidden rounded-xl border border-[color:var(--header-border)] bg-[var(--header-surface-solid)] shadow-[0_8px_28px_-8px_rgba(0,0,0,0.55)]"
                  role="toolbar"
                  aria-label="Preview actions"
                >
                  <button
                    type="button"
                    onClick={handleDownloadFont}
                    disabled={downloading}
                    aria-label={
                      downloading ? "Downloading font" : "Download font"
                    }
                    title="Download font"
                    className="flex size-10 items-center justify-center text-[var(--foreground)] transition-colors hover:bg-[var(--header-hover)] disabled:cursor-wait disabled:opacity-60 sm:size-11"
                  >
                    <CloudDownloadIcon className="size-[18px] sm:size-5" />
                  </button>
                  <span
                    className="w-px shrink-0 self-stretch bg-[var(--header-border)]"
                    aria-hidden
                  />
                  <button
                    type="button"
                    onClick={handleShare}
                    aria-label="Share this font"
                    title="Share"
                    className="flex size-10 items-center justify-center text-[var(--foreground)] transition-colors hover:bg-[var(--header-hover)] sm:size-11"
                  >
                    <ShareIcon className="size-[18px] sm:size-5" />
                  </button>
                </div>
              </div>

              {downloadError || shareMessage ? (
                <p
                  className="absolute left-3 right-3 top-14 z-20 rounded-lg border border-[color:var(--header-border)] bg-[var(--header-surface-solid)] px-3 py-1.5 text-center text-[11px] text-[var(--foreground)]/90 shadow-md sm:left-4 sm:right-auto sm:top-16"
                  role="status"
                  aria-live="polite"
                >
                  {downloadError ?? shareMessage}
                </p>
              ) : null}

              <div className="flex min-h-[320px] items-center justify-center p-6 sm:min-h-[420px] sm:p-12">
                <div
                  ref={previewRef}
                  className="max-w-full text-center will-change-transform"
                >
                  <p
                    className={`font-semibold leading-[1.05] tracking-tight ${activeMeta.className}`}
                    style={textStyle}
                  >
                    {characters.map((char, index) => (
                      <span
                        key={`${char}-${index}`}
                        style={perLetterTransform(
                          index,
                          characters.length,
                          settings,
                        )}
                      >
                        {char}
                      </span>
                    ))}
                  </p>
                  <span className="mt-4 inline-block text-[11px] uppercase tracking-[0.22em] text-[var(--header-muted)]">
                    {familyDisplayName(settings.fontKey)} ·{" "}
                    {GENERATOR_STYLE_PRESETS.find(
                      (p) => p.id === settings.stylePresetId,
                    )?.label ?? "Custom"}
                  </span>
                </div>
              </div>
          </div>
        </div>
      </div>
    </section>
  );
}

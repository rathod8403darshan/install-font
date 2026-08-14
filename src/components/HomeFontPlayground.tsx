"use client";

import { useMemo, useState } from "react";
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
  GENERATOR_STYLE_PRESETS,
  previewSettingsForPreset,
  type GeneratorSettings,
} from "@/lib/font-generator";

const HOME_PRESETS = GENERATOR_STYLE_PRESETS.filter((p) =>
  ["plain", "super-mario", "neon", "retro-3d"].includes(p.id),
);

export function HomeFontPlayground() {
  const [previewText, setPreviewText] = useState("iPhone");
  const [settings, setSettings] = useState<GeneratorSettings>(() =>
    createDefaultGeneratorSettings("pacifico"),
  );

  const activeMeta = PREVIEW_FONT_META[settings.fontKey];
  const display = previewText.trim() || "iPhone";
  const textStyle = useMemo(() => {
    const style = buildPreviewTextStyle({
      ...settings,
      fontSize: Math.min(settings.fontSize, 96),
    });
    return { ...style, fontSize: "clamp(2.4rem, 6vw, 4.6rem)" };
  }, [settings]);

  const presetLabel =
    HOME_PRESETS.find((p) => p.id === settings.stylePresetId)?.label ?? "Plain";

  const setFont = (fontKey: PreviewFontKey) => {
    setSettings((s) => ({ ...s, fontKey }));
  };

  const setPreset = (presetId: string) => {
    setSettings((s) => applyStylePreset(s, presetId));
  };

  return (
    <div
      data-m-item
      className="grid min-w-0 grid-cols-1 overflow-hidden rounded-2xl border border-[color:var(--header-border)] bg-[var(--card-bg)] lg:grid-cols-[minmax(17rem,22rem)_1fr]"
    >
      <div className="flex min-w-0 flex-col gap-4 border-b border-[color:var(--header-border)] p-4 sm:p-5 lg:border-b-0 lg:border-r">
        <label className="block">
          <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--hero-muted)]">
            Preview text
          </span>
          <input
            type="text"
            value={previewText}
            onChange={(e) => setPreviewText(e.target.value)}
            maxLength={24}
            className="mt-1.5 w-full rounded-lg border border-[color:var(--header-border)] bg-[var(--header-surface)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]/40"
          />
        </label>

        <label className="block">
          <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--hero-muted)]">
            Choose font
          </span>
          <select
            value={settings.fontKey}
            onChange={(e) => setFont(e.target.value as PreviewFontKey)}
            className="mt-1.5 w-full rounded-lg border border-[color:var(--header-border)] bg-[var(--header-surface)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]/40"
          >
            {PREVIEW_FONT_KEYS.map((key) => (
              <option key={key} value={key}>
                {familyDisplayName(key)}
              </option>
            ))}
          </select>
          <span
            className={`mt-2 block truncate rounded-lg border border-[color:var(--header-border)] bg-[var(--header-surface)] px-3 py-2 text-center text-[15px] text-[var(--foreground)] ${activeMeta.className}`}
          >
            {display}
          </span>
        </label>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--hero-muted)]">
            Choose style
          </p>
          <ul className="mt-2 space-y-1.5">
            {HOME_PRESETS.map((preset) => {
              const selected = settings.stylePresetId === preset.id;
              const sampleStyle = buildPreviewTextStyle({
                ...previewSettingsForPreset(settings.fontKey, preset.id),
                fontSize: 22,
              });
              return (
                <li key={preset.id}>
                  <button
                    type="button"
                    onClick={() => setPreset(preset.id)}
                    className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition-colors ${
                      selected
                        ? "border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)]"
                        : "border-[color:var(--header-border)] bg-[var(--header-surface)]/40 hover:border-[var(--accent)]/30"
                    }`}
                  >
                    <span
                      className={`size-3.5 shrink-0 rounded-full border ${
                        selected
                          ? "border-[var(--accent)] bg-[var(--accent)]"
                          : "border-[color:var(--header-border)]"
                      }`}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[12px] font-medium text-[var(--foreground)]">
                        {preset.label}
                      </span>
                      <span
                        className={`mt-0.5 block truncate text-[15px] leading-none ${activeMeta.className}`}
                        style={sampleStyle}
                      >
                        ABCDEF
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="relative flex min-h-[16rem] flex-col items-center justify-center bg-[color-mix(in_oklab,var(--background)_70%,transparent)] px-5 py-10 sm:min-h-[20rem]">
        <p
          className={`max-w-full break-words text-center font-semibold leading-[1.05] tracking-tight ${activeMeta.className}`}
          style={textStyle}
        >
          {display}
        </p>
        <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--hero-muted)]">
          {familyDisplayName(settings.fontKey)} — {presetLabel}
        </p>
      </div>
    </div>
  );
}

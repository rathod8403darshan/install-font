import type { CSSProperties } from "react";
import type { PreviewFontKey } from "@/fonts/preview-fonts";

export type GeneratorSettings = {
  fontKey: PreviewFontKey;
  stylePresetId: string;
  fontSize: number;
  fontColor: string;
  backgroundColor: string;
  advancedOpen: boolean;
  strokeEnabled: boolean;
  strokeSize: number;
  strokeColor: string;
  stroke2Enabled: boolean;
  stroke2Size: number;
  stroke2Color: string;
  gradientEnabled: boolean;
  gradientStart: string;
  gradientEnd: string;
  perLetterEnabled: boolean;
  perLetterAngle: "horizontal" | "arc" | "vertical";
  perLetterDistance: number;
  shadowEnabled: boolean;
  threeDEnabled: boolean;
  dotsBetweenEnabled: boolean;
  shadowDepthEnabled: boolean;
  shadowDepth: number;
  shadowDepthColor: string;
  zoomDepthEnabled: boolean;
  zoomDepth: number;
  zoomDepthColor: string;
  perspectiveDepthEnabled: boolean;
  perspectiveDepth: number;
  perspectiveDepthColor: string;
  tilt: number;
  opacity: number;
  bend: number;
};

export const FONT_SIZE_OPTIONS = [32, 48, 64, 80, 96, 120, 144] as const;

export const GENERATOR_STYLE_PRESETS: {
  id: string;
  label: string;
  patch: Partial<GeneratorSettings>;
}[] = [
  {
    id: "plain",
    label: "Plain",
    patch: {
      gradientEnabled: false,
      strokeEnabled: false,
      stroke2Enabled: false,
      shadowEnabled: false,
      threeDEnabled: false,
      shadowDepthEnabled: false,
    },
  },
  {
    id: "super-mario",
    label: "Super Mario",
    patch: {
      gradientEnabled: true,
      gradientStart: "#2563eb",
      gradientEnd: "#facc15",
      strokeEnabled: true,
      strokeSize: 5,
      strokeColor: "#ffffff",
      stroke2Enabled: false,
      shadowDepthEnabled: true,
      shadowDepth: 4,
      shadowDepthColor: "#1e3a5f",
      fontColor: "#ffffff",
    },
  },
  {
    id: "neon",
    label: "Neon Glow",
    patch: {
      gradientEnabled: true,
      gradientStart: "#4d93fc",
      gradientEnd: "#3ecf8e",
      strokeEnabled: true,
      strokeSize: 2,
      strokeColor: "#0f172a",
      shadowEnabled: true,
      fontColor: "#fafafa",
    },
  },
  {
    id: "retro-3d",
    label: "Retro 3D",
    patch: {
      gradientEnabled: false,
      strokeEnabled: true,
      strokeSize: 2,
      strokeColor: "#000000",
      threeDEnabled: true,
      shadowDepthEnabled: true,
      shadowDepth: 8,
      shadowDepthColor: "#7c3aed",
      fontColor: "#f472b6",
    },
  },
];

export function createDefaultGeneratorSettings(
  fontKey: PreviewFontKey,
): GeneratorSettings {
  return {
    fontKey,
    stylePresetId: "plain",
    fontSize: 80,
    fontColor: "#ffffff",
    backgroundColor: "#0a0a0c",
    advancedOpen: true,
    strokeEnabled: false,
    strokeSize: 3,
    strokeColor: "#000000",
    stroke2Enabled: false,
    stroke2Size: 2,
    stroke2Color: "#ffffff",
    gradientEnabled: false,
    gradientStart: "#4d93fc",
    gradientEnd: "#3ecf8e",
    perLetterEnabled: false,
    perLetterAngle: "horizontal",
    perLetterDistance: 4,
    shadowEnabled: false,
    threeDEnabled: false,
    dotsBetweenEnabled: false,
    shadowDepthEnabled: false,
    shadowDepth: 6,
    shadowDepthColor: "#000000",
    zoomDepthEnabled: false,
    zoomDepth: 50,
    zoomDepthColor: "#4d93fc",
    perspectiveDepthEnabled: false,
    perspectiveDepth: 50,
    perspectiveDepthColor: "#8b5cf6",
    tilt: 0,
    opacity: 100,
    bend: 0,
  };
}

export function applyStylePreset(
  current: GeneratorSettings,
  presetId: string,
): GeneratorSettings {
  const preset = GENERATOR_STYLE_PRESETS.find((p) => p.id === presetId);
  if (!preset) return { ...current, stylePresetId: presetId };
  return {
    ...current,
    ...preset.patch,
    stylePresetId: presetId,
    fontKey: current.fontKey,
  };
}

/** Settings snapshot for style-card previews in the generator panel. */
export function previewSettingsForPreset(
  fontKey: PreviewFontKey,
  presetId: string,
): GeneratorSettings {
  return applyStylePreset(createDefaultGeneratorSettings(fontKey), presetId);
}

function buildTextShadows(settings: GeneratorSettings): string | undefined {
  const layers: string[] = [];

  if (settings.shadowEnabled) {
    layers.push("0 4px 24px rgba(0,0,0,0.45)");
  }

  if (settings.shadowDepthEnabled) {
    const depth = Math.max(1, Math.round(settings.shadowDepth));
    const c = settings.shadowDepthColor;
    for (let i = 1; i <= depth; i++) {
      layers.push(`${i}px ${i}px 0 ${c}`);
    }
  }

  if (settings.threeDEnabled) {
    const c = settings.shadowDepthColor || "#000000";
    for (let i = 1; i <= 5; i++) {
      layers.push(`${i * 1.5}px ${i * 1.5}px 0 ${c}`);
    }
  }

  if (settings.stroke2Enabled) {
    const s = settings.stroke2Size;
    const c = settings.stroke2Color;
    layers.push(
      `${s}px 0 0 ${c}`,
      `-${s}px 0 0 ${c}`,
      `0 ${s}px 0 ${c}`,
      `0 -${s}px 0 ${c}`,
    );
  }

  if (settings.zoomDepthEnabled) {
    const z = settings.zoomDepth / 10;
    layers.push(`0 0 ${z}px ${settings.zoomDepthColor}`);
  }

  return layers.length > 0 ? layers.join(", ") : undefined;
}

export function buildPreviewContainerStyle(
  settings: GeneratorSettings,
): CSSProperties {
  const transforms: string[] = [];
  if (settings.perspectiveDepthEnabled) {
    transforms.push(`perspective(600px) rotateX(${settings.perspectiveDepth / 8}deg)`);
  }
  if (settings.zoomDepthEnabled) {
    transforms.push(`scale(${0.85 + settings.zoomDepth / 200})`);
  }

  return {
    backgroundColor: settings.backgroundColor,
    transform: transforms.length ? transforms.join(" ") : undefined,
  };
}

export function buildPreviewTextStyle(
  settings: GeneratorSettings,
): CSSProperties {
  const style: CSSProperties = {
    fontSize: settings.fontSize,
    opacity: settings.opacity / 100,
    transform: `rotate(${settings.tilt}deg) skewY(${settings.bend}deg)`,
    letterSpacing: settings.perLetterEnabled
      ? `${settings.perLetterDistance}px`
      : undefined,
    textShadow: buildTextShadows(settings),
    lineHeight: 1.05,
  };

  if (settings.strokeEnabled) {
    style.WebkitTextStroke = `${settings.strokeSize}px ${settings.strokeColor}`;
    style.paintOrder = "stroke fill";
  }

  if (settings.gradientEnabled) {
    style.backgroundImage = `linear-gradient(180deg, ${settings.gradientStart}, ${settings.gradientEnd})`;
    style.WebkitBackgroundClip = "text";
    style.backgroundClip = "text";
    style.color = "transparent";
  } else {
    style.color = settings.fontColor;
  }

  return style;
}

export function splitPreviewCharacters(
  text: string,
  settings: GeneratorSettings,
): string[] {
  const base = text || "Your text here";
  if (!settings.dotsBetweenEnabled) return [...base];

  return [...base].flatMap((char, index) =>
    index < base.length - 1 && char !== " " ? [char, "·"] : [char],
  );
}

export function perLetterTransform(
  index: number,
  total: number,
  settings: GeneratorSettings,
): CSSProperties | undefined {
  if (!settings.perLetterEnabled) return undefined;

  if (settings.perLetterAngle === "horizontal") return undefined;

  if (settings.perLetterAngle === "vertical") {
    return { display: "inline-block", transform: "rotate(90deg)" };
  }

  const mid = (total - 1) / 2;
  const angle = ((index - mid) / Math.max(total - 1, 1)) * 24;
  return {
    display: "inline-block",
    transform: `rotate(${angle}deg)`,
    transformOrigin: "50% 100%",
  };
}

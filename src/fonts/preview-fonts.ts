import {
  Bebas_Neue,
  Bungee,
  Cinzel,
  Creepster,
  Lobster,
  Monoton,
  Oswald,
  Pacifico,
  Permanent_Marker,
  Righteous,
} from "next/font/google";

/** Preview fonts loaded via next/font (self-hosted subset). Map to Google Fonts CSS names for “copy snippet”. */
export const previewBebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
});

export const previewCinzel = Cinzel({
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const previewPacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
});

export const previewOswald = Oswald({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const previewCreepster = Creepster({
  subsets: ["latin"],
  weight: "400",
});

export const previewPermanentMarker = Permanent_Marker({
  subsets: ["latin"],
  weight: "400",
});

export const previewLobster = Lobster({
  subsets: ["latin"],
  weight: "400",
});

export const previewRighteous = Righteous({
  subsets: ["latin"],
  weight: "400",
});

export const previewBungee = Bungee({
  subsets: ["latin"],
  weight: "400",
});

export const previewMonoton = Monoton({
  subsets: ["latin"],
  weight: "400",
});

export type PreviewFontKey =
  | "bebas"
  | "cinzel"
  | "pacifico"
  | "oswald"
  | "creepster"
  | "marker"
  | "lobster"
  | "righteous"
  | "bungee"
  | "monoton";

export const PREVIEW_FONT_META: Record<
  PreviewFontKey,
  { className: string; googleQuery: string; stack: string }
> = {
  bebas: {
    className: previewBebas.className,
    googleQuery: "Bebas+Neue:wght@400",
    stack: "'Bebas Neue', sans-serif",
  },
  cinzel: {
    className: previewCinzel.className,
    googleQuery: "Cinzel:wght@600;700",
    stack: "'Cinzel', serif",
  },
  pacifico: {
    className: previewPacifico.className,
    googleQuery: "Pacifico:wght@400",
    stack: "'Pacifico', cursive",
  },
  oswald: {
    className: previewOswald.className,
    googleQuery: "Oswald:wght@500;600;700",
    stack: "'Oswald', sans-serif",
  },
  creepster: {
    className: previewCreepster.className,
    googleQuery: "Creepster:wght@400",
    stack: "'Creepster', system-ui",
  },
  marker: {
    className: previewPermanentMarker.className,
    googleQuery: "Permanent+Marker:wght@400",
    stack: "'Permanent Marker', cursive",
  },
  lobster: {
    className: previewLobster.className,
    googleQuery: "Lobster:wght@400",
    stack: "'Lobster', cursive",
  },
  righteous: {
    className: previewRighteous.className,
    googleQuery: "Righteous:wght@400",
    stack: "'Righteous', sans-serif",
  },
  bungee: {
    className: previewBungee.className,
    googleQuery: "Bungee:wght@400",
    stack: "'Bungee', sans-serif",
  },
  monoton: {
    className: previewMonoton.className,
    googleQuery: "Monoton:wght@400",
    stack: "'Monoton', cursive",
  },
};

/** All preview fonts shown in the editor suggestion list (order = display). */
export const PREVIEW_FONT_KEYS: PreviewFontKey[] = [
  "pacifico",
  "cinzel",
  "marker",
  "lobster",
  "righteous",
  "bebas",
  "oswald",
  "bungee",
  "monoton",
  "creepster",
];

export function previewFontDisplayName(key: PreviewFontKey): string {
  const family = PREVIEW_FONT_META[key].googleQuery.split(":")[0] ?? "";
  return family.replace(/\+/g, " ");
}

export function googleFontsSpecimenUrl(googleQuery: string): string {
  const family = googleQuery.split(":")[0] ?? googleQuery;
  return `https://fonts.google.com/specimen/${family}`;
}

export function buildGoogleFontSnippet(googleQuery: string, stack: string) {
  const url = `https://fonts.googleapis.com/css2?family=${googleQuery}&display=swap`;
  return `@import url('${url}');

body {
  font-family: ${stack};
}`;
}

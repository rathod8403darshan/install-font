import type { FontCategorySlug } from "@/data/font-categories";

/** Max meta keywords per page (avoid stuffing; Google largely ignores this tag). */
export const MAX_META_KEYWORDS = 28;

function normalizeKeyword(raw: string): string {
  return raw
    .replace(/^[*"\s]+|[*"\s]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Dedupe and cap keyword lists for the meta keywords tag. */
export function pickMetaKeywords(
  ...groups: ReadonlyArray<string | readonly string[]>
): string[] {
  const seen = new Set<string>();
  const out: string[] = [];

  for (const group of groups) {
    const items = typeof group === "string" ? [group] : group;
    for (const raw of items) {
      const keyword = normalizeKeyword(raw);
      if (!keyword) continue;
      const key = keyword.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(keyword);
      if (out.length >= MAX_META_KEYWORDS) return out;
    }
  }

  return out;
}

/** Site-wide terms - merged into most public pages. */
export const GLOBAL_META_KEYWORDS = pickMetaKeywords([
  "Install fonts",
  "Install Fonts",
  "Installfont",
  "installfont.com",
  "font installer",
  "Font Installer",
  "custom fonts",
  "Custom Fonts",
  "Google Fonts",
  "download font",
  "Download font",
  "font preview",
  "Font Preview",
  "TTF fonts",
  "TTF Fonts",
  "OTF fonts",
  "OTF Fonts",
  "Install TTF",
  "Install OTF",
  "Import TTF/OTF",
  "font manager",
  "Font Manager",
  "font collections",
  "Font Collections",
  "compare fonts",
  "Compare Fonts",
  "designer fonts",
  "Designer Fonts",
  "beautiful fonts",
  "custom typography",
  "font style",
  "Fonts",
  "All font",
  "New font",
  "My font",
]);

/** Install & format-focused terms. */
export const INSTALL_FORMAT_KEYWORDS = [
  "Use Custom Font",
  "Font Profiles",
  "offline fonts",
  "Offline fonts",
  "Install TTF",
  "Install OTF",
] as const;

/** Mobile app (iFont / Installfont) terms. */
export const MOBILE_APP_KEYWORDS = [
  "iFont",
  "iFont original",
  "iFont free app",
  "iPhone fonts",
  "iPhone Fonts",
  "Font for iPhone",
  "iPad fonts",
  "Safari fonts",
  "font for iphone",
] as const;

/** Reading & accessibility terms. */
export const READING_KEYWORDS = [
  "Reading Fonts",
  "Fonts for Reading",
  "Dyslexia Font",
  "Book Fonts",
  "Better Reading",
  "Focus Reading Font",
  "reading experience",
  "Reading experience",
] as const;

/** Home / catalog discovery terms. */
export const DISCOVERY_KEYWORDS = [
  "famous fonts",
  "font catalog",
  "movie fonts",
  "logo fonts",
  "book fonts",
  "game fonts",
  "music fonts",
  "font generator",
  "brand fonts",
  "Brand fonts",
  "display fonts",
  "free fonts",
] as const;

const CATEGORY_KEYWORD_MAP: Record<FontCategorySlug, readonly string[]> = {
  movie: [
    "movie fonts",
    "Movie Fonts",
    "title fonts",
    "poster fonts",
    "display fonts",
    "famous fonts",
  ],
  music: [
    "music fonts",
    "Music Fonts",
    "album fonts",
    "script fonts",
    "display fonts",
  ],
  game: [
    "game fonts",
    "Game Fonts",
    "pixel fonts",
    "arcade fonts",
    "UI fonts",
  ],
  logo: [
    "logo fonts",
    "Logo Fonts",
    "brand fonts",
    "Brand fonts",
    "designer fonts",
    "wordmark fonts",
  ],
  book: [
    "book fonts",
    "Book Fonts",
    "reading fonts",
    "Fonts for Reading",
    "Dyslexia Font",
    "editorial fonts",
    "Better Reading",
  ],
};

export function getHomeMetaKeywords(): string[] {
  return pickMetaKeywords(
    GLOBAL_META_KEYWORDS,
    DISCOVERY_KEYWORDS,
    INSTALL_FORMAT_KEYWORDS,
    MOBILE_APP_KEYWORDS,
    READING_KEYWORDS,
  );
}

export function getCategoryMetaKeywords(
  slug: FontCategorySlug,
  extras: string[] = [],
): string[] {
  return pickMetaKeywords(
    GLOBAL_META_KEYWORDS,
    CATEGORY_KEYWORD_MAP[slug],
    slug === "book" ? READING_KEYWORDS : [],
    INSTALL_FORMAT_KEYWORDS,
    MOBILE_APP_KEYWORDS,
    extras,
  );
}

export function getFontDetailMetaKeywords(input: {
  displayName: string;
  label: string;
  previewText?: string;
  categorySlug?: FontCategorySlug | null;
}): string[] {
  const { displayName, label, previewText, categorySlug } = input;
  const categoryExtras = categorySlug
    ? CATEGORY_KEYWORD_MAP[categorySlug]
    : [];

  return pickMetaKeywords(
    GLOBAL_META_KEYWORDS,
    [
      displayName,
      `${displayName} font`,
      label,
      previewText ?? "",
      "download font",
      "font preview",
      "Install TTF",
      "Install OTF",
    ],
    categoryExtras,
    categorySlug === "book" ? READING_KEYWORDS : [],
    MOBILE_APP_KEYWORDS,
  );
}

export function getAboutMetaKeywords(): string[] {
  return pickMetaKeywords(GLOBAL_META_KEYWORDS, DISCOVERY_KEYWORDS, [
    "about Installfont",
    "font discovery",
    "font tools",
  ]);
}

export function getContactMetaKeywords(): string[] {
  return pickMetaKeywords(GLOBAL_META_KEYWORDS, MOBILE_APP_KEYWORDS, [
    "contact Installfont",
    "font support",
    "iFont support",
  ]);
}

export function getLicensingMetaKeywords(): string[] {
  return pickMetaKeywords(GLOBAL_META_KEYWORDS, [
    "font license",
    "Google Fonts license",
    "OFL",
    "open font license",
    "TTF license",
    "OTF license",
  ]);
}

export function getPrivacyMetaKeywords(): string[] {
  return pickMetaKeywords(GLOBAL_META_KEYWORDS, [
    "privacy policy",
    "data protection",
    "cookies",
    "Installfont privacy",
  ]);
}

/** Homepage meta description - primary keywords woven in naturally. */
export const HOME_META_DESCRIPTION =
  "Install custom fonts on iPhone and iPad. Preview fonts, import TTF & OTF files, install Google Fonts, and use them in Pages, Keynote, Safari, and more.";

/** Default site description for layout fallback. */
export const SITE_META_DESCRIPTION = HOME_META_DESCRIPTION;

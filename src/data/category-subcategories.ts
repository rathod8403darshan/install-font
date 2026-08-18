import type { FontCategorySlug } from "@/data/font-categories";

export type Subcategory = {
  slug: string;
  label: string;
  shortLabel: string;
};

/** Topic chips shown under each main category (Google Fonts-style browse). */
export const SUBCATEGORIES: Record<FontCategorySlug, Subcategory[]> = {
  game: [
    { slug: "action-adventure", label: "Action & Adventure Fonts", shortLabel: "Action" },
    { slug: "company-consoles", label: "Company & Consoles Fonts", shortLabel: "Consoles" },
    { slug: "fighting", label: "Fighting Fonts", shortLabel: "Fighting" },
    { slug: "racing", label: "Racing Fonts", shortLabel: "Racing" },
    { slug: "role-playing", label: "Role Playing Fonts", shortLabel: "RPG" },
    { slug: "shooter", label: "Shooter Fonts", shortLabel: "Shooter" },
    { slug: "simulation", label: "Simulation Fonts", shortLabel: "Simulation" },
    { slug: "strategy", label: "Strategy Fonts", shortLabel: "Strategy" },
  ],
  movie: [
    { slug: "horror-thriller", label: "Horror & Thriller Fonts", shortLabel: "Horror" },
    { slug: "sci-fi-fantasy", label: "Sci-Fi & Fantasy Fonts", shortLabel: "Sci-Fi" },
    { slug: "comedy-light", label: "Comedy & Light Fonts", shortLabel: "Comedy" },
    { slug: "drama-serif", label: "Drama & Serif Fonts", shortLabel: "Drama" },
    { slug: "blockbuster", label: "Blockbuster & Action Fonts", shortLabel: "Blockbuster" },
    { slug: "retro-vintage", label: "Retro & Vintage Fonts", shortLabel: "Retro" },
    { slug: "tv-series", label: "TV & Series Fonts", shortLabel: "TV" },
    { slug: "credits-title", label: "Credits & Title Fonts", shortLabel: "Credits" },
  ],
  music: [
    { slug: "script-handwriting", label: "Script & Handwriting Fonts", shortLabel: "Script" },
    { slug: "album-cover", label: "Album & Cover Fonts", shortLabel: "Album" },
    { slug: "rock-punk", label: "Rock & Punk Fonts", shortLabel: "Rock" },
    { slug: "jazz-blues", label: "Jazz & Blues Fonts", shortLabel: "Jazz" },
    { slug: "pop-modern", label: "Pop & Modern Fonts", shortLabel: "Pop" },
    { slug: "classical", label: "Classical Fonts", shortLabel: "Classical" },
    { slug: "graffiti-street", label: "Graffiti & Street Fonts", shortLabel: "Graffiti" },
    { slug: "festival-poster", label: "Festival & Poster Fonts", shortLabel: "Festival" },
  ],
  logo: [
    { slug: "geometric-sans", label: "Geometric Sans Fonts", shortLabel: "Geometric" },
    { slug: "humanist-sans", label: "Humanist Sans Fonts", shortLabel: "Humanist" },
    { slug: "rounded-friendly", label: "Rounded & Friendly Fonts", shortLabel: "Rounded" },
    { slug: "tech-startup", label: "Tech & Startup Fonts", shortLabel: "Tech" },
    { slug: "luxury-fashion", label: "Luxury & Fashion Fonts", shortLabel: "Luxury" },
    { slug: "bold-display", label: "Bold Display Fonts", shortLabel: "Bold" },
    { slug: "minimal-clean", label: "Minimal & Clean Fonts", shortLabel: "Minimal" },
    { slug: "corporate", label: "Corporate Fonts", shortLabel: "Corporate" },
  ],
  book: [
    { slug: "classic-serif", label: "Classic Serif Fonts", shortLabel: "Classic" },
    { slug: "modern-serif", label: "Modern Serif Fonts", shortLabel: "Modern" },
    { slug: "literary", label: "Literary Fonts", shortLabel: "Literary" },
    { slug: "children-story", label: "Children & Story Fonts", shortLabel: "Children" },
    { slug: "academic", label: "Academic Fonts", shortLabel: "Academic" },
    { slug: "poetry-display", label: "Poetry & Display Fonts", shortLabel: "Poetry" },
    { slug: "newspaper", label: "Newspaper Fonts", shortLabel: "Newspaper" },
    { slug: "encyclopedia", label: "Encyclopedia Fonts", shortLabel: "Encyclopedia" },
  ],
};

export function getSubcategories(category: FontCategorySlug): Subcategory[] {
  return SUBCATEGORIES[category];
}

export function isSubcategorySlug(
  category: FontCategorySlug,
  slug: string,
): boolean {
  return SUBCATEGORIES[category].some((s) => s.slug === slug);
}

export function getSubcategoryLabel(
  category: FontCategorySlug,
  subSlug: string,
): string | undefined {
  return SUBCATEGORIES[category].find((s) => s.slug === subSlug)?.label;
}

export function getSubcategoryShortLabel(
  category: FontCategorySlug,
  subSlug: string,
): string | undefined {
  return SUBCATEGORIES[category].find((s) => s.slug === subSlug)?.shortLabel;
}

/** Stable bucket so each font always maps to one sub-topic. */
function hashSlug(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) {
    h = (h * 31 + slug.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function getFontSubcategorySlug(
  fontSlug: string,
  category: FontCategorySlug,
): string {
  const subs = SUBCATEGORIES[category];
  if (!subs.length) return "";
  return subs[hashSlug(fontSlug) % subs.length]!.slug;
}

export function buildCategoryBrowseHref(
  category: FontCategorySlug,
  options?: { tag?: string | null; page?: number },
): string {
  const params = new URLSearchParams();
  if (options?.tag) params.set("tag", options.tag);
  if (options?.page && options.page > 1) params.set("page", String(options.page));
  const qs = params.toString();
  return qs ? `/fonts/${category}?${qs}` : `/fonts/${category}`;
}

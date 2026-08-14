import {
  CATEGORY_META,
  getAllCategoryFonts,
  getCategoryList,
  type FontCategorySlug,
} from "@/data/font-categories";
import { getAllCards } from "@/data/font-showcase";

export type SearchResultKind = "font" | "category";

export type FontSearchResult = {
  kind: SearchResultKind;
  slug: string;
  title: string;
  subtitle: string;
  href: string;
  category?: FontCategorySlug;
};

type SearchIndexEntry = FontSearchResult & {
  haystack: string;
};

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function buildHaystack(parts: string[]): string {
  return normalizeText(parts.filter(Boolean).join(" "));
}

function buildIndex(): SearchIndexEntry[] {
  const fontBySlug = new Map<string, SearchIndexEntry>();

  for (const font of getAllCategoryFonts()) {
    const meta = CATEGORY_META[font.category];
    const title = `${font.family} Font`;
    fontBySlug.set(font.slug, {
      kind: "font",
      slug: font.slug,
      title,
      subtitle: meta.shortLabel,
      href: `/fonts/${font.slug}`,
      category: font.category,
      haystack: buildHaystack([title, font.family, font.slug, meta.label, meta.shortLabel]),
    });
  }

  for (const card of getAllCards()) {
    const existing = fontBySlug.get(card.slug);
    const family =
      card.family ?? card.label.replace(/\s+font$/i, "").trim();
    const categorySlug = existing?.category;
    const categoryLabel = categorySlug
      ? CATEGORY_META[categorySlug].shortLabel
      : null;
    fontBySlug.set(card.slug, {
      kind: "font",
      slug: card.slug,
      title: card.label,
      subtitle: categoryLabel ? `Featured · ${categoryLabel}` : "Featured",
      href: `/fonts/${card.slug}`,
      category: categorySlug,
      haystack: buildHaystack([
        card.label,
        card.previewText,
        family,
        card.slug,
        categoryLabel ?? "",
      ]),
    });
  }

  const categories: SearchIndexEntry[] = getCategoryList().map((meta) => ({
    kind: "category",
    slug: meta.slug,
    title: meta.label,
    subtitle: "Browse category",
    href: `/fonts/${meta.slug}`,
    haystack: buildHaystack([
      meta.label,
      meta.shortLabel,
      meta.subtitle,
      meta.blurb,
      meta.slug,
    ]),
  }));

  return [...categories, ...fontBySlug.values()];
}

const SEARCH_INDEX = buildIndex();

function scoreMatch(query: string, entry: SearchIndexEntry): number {
  const q = normalizeText(query);
  if (!q) return 0;

  const terms = q.split(/\s+/).filter(Boolean);
  const title = normalizeText(entry.title);
  const slugText = normalizeText(entry.slug.replace(/-/g, " "));
  const haystack = entry.haystack;

  let score = 0;

  if (title === q || slugText === q) score += 120;
  if (title.startsWith(q)) score += 80;
  if (slugText.startsWith(q)) score += 70;
  if (haystack.startsWith(q)) score += 40;

  for (const term of terms) {
    if (!term) continue;
    if (title === term) score += 60;
    else if (title.startsWith(term)) score += 35;
    else if (title.includes(term)) score += 22;

    if (slugText.startsWith(term)) score += 28;
    else if (slugText.includes(term)) score += 18;

    if (haystack.includes(term)) score += 10;
  }

  if (entry.kind === "category" && terms.some((t) => haystack.includes(t))) {
    score += 15;
  }

  return score;
}

export function searchFonts(
  query: string,
  limit = 12,
): FontSearchResult[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  return SEARCH_INDEX.map((entry) => ({
    entry,
    score: scoreMatch(trimmed, entry),
  }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title))
    .slice(0, limit)
    .map(({ entry }) => ({
      kind: entry.kind,
      slug: entry.slug,
      title: entry.title,
      subtitle: entry.subtitle,
      href: entry.href,
      category: entry.category,
    }));
}

import { PREVIEW_FONT_META, type PreviewFontKey } from "@/fonts/preview-fonts";
import {
  getAllCategoryFontSlugs,
  getCategoryFontBySlug,
  getCategoryFonts,
  type CategoryFont,
} from "@/data/font-categories";

export type FontVariant = {
  name: string;
  fontKey: PreviewFontKey;
  badge: "Similar" | "Original";
};

export type ShowcaseCard = {
  slug: string;
  previewText: string;
  label: string;
  /** Set for the original 23 curated cards using `next/font/google`. */
  fontKey?: PreviewFontKey;
  /** Set for Google Fonts catalog entries loaded at runtime via CSS2 link. */
  family?: string;
  /** CSS `font-family` stack to apply when there is no fontKey. */
  stack?: string;
  /** URL-encoded family / weights segment, e.g. "Cinzel:wght@600;700". */
  googleQuery?: string;
};

const cycle: PreviewFontKey[] = [
  "bebas",
  "cinzel",
  "pacifico",
  "oswald",
  "creepster",
  "marker",
  "lobster",
  "righteous",
  "bungee",
  "monoton",
];

function pick(i: number): PreviewFontKey {
  return cycle[i % cycle.length]!;
}

function slugify(label: string): string {
  return label
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function card(
  previewText: string,
  label: string,
  fontKey: PreviewFontKey,
): ShowcaseCard {
  return { slug: slugify(label), previewText, label, fontKey };
}

export const recentAdditions: ShowcaseCard[] = [
  card("Checkfor", "CheckFor Logo Font", pick(0)),
  card("Harry Potter", "Harry Potter (TV Series) Font", pick(1)),
  card("The Life of a Showgirl", "The Life of a Showgirl Font", pick(2)),
  card("Man's Best Friend", "Man's Best Friend Font", pick(3)),
  card("ARK Invest", "ARK Invest Font", pick(4)),
  card("Solo Leveling", "Solo Leveling Font", pick(5)),
  card("1923", "1923 Font", pick(6)),
  card("The White Lotus", "The White Lotus Font", pick(7)),
];

export const movieTvFonts: ShowcaseCard[] = [
  card("Invincible", "Invincible Font", pick(1)),
  card("Barbie", "Barbie (2023 Movie) Font", pick(2)),
  card("Squid Game", "Squid Game Font", pick(3)),
  card("Harry Potter", "Harry Potter Font", pick(4)),
  card("Toy Story", "Toy Story Font", pick(5)),
  card("Severance", "Severance Font", pick(6)),
  card("Interstellar", "Interstellar Font", pick(7)),
  card("Toronto Raptors", "Toronto Raptors Font", pick(8)),
];

export const bookFonts: ShowcaseCard[] = [
  card("Harry Potter", "Harry Potter Book Font", pick(0)),
  card("One Piece", "One Piece Font", pick(1)),
  card("Winnie the Pooh", "Disney's Winnie the Pooh Font", pick(2)),
  card("Thrasher", "Thrasher Font", pick(3)),
  card("Twisted Ones", "FNAF The Twisted Ones Font", pick(4)),
  card("Dr. Seuss", "Dr. Seuss Font", pick(5)),
  card("Goosebumps", "Goosebumps Font", pick(6)),
  card("Lord of the Rings", "Lord of the Rings Font", pick(7)),
];

const allCards: ShowcaseCard[] = [
  ...recentAdditions,
  ...movieTvFonts,
  ...bookFonts,
];

const bySlug = new Map<string, ShowcaseCard>();
for (const c of allCards) bySlug.set(c.slug, c);

function categoryFontToCard(font: CategoryFont): ShowcaseCard {
  return {
    slug: font.slug,
    previewText: font.family,
    label: `${font.family} Font`,
    family: font.family,
    stack: font.stack,
    googleQuery: font.googleQuery,
  };
}

export function getAllCards(): ShowcaseCard[] {
  return allCards;
}

/**
 * Curated slugs only. Used by `generateStaticParams` so we keep build times
 * fast - catalog-derived fonts render on-demand via `dynamicParams = true`.
 */
export function getAllSlugs(): string[] {
  return Array.from(bySlug.keys());
}

export function getAllSlugsIncludingCategoryFonts(): string[] {
  return [...bySlug.keys(), ...getAllCategoryFontSlugs()];
}

export function getCardBySlug(slug: string): ShowcaseCard | undefined {
  const curated = bySlug.get(slug);
  if (curated) return curated;
  const fromCategory = getCategoryFontBySlug(slug);
  return fromCategory ? categoryFontToCard(fromCategory) : undefined;
}

export function getSimilarCards(slug: string, count = 8): ShowcaseCard[] {
  const catFont = getCategoryFontBySlug(slug);
  if (catFont) {
    const peers = getCategoryFontsAsCards(catFont.category).filter(
      (c) => c.slug !== slug,
    );
    return peers.slice(0, count);
  }
  const list = allCards.filter((c) => c.slug !== slug);
  const offset = Math.max(0, allCards.findIndex((c) => c.slug === slug));
  const rotated = list.slice(offset).concat(list.slice(0, offset));
  return rotated.slice(0, count);
}

function getCategoryFontsAsCards(
  category: CategoryFont["category"],
): ShowcaseCard[] {
  return getCategoryFonts(category).map(categoryFontToCard);
}

export function familyDisplayName(key: PreviewFontKey): string {
  return PREVIEW_FONT_META[key].googleQuery
    .split(":")[0]!
    .replace(/\+/g, " ");
}

export function buildVariants(card: ShowcaseCard): FontVariant[] {
  const seedKey = card.fontKey ?? cycle[0]!;
  const idx = Math.max(0, cycle.indexOf(seedKey));
  const second = cycle[(idx + 3) % cycle.length]!;
  const third = cycle[(idx + 6) % cycle.length]!;
  return [
    {
      name: `${familyDisplayName(seedKey)} Italic`,
      fontKey: seedKey,
      badge: "Similar",
    },
    {
      name: familyDisplayName(second),
      fontKey: second,
      badge: "Similar",
    },
    {
      name: familyDisplayName(third),
      fontKey: third,
      badge: "Original",
    },
  ];
}

export function buildDescription(card: ShowcaseCard): string[] {
  const primary = card.fontKey
    ? familyDisplayName(card.fontKey)
    : (card.family ?? "this family");
  return [
    `${card.label} is a popular display typeface used across editorial pieces, posters, and on-screen titles. This page lists the closest free Google Fonts you can use to capture the look.`,
    `Our closest match is ${primary}, paired with two complementary faces that cover headings, sub-headings, and supporting copy. Each one ships free, hosted via Google Fonts and ready to drop into any project.`,
    `Download a font, copy the CSS snippet, or use the generator below to compose your own text in seconds.`,
  ];
}

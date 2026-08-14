import type { CategoryFont } from "@/data/font-categories";

export type FontSortMode = "popular" | "trending" | "latest";

export const FONT_SORT_OPTIONS: ReadonlyArray<{
  value: FontSortMode;
  label: string;
}> = [
  { value: "popular", label: "Popular" },
  { value: "trending", label: "Trending" },
  { value: "latest", label: "Latest" },
] as const;

export const DEFAULT_FONT_SORT: FontSortMode = "trending";

function trendingScore(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash * 31 + slug.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/** Stable sort for catalog fonts (dataset order = oldest → newest). */
export function sortCategoryFonts(
  items: CategoryFont[],
  mode: FontSortMode,
): CategoryFont[] {
  const list = [...items];

  switch (mode) {
    case "popular":
      return list.sort((a, b) =>
        a.family.localeCompare(b.family, undefined, { sensitivity: "base" }),
      );
    case "trending":
      return list.sort(
        (a, b) => trendingScore(b.slug) - trendingScore(a.slug),
      );
    case "latest":
      return list.reverse();
    default:
      return list;
  }
}

import type { ShowcaseCard } from "@/data/font-showcase";
import type { FontSortMode } from "@/lib/font-sort";

function trendingScore(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash * 31 + slug.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/** Sort curated showcase cards (array order = newest first for "latest"). */
export function sortShowcaseCards(
  items: ShowcaseCard[],
  mode: FontSortMode,
): ShowcaseCard[] {
  const list = [...items];

  switch (mode) {
    case "popular":
      return list.sort((a, b) =>
        a.label.localeCompare(b.label, undefined, { sensitivity: "base" }),
      );
    case "trending":
      return list.sort(
        (a, b) => trendingScore(b.slug) - trendingScore(a.slug),
      );
    case "latest":
    default:
      return list;
  }
}

import movieData from "./font-categories/movie.json";
import musicData from "./font-categories/music.json";
import gameData from "./font-categories/game.json";
import logoData from "./font-categories/logo.json";
import bookData from "./font-categories/book.json";
import {
  getFontSubcategorySlug,
  isSubcategorySlug,
} from "./category-subcategories";

export type FontCategorySlug = "movie" | "music" | "game" | "logo" | "book";

export type CategoryFont = {
  slug: string;
  family: string;
  category: FontCategorySlug;
  googleQuery: string;
  stack: string;
};

export type CategoryMeta = {
  slug: FontCategorySlug;
  label: string;
  shortLabel: string;
  navLabel: string;
  subtitle: string;
  blurb: string;
  accent: "accent" | "accent-2" | "accent-3";
};

export const CATEGORY_META: Record<FontCategorySlug, CategoryMeta> = {
  movie: {
    slug: "movie",
    label: "Movie Fonts",
    shortLabel: "Movie",
    navLabel: "Movie",
    subtitle: "Display typefaces inspired by title sequences, posters, and credits.",
    blurb:
      "Bold display faces for posters, title cards, and credits. Curated from the most popular display fonts on Google Fonts.",
    accent: "accent",
  },
  music: {
    slug: "music",
    label: "Music Fonts",
    shortLabel: "Music",
    navLabel: "Music",
    subtitle: "Script and handwriting families with a lyrical feel for album art and lyrics.",
    blurb:
      "Scripts, marker hands, and lyrical handwriting families that suit album covers, lyric videos, and tour merch.",
    accent: "accent-3",
  },
  game: {
    slug: "game",
    label: "Game Fonts",
    shortLabel: "Game",
    navLabel: "Game",
    subtitle: "Pixel, glitch, arcade, and monospaced families for game UIs and badges.",
    blurb:
      "Pixel, mono, and arcade-styled display fonts for UI overlays, badges, and retro logos.",
    accent: "accent-2",
  },
  logo: {
    slug: "logo",
    label: "Logo Fonts",
    shortLabel: "Logo",
    navLabel: "Logo",
    subtitle: "Geometric, neo-grotesque, and humanist sans serifs for brand systems.",
    blurb:
      "Neutral and characterful sans serifs that anchor wordmarks, app icons, and marketing systems.",
    accent: "accent",
  },
  book: {
    slug: "book",
    label: "Book Fonts",
    shortLabel: "Book",
    navLabel: "Book",
    subtitle: "Serifs and editorial display faces for long-form reading and covers.",
    blurb:
      "Editorial serifs and classic book faces tuned for headings, body copy, and dust jackets.",
    accent: "accent-3",
  },
};

export const CATEGORY_ORDER: FontCategorySlug[] = [
  "movie",
  "music",
  "game",
  "logo",
  "book",
];

export function getCategoryList(): CategoryMeta[] {
  return CATEGORY_ORDER.map((slug) => CATEGORY_META[slug]);
}

const datasets: Record<FontCategorySlug, CategoryFont[]> = {
  movie: movieData as CategoryFont[],
  music: musicData as CategoryFont[],
  game: gameData as CategoryFont[],
  logo: logoData as CategoryFont[],
  book: bookData as CategoryFont[],
};

const bySlug = new Map<string, CategoryFont>();
for (const slug of CATEGORY_ORDER) {
  for (const f of datasets[slug]) bySlug.set(f.slug, f);
}

export function isCategorySlug(value: string): value is FontCategorySlug {
  return CATEGORY_ORDER.includes(value as FontCategorySlug);
}

export function getCategoryFonts(
  cat: FontCategorySlug,
  tagSlug?: string | null,
): CategoryFont[] {
  let all = datasets[cat];
  if (tagSlug && isSubcategorySlug(cat, tagSlug)) {
    all = all.filter((f) => getFontSubcategorySlug(f.slug, cat) === tagSlug);
  }
  return all;
}

export function getCategoryFontBySlug(slug: string): CategoryFont | undefined {
  return bySlug.get(slug);
}

export function getAllCategoryFontSlugs(): string[] {
  return Array.from(bySlug.keys());
}

export function getAllCategoryFonts(): CategoryFont[] {
  return CATEGORY_ORDER.flatMap((cat) => datasets[cat]);
}

export const PAGE_SIZE = 20;

export type CategoryPage = {
  items: CategoryFont[];
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
};

export function getCategoryPage(
  cat: FontCategorySlug,
  page: number,
  pageSize: number = PAGE_SIZE,
  tagSlug?: string | null,
): CategoryPage {
  const all = getCategoryFonts(cat, tagSlug);
  const total = all.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, Math.floor(page) || 1), totalPages);
  const start = (safePage - 1) * pageSize;
  const items = all.slice(start, start + pageSize);
  return { items, page: safePage, totalPages, total, pageSize };
}

/** Builds a single fonts.googleapis.com/css2 link href that loads each family on the page. */
export function buildCategoryStylesheetHref(items: CategoryFont[]): string {
  if (items.length === 0) return "";
  const params = items.map((it) => `family=${it.googleQuery}`).join("&");
  return `https://fonts.googleapis.com/css2?${params}&display=swap`;
}

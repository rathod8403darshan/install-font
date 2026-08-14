import {
  PREVIEW_FONT_META,
  previewFontDisplayName,
  type PreviewFontKey,
} from "@/fonts/preview-fonts";
import {
  getAllCards,
  getCardBySlug,
  type ShowcaseCard,
} from "@/data/font-showcase";

export const LIKED_STORAGE_KEY = "installfont-liked";
const LEGACY_WISHLIST_KEY = "installfont-wishlist";
const LEGACY_FAVORITES_KEY = "installfont-favorite-fonts";
export const LIKED_CHANGE_EVENT = "installfont-liked-change";

export type LikedFontItem = {
  id: string;
  card: ShowcaseCard;
};

export function likedIdFromSlug(slug: string): string {
  return `slug:${slug}`;
}

export function likedIdFromPreviewKey(key: PreviewFontKey): string {
  return `preview:${key}`;
}

function parsePreviewKey(id: string): PreviewFontKey | null {
  if (!id.startsWith("preview:")) return null;
  const key = id.slice(8) as PreviewFontKey;
  return key in PREVIEW_FONT_META ? key : null;
}

export function slugFromPreviewKey(key: PreviewFontKey): string | null {
  const match = getAllCards().find((c) => c.fontKey === key);
  return match?.slug ?? null;
}

/** Prefer a font page slug when one exists for this preview font. */
export function likedIdForPreviewKey(key: PreviewFontKey): string {
  const slug = slugFromPreviewKey(key);
  return slug ? likedIdFromSlug(slug) : likedIdFromPreviewKey(key);
}

function cardFromPreviewKey(key: PreviewFontKey): ShowcaseCard {
  const slug =
    slugFromPreviewKey(key) ??
    `${previewFontDisplayName(key).toLowerCase().replace(/\s+/g, "-")}-font`;
  const name = previewFontDisplayName(key);
  const meta = PREVIEW_FONT_META[key];
  return {
    slug,
    previewText: name,
    label: `${name} Font`,
    fontKey: key,
    family: name,
    stack: meta.stack,
    googleQuery: meta.googleQuery,
  };
}

function migrateLegacyPreviewFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LEGACY_FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    const ids = parsed
      .filter((k): k is PreviewFontKey => typeof k === "string" && k in PREVIEW_FONT_META)
      .map((k) => likedIdFromPreviewKey(k));
    localStorage.removeItem(LEGACY_FAVORITES_KEY);
    return ids;
  } catch {
    return [];
  }
}

function readLegacyWishlistIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LEGACY_WISHLIST_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    localStorage.removeItem(LEGACY_WISHLIST_KEY);
    return parsed.filter((id): id is string => typeof id === "string");
  } catch {
    return [];
  }
}

export function readLikedIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LIKED_STORAGE_KEY);
    if (!raw) {
      const fromWishlist = readLegacyWishlistIds();
      const fromFavorites = migrateLegacyPreviewFavorites();
      const merged = [...new Set([...fromWishlist, ...fromFavorites])];
      if (merged.length > 0) {
        writeLikedIds(merged);
        return merged;
      }
      return [];
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return [...new Set(parsed.filter((id): id is string => typeof id === "string"))];
  } catch {
    return [];
  }
}

export function writeLikedIds(ids: string[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LIKED_STORAGE_KEY, JSON.stringify(ids));
    window.dispatchEvent(new CustomEvent(LIKED_CHANGE_EVENT));
  } catch {
    /* ignore quota */
  }
}

export function isLiked(id: string): boolean {
  return readLikedIds().includes(id);
}

/** Toggle liked entry; returns true if now liked. */
export function toggleLikedId(id: string): boolean {
  const ids = readLikedIds();
  const exists = ids.includes(id);
  const next = exists ? ids.filter((x) => x !== id) : [id, ...ids];
  writeLikedIds(next);
  return !exists;
}

export function resolveLikedItems(ids: string[]): LikedFontItem[] {
  const out: LikedFontItem[] = [];
  const seen = new Set<string>();

  for (const id of ids) {
    if (seen.has(id)) continue;

    if (id.startsWith("slug:")) {
      const slug = id.slice(5);
      const card = getCardBySlug(slug);
      if (card) {
        seen.add(id);
        out.push({ id, card });
      }
      continue;
    }

    const previewKey = parsePreviewKey(id);
    if (previewKey) {
      seen.add(id);
      out.push({ id, card: cardFromPreviewKey(previewKey) });
    }
  }

  return out;
}

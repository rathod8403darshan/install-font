import type { MetadataRoute } from "next";
import { getAllSlugsIncludingCategoryFonts } from "@/data/font-showcase";
import { SITE_URL } from "@/lib/site-config";

const CATEGORIES = ["movie", "music", "game", "logo", "book"] as const;
const CATEGORY_SET = new Set<string>(CATEGORIES);

const STATIC_ROUTES = [
  "",
  "/recent-additions",
  "/about",
  "/contact",
  "/privacy",
  "/licensing",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency:
      path === "" ? "daily" : path === "/recent-additions" ? "weekly" : "monthly",
    // Homepage must stay clearly above child pages for brand/domain queries.
    priority:
      path === "" ? 1 : path === "/recent-additions" ? 0.6 : 0.5,
  }));

  const categoryEntries: MetadataRoute.Sitemap = CATEGORIES.map((slug) => ({
    url: `${SITE_URL}/fonts/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const fontSlugs = [
    ...new Set(getAllSlugsIncludingCategoryFonts()),
  ].filter((slug) => !CATEGORY_SET.has(slug));

  const fontEntries: MetadataRoute.Sitemap = fontSlugs.map((slug) => ({
    url: `${SITE_URL}/fonts/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticEntries, ...categoryEntries, ...fontEntries];
}

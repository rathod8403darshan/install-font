import type { Metadata } from "next";
import {
  DEFAULT_OG_IMAGE_HEIGHT,
  DEFAULT_OG_IMAGE_PATH,
  DEFAULT_OG_IMAGE_WIDTH,
  SITE_DISPLAY_NAME,
  SITE_URL,
} from "@/lib/site-config";
import {
  GLOBAL_META_KEYWORDS,
  pickMetaKeywords,
  SITE_META_DESCRIPTION,
} from "@/lib/seo-keywords";

type PageMetadataInput = {
  title: string;
  description: string;
  /** Path used for Open Graph URL (may include query string). */
  path: string;
  /** Canonical path without query; defaults to `path` without search params. */
  canonicalPath?: string;
  /** Page-specific keywords (merged with global set, capped). */
  keywords?: string[];
  /** When false, adds noindex but keeps follow for filtered/duplicate views. */
  index?: boolean;
  /**
   * When true, skip the root title template so the title is used exactly
   * (important for the homepage brand SERP).
   */
  absoluteTitle?: boolean;
};

function mergeKeywords(extra?: string[]): string[] {
  return pickMetaKeywords(GLOBAL_META_KEYWORDS, extra ?? []);
}

function pathWithoutQuery(path: string): string {
  const base = path.startsWith("/") ? path : `/${path}`;
  return base.split("?")[0] ?? base;
}

function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized === "/" ? "" : normalized}`;
}

function defaultSocialImages(alt: string) {
  return [
    {
      url: DEFAULT_OG_IMAGE_PATH,
      width: DEFAULT_OG_IMAGE_WIDTH,
      height: DEFAULT_OG_IMAGE_HEIGHT,
      alt,
    },
  ];
}

export function buildPageMetadata({
  title,
  description,
  path,
  canonicalPath,
  keywords,
  index = true,
  absoluteTitle = false,
}: PageMetadataInput): Metadata {
  const ogPath = path.startsWith("/") ? path : `/${path}`;
  const canonical = canonicalPath ?? pathWithoutQuery(ogPath);
  const url = absoluteUrl(ogPath);
  const canonicalUrl = absoluteUrl(canonical);
  const keywordList = mergeKeywords(keywords);
  const imageAlt = `${title} — ${SITE_DISPLAY_NAME}`;
  const images = defaultSocialImages(imageAlt);

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords: keywordList,
    applicationName: SITE_DISPLAY_NAME,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_DISPLAY_NAME,
      type: "website",
      locale: "en_US",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_OG_IMAGE_PATH],
    },
  };
}

export function buildNotFoundMetadata(): Metadata {
  return {
    title: "Page not found",
    description: "The page you requested could not be found on Installfont.",
    robots: { index: false, follow: false },
  };
}

export function buildDefaultMetadata(): Metadata {
  const title = "Install Fonts for iPhone & iPad | Font Installer App";
  const description = SITE_META_DESCRIPTION;
  const images = defaultSocialImages(`${SITE_DISPLAY_NAME} — ${title}`);

  return {
    metadataBase: new URL(SITE_URL),
    applicationName: SITE_DISPLAY_NAME,
    appleWebApp: {
      title: SITE_DISPLAY_NAME,
    },
    title: {
      default: title,
      // Prefer display name so subpages don't all end in "Installfont"
      // (that made /recent-additions compete with the homepage for brand queries).
      template: `%s | ${SITE_DISPLAY_NAME}`,
    },
    description,
    keywords: [...GLOBAL_META_KEYWORDS],
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: SITE_DISPLAY_NAME,
      url: SITE_URL,
      title,
      description: SITE_META_DESCRIPTION,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: SITE_META_DESCRIPTION,
      images: [DEFAULT_OG_IMAGE_PATH],
    },
  };
}

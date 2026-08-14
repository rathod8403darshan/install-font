import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { FontDetailHero } from "@/components/FontDetailHero";
import { FontDetailEditor } from "@/components/FontDetailEditor";
import { FontShowcaseSection } from "@/components/FontShowcaseSection";
import { FontCategoryPage } from "@/components/FontCategoryPage";
import {
  getAllSlugs,
  getCardBySlug,
  getSimilarCards,
} from "@/data/font-showcase";
import {
  CATEGORY_META,
  getCategoryFontBySlug,
  getCategoryFonts,
  isCategorySlug,
} from "@/data/font-categories";
import { CategoryTopicSection } from "@/components/CategoryTopicSection";
import { getSubcategoryLabel } from "@/data/category-subcategories";
import { JsonLd } from "@/components/JsonLd";
import {
  buildBreadcrumbJsonLd,
  buildCollectionPageJsonLd,
  buildWebPageJsonLd,
} from "@/lib/json-ld";
import { buildNotFoundMetadata, buildPageMetadata } from "@/lib/seo";
import {
  getCategoryMetaKeywords,
  getFontDetailMetaKeywords,
} from "@/lib/seo-keywords";

export const dynamicParams = true;

export function generateStaticParams() {
  const curated = getAllSlugs().map((slug) => ({ slug }));
  const categories = (
    ["movie", "music", "game", "logo", "book"] as const
  ).map((slug) => ({ slug }));
  return [...curated, ...categories];
}

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function parseTag(searchParams: Record<string, string | string[] | undefined> | undefined) {
  const raw = searchParams?.tag;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value?.trim() || null;
}

function fontFamilyLabel(card: NonNullable<ReturnType<typeof getCardBySlug>>) {
  const fromLabel = card.label.replace(/\s+font$/i, "").trim();
  return card.family ?? (fromLabel || card.label);
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: SearchParams;
}): Promise<Metadata> {
  const { slug } = await params;

  if (isCategorySlug(slug)) {
    const sp = searchParams ? await searchParams : undefined;
    const tag = parseTag(sp);
    const meta = CATEGORY_META[slug];
    const subLabel = tag ? getSubcategoryLabel(slug, tag) : undefined;
    const titleBase = subLabel ?? meta.label;
    const path = tag
      ? `/fonts/${slug}?tag=${encodeURIComponent(tag)}`
      : `/fonts/${slug}`;
    const items = getCategoryFonts(slug, tag);
    const count = items.length;
    return buildPageMetadata({
      title: `${titleBase} — Free ${meta.shortLabel} Fonts`,
      description: subLabel
        ? `${subLabel} — ${meta.subtitle} Preview, compare, and download ${count} free ${meta.shortLabel.toLowerCase()} fonts. Install TTF/OTF on iPhone with iFont or use our font preview tool.`
        : `${meta.subtitle} Browse ${count}+ free ${meta.shortLabel.toLowerCase()} fonts — font preview, font collections, Install TTF/OTF, and custom fonts for iPhone and iPad.`,
      path,
      canonicalPath: `/fonts/${slug}`,
      index: !tag,
      keywords: getCategoryMetaKeywords(
        slug,
        [meta.label, meta.shortLabel, subLabel ?? ""].filter(Boolean),
      ),
    });
  }

  const card = getCardBySlug(slug);
  if (!card) return buildNotFoundMetadata();

  const catalogFont = getCategoryFontBySlug(slug);
  const categoryLabel = catalogFont
    ? CATEGORY_META[catalogFont.category].shortLabel
    : null;
  const displayName = fontFamilyLabel(card);

  return buildPageMetadata({
    title: `${displayName} Font — Preview, Download TTF/OTF`,
    description: `Preview and download ${displayName} from Google Fonts. Install TTF or OTF on iPhone with iFont, use the font generator, compare similar ${categoryLabel ? `${categoryLabel.toLowerCase()} ` : ""}fonts, and copy CSS on Installfont.`,
    path: `/fonts/${slug}`,
    keywords: getFontDetailMetaKeywords({
      displayName,
      label: card.label,
      previewText: card.previewText,
      categorySlug: catalogFont?.category ?? null,
    }),
  });
}

export default async function FontDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: SearchParams;
}) {
  const { slug } = await params;

  if (isCategorySlug(slug)) {
    const sp = searchParams ? await searchParams : undefined;
    const meta = CATEGORY_META[slug];
    const tag = parseTag(sp);
    const subLabel = tag ? getSubcategoryLabel(slug, tag) : undefined;
    const items = getCategoryFonts(slug, tag);
    const pageTitle = subLabel ?? meta.label;
    return (
      <>
        <JsonLd
          data={buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: meta.label, path: `/fonts/${slug}` },
            ...(subLabel ? [{ name: subLabel, path: `/fonts/${slug}` }] : []),
          ])}
        />
        {!tag ? (
          <JsonLd
            data={buildCollectionPageJsonLd({
              name: pageTitle,
              description: meta.blurb,
              path: `/fonts/${slug}`,
              numberOfItems: items.length,
            })}
          />
        ) : null}
        <FontCategoryPage category={slug} tag={tag} />
      </>
    );
  }

  const card = getCardBySlug(slug);
  if (!card) notFound();

  const catalogFont = getCategoryFontBySlug(slug);
  const similar = getSimilarCards(slug, 8);
  const categorySlug = catalogFont?.category;
  const categoryMeta = categorySlug ? CATEGORY_META[categorySlug] : null;
  const displayName = fontFamilyLabel(card);
  const pageTitle = `${displayName} Font`;
  const pageDescription = `Preview and download ${displayName} from Google Fonts on Installfont.`;

  return (
    <main className="flex flex-1 flex-col">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          ...(categoryMeta && categorySlug
            ? [{ name: categoryMeta.label, path: `/fonts/${categorySlug}` }]
            : []),
          { name: pageTitle, path: `/fonts/${slug}` },
        ])}
      />
      <JsonLd
        data={buildWebPageJsonLd({
          name: pageTitle,
          description: pageDescription,
          path: `/fonts/${slug}`,
        })}
      />
      {catalogFont ? (
        <CategoryTopicSection
          category={catalogFont.category}
          fontSlug={slug}
        />
      ) : null}
      <FontDetailHero card={card} />
      <FontDetailEditor card={card} />
      <FontShowcaseSection
        sectionId={`similar-${card.slug}`}
        title="Similar Fonts"
        subtitle="You may also like these :)"
        items={similar}
        pageSize={4}
        viewMoreBottom
      />
    </main>
  );
}

import {
  CATEGORY_META,
  getCategoryFonts,
  type FontCategorySlug,
} from "@/data/font-categories";
import { getSubcategoryLabel } from "@/data/category-subcategories";
import { CategoryTopicSection } from "@/components/CategoryTopicSection";
import { CategoryFontCrawlNav } from "@/components/CategoryFontCrawlNav";
import { CategoryFontSection } from "@/components/CategoryFontSection";

type Props = {
  category: FontCategorySlug;
  tag?: string | null;
};

export function FontCategoryPage({ category, tag }: Props) {
  const meta = CATEGORY_META[category];
  const subLabel = tag ? getSubcategoryLabel(category, tag) : undefined;
  const allItems = getCategoryFonts(category, tag);
  const total = allItems.length;
  const sectionId = tag
    ? `category-${category}-${tag}`
    : `category-${category}`;

  return (
    <main className="flex flex-1 flex-col">
      <CategoryTopicSection category={category} activeTag={tag} />

      <section className="category-page-hero page-px relative pb-6 pt-5 sm:pt-6">
        <div className="page-container">
          <div className="flex flex-col items-start gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--header-border)] bg-[var(--header-surface)] px-2.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.22em] text-[var(--hero-muted)] backdrop-blur-md sm:text-[10px]">
              <span
                className="size-1 rounded-full"
                style={{ background: `var(--${meta.accent})` }}
              />
              {total} typefaces · Google Fonts
            </span>
            <h1 className="text-2xl font-semibold tracking-[-0.025em] text-[var(--foreground)] sm:text-3xl md:text-4xl lg:text-[2.6rem]">
              {subLabel ?? meta.label}
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-[var(--hero-muted)] sm:text-base">
              {meta.blurb}
            </p>
          </div>
        </div>
      </section>

      <section
        className="content-section page-px relative pb-20 pt-4 md:pb-24"
        aria-label={`${meta.label} grid`}
      >
        <div className="page-container">
          <CategoryFontCrawlNav
            items={allItems}
            label={`All ${meta.label} typefaces`}
          />
          <CategoryFontSection
            items={allItems}
            sectionId={sectionId}
            showSort
          />
        </div>
      </section>
    </main>
  );
}

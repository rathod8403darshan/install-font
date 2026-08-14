import { CategoryChipNav } from "@/components/CategoryChipNav";
import { getFontSubcategorySlug } from "@/data/category-subcategories";
import type { FontCategorySlug } from "@/data/font-categories";

type Props = {
  category: FontCategorySlug;
  activeTag?: string | null;
  /** When set, highlights the topic bucket for this catalog font. */
  fontSlug?: string;
};

export function CategoryTopicSection({ category, activeTag, fontSlug }: Props) {
  const resolvedTag =
    activeTag ??
    (fontSlug ? getFontSubcategorySlug(fontSlug, category) : null);

  return (
    <section
      aria-label="Font topics"
      className="category-topic-section border-b border-[color:var(--category-bar-border)] bg-[var(--category-bar-bg)] py-4"
    >
      <CategoryChipNav category={category} activeTag={resolvedTag} />
    </section>
  );
}

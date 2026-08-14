import Link from "next/link";
import {
  buildCategoryBrowseHref,
  getSubcategories,
} from "@/data/category-subcategories";
import type { FontCategorySlug } from "@/data/font-categories";

type Props = {
  category: FontCategorySlug;
  activeTag: string | null;
};

function chipClass(active: boolean) {
  return `category-chip inline-flex shrink-0 snap-start rounded-full border px-3 py-1.5 text-center text-[11.5px] font-medium leading-snug tracking-tight transition-colors duration-200 sm:px-3.5 sm:py-2 sm:text-[12.5px] md:text-[13px] ${
    active
      ? "border-[color:var(--chip-active-border)] bg-[var(--chip-active-bg)] text-[var(--foreground)]"
      : "border-[color:var(--header-border)] bg-[var(--chip-bg)] text-[var(--foreground)]/88 hover:border-[color:var(--header-border)] hover:bg-[var(--header-hover)] hover:text-[var(--foreground)]"
  }`;
}

function ChipLink({
  href,
  active,
  shortText,
  fullText,
}: {
  href: string;
  active: boolean;
  shortText: string;
  fullText: string;
}) {
  return (
    <Link
      href={href}
      className={chipClass(active)}
      data-active={active ? "true" : "false"}
      aria-current={active ? "true" : undefined}
    >
      <span className="md:hidden">{shortText}</span>
      <span className="hidden md:inline">{fullText}</span>
    </Link>
  );
}

export function CategoryChipNav({ category, activeTag }: Props) {
  const subs = getSubcategories(category);

  return (
    <div className="page-px">
      <div className=" page-container">
        <nav
          aria-label="Font topics"
          className="category-chip-scroll flex flex-nowrap items-center gap-2 overflow-x-auto overscroll-x-contain pb-0.5 md:flex-wrap md:justify-center md:gap-2.5 md:overflow-visible md:pb-0"
        >
          <ChipLink
            href={buildCategoryBrowseHref(category)}
            active={!activeTag}
            shortText="All"
            fullText="All"
          />
          {subs.map((sub) => (
            <ChipLink
              key={sub.slug}
              href={buildCategoryBrowseHref(category, { tag: sub.slug })}
              active={activeTag === sub.slug}
              shortText={sub.shortLabel}
              fullText={sub.label}
            />
          ))}
        </nav>
      </div>
    </div>
  );
}

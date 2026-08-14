import Link from "next/link";
import type { CategoryFont } from "@/data/font-categories";

type Props = {
  items: CategoryFont[];
  label: string;
};

/** Screen-reader / crawler link list for full category catalogs. */
export function CategoryFontCrawlNav({ items, label }: Props) {
  return (
    <nav aria-label={label} className="sr-only">
      <ul>
        {items.map((item) => (
          <li key={item.slug}>
            <Link href={`/fonts/${item.slug}`}>{item.family}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

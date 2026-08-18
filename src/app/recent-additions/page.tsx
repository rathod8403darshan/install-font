import { RecentAdditionsPage } from "@/components/RecentAdditionsPage";
import { JsonLd } from "@/components/JsonLd";
import {
  buildBreadcrumbJsonLd,
  buildCollectionPageJsonLd,
} from "@/lib/json-ld";
import { buildPageMetadata } from "@/lib/seo";
import { recentAdditions } from "@/data/font-showcase";

export const metadata = buildPageMetadata({
  // Keep this a child page - do not compete with the homepage for brand queries.
  title: "Recent Font Additions",
  description:
    "Browse newly added movie, TV, album, and brand typefaces. Preview and download the latest Google Fonts every week.",
  path: "/recent-additions",
  keywords: [
    "recent additions",
    "new fonts",
    "latest fonts",
    "famous fonts",
    "font preview",
    "weekly fonts",
  ],
});

const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Home", path: "/" },
  { name: "Recent Additions", path: "/recent-additions" },
]);

const collectionJsonLd = buildCollectionPageJsonLd({
  name: "Recent Font Additions",
  description:
    "Latest font additions curated weekly from Google Fonts - a child listing of Install Fonts.",
  path: "/recent-additions",
  numberOfItems: recentAdditions.length,
});

export default function RecentAdditionsRoute() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={collectionJsonLd} />
      <RecentAdditionsPage />
    </>
  );
}

import {
  CONTACT_EMAIL,
  SITE_BRAND,
  SITE_DISPLAY_NAME,
  SITE_DOMAIN,
  SITE_URL,
  SOCIAL_SAME_AS,
  DEFAULT_OG_IMAGE_PATH,
} from "@/lib/site-config";

export type BreadcrumbItem = {
  name: string;
  path: string;
};

function absolutePath(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absolutePath(item.path),
    })),
  };
}

export function buildFaqPageJsonLd(
  items: ReadonlyArray<{ question: string; answer: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildWebSiteJsonLd(description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_DISPLAY_NAME,
    alternateName: [SITE_BRAND, SITE_DOMAIN, "installfont.com"],
    url: SITE_URL,
    description,
    inLanguage: "en-US",
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_DISPLAY_NAME,
      alternateName: [SITE_BRAND, SITE_DOMAIN],
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}${DEFAULT_OG_IMAGE_PATH}`,
      },
    },
  };
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_DISPLAY_NAME,
    alternateName: [SITE_BRAND, SITE_DOMAIN, "installfont.com"],
    url: SITE_URL,
    email: CONTACT_EMAIL,
    logo: `${SITE_URL}${DEFAULT_OG_IMAGE_PATH}`,
    sameAs: SOCIAL_SAME_AS,
  };
}

export function buildCollectionPageJsonLd(input: {
  name: string;
  description: string;
  path: string;
  numberOfItems: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: input.name,
    description: input.description,
    url: absolutePath(input.path),
    numberOfItems: input.numberOfItems,
    isPartOf: {
      "@id": `${SITE_URL}/#website`,
      "@type": "WebSite",
      name: SITE_DISPLAY_NAME,
      url: SITE_URL,
    },
  };
}

export function buildWebPageJsonLd(input: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: input.name,
    description: input.description,
    url: absolutePath(input.path),
    isPartOf: {
      "@type": "WebSite",
      name: SITE_DISPLAY_NAME,
      url: SITE_URL,
    },
  };
}

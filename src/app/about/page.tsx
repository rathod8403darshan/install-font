import Link from "next/link";
import { StaticPage } from "@/components/StaticPage";
import { CONTACT_EMAIL, SITE_DOMAIN, SITE_NAME } from "@/lib/site-config";
import { buildPageMetadata } from "@/lib/seo";
import { getAboutMetaKeywords } from "@/lib/seo-keywords";

export const metadata = buildPageMetadata({
  title: "About",
  description:
    "About Install fonts - a free font installer and catalog for custom TTF/OTF, Google Fonts, iPhone fonts, reading fonts, and designer typefaces. Works with the iFont app on iOS and Android.",
  path: "/about",
  keywords: getAboutMetaKeywords(),
});

export default function AboutPage() {
  return (
    <>
      <StaticPage
        title="About Installfont"
        description="We help designers, creators, and fans find the right typeface fast - with live previews, curated collections, and mobile install options."
      >
        <p>
          <strong>{SITE_NAME}</strong> ({SITE_DOMAIN}) is a font discovery platform
          built around Google Fonts. Browse curated lists for movies, music, games,
          logos, and books; open any family to preview sample text; copy CSS; download
          files; and use our live font generator to experiment with styles before you
          ship.
        </p>

        <h2 className="text-lg font-semibold text-[var(--foreground)]">
          What you can do here
        </h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Explore category pages with hundreds of free typefaces</li>
          <li>Preview fonts in context with real sample copy</li>
          <li>Download font files and copy ready-to-use CSS snippets</li>
          <li>Style text with presets in the built-in font generator</li>
          <li>Install our mobile apps for fonts on iOS and Android</li>
        </ul>

        <h2 className="text-lg font-semibold text-[var(--foreground)]">
          Our mission
        </h2>
        <p>
          Typography should be approachable. Whether you are matching a movie poster,
          sketching a logo, or picking a book cover face, Installfont surfaces the
          closest free alternatives from Google&apos;s library so you can move from idea
          to implementation in minutes.
        </p>

        <p>
          Questions or partnerships? Visit our{" "}
          <Link
            href="/contact"
            className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
          >
            contact page
          </Link>{" "}
          or read our{" "}
          <Link
            href="/privacy"
            className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
          >
            privacy policy
          </Link>{" "}
          and{" "}
          <Link
            href="/licensing"
            className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
          >
            licensing information
          </Link>
          .
        </p>
      </StaticPage>
    </>
  );
}

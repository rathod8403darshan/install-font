import Link from "next/link";
import { StaticPage } from "@/components/StaticPage";
import { CONTACT_EMAIL, SITE_DOMAIN, SITE_NAME } from "@/lib/site-config";
import { buildPageMetadata } from "@/lib/seo";
import { getLicensingMetaKeywords } from "@/lib/seo-keywords";

export const metadata = buildPageMetadata({
  title: "Licensing",
  description:
    "Font licensing on Install fonts - Google Fonts OFL, TTF/OTF usage, what you can download, and how Installfont and iFont content is protected.",
  path: "/licensing",
  keywords: getLicensingMetaKeywords(),
});

export default function LicensingPage() {
  return (
    <StaticPage
      title="Licensing"
      description={`Understand how fonts and content on ${SITE_DOMAIN} may be used, and what rights ${SITE_NAME} grants.`}
    >
      <h2 className="text-lg font-semibold text-[var(--foreground)]">
        Font files on Installfont
      </h2>
      <p>
        Typefaces listed on {SITE_NAME} are sourced from{" "}
        <a
          href="https://fonts.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
        >
          Google Fonts
        </a>{" "}
        unless otherwise noted. Each family is distributed under its own license
        (commonly the{" "}
        <a
          href="https://openfontlicense.org"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
        >
          SIL Open Font License
        </a>{" "}
        or another license shown on Google Fonts). You must comply with the license
        attached to the specific font you download or embed.
      </p>
      <p>
        {SITE_NAME} does not sell fonts or grant rights beyond what the original
        licensor provides. We are a discovery and preview tool - not a font foundry.
      </p>

      <h2 className="text-lg font-semibold text-[var(--foreground)]">
        What you may typically do
      </h2>
      <p>
        Under most open licenses on Google Fonts, you may use fonts in personal and
        commercial projects, including websites, apps, print, and logos, subject to
        license conditions (such as attribution or no misrepresentation of the font
        itself). Always verify the license on the font&apos;s Google Fonts page before
        shipping production work.
      </p>

      <h2 className="text-lg font-semibold text-[var(--foreground)]">
        What Installfont provides
      </h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>Previews, CSS snippets, and download links for convenience</li>
        <li>Curated collections and editorial labels (e.g. movie-inspired picks)</li>
        <li>Original site design, copy, logos, and software (mobile apps)</li>
      </ul>
      <p>
        Curated names referencing movies, brands, or characters are descriptive only.
        {SITE_NAME} is not affiliated with those rights holders unless explicitly
        stated.
      </p>

      <h2 className="text-lg font-semibold text-[var(--foreground)]">
        Installfont intellectual property
      </h2>
      <p>
        The {SITE_NAME} website, brand, generator UI, and app experiences are
        protected by copyright and other laws. You may not scrape, mirror, or resell
        our catalog or code without written permission.
      </p>

      <h2 className="text-lg font-semibold text-[var(--foreground)]">
        DMCA and takedowns
      </h2>
      <p>
        If you believe content on {SITE_DOMAIN} infringes your rights, email{" "}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
        >
          {CONTACT_EMAIL}
        </a>{" "}
        with details (URL, work identified, contact information). We will review and
        respond as appropriate.
      </p>

      <h2 className="text-lg font-semibold text-[var(--foreground)]">
        Related policies
      </h2>
      <p>
        See our{" "}
        <Link
          href="/privacy"
          className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
        >
          Privacy Policy
        </Link>{" "}
        and{" "}
        <Link
          href="/contact"
          className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
        >
          Contact
        </Link>{" "}
        pages for more information.
      </p>
    </StaticPage>
  );
}

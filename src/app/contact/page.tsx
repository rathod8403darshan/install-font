import Link from "next/link";
import { SocialLinks } from "@/components/SocialLinks";
import { StaticPage } from "@/components/StaticPage";
import {
  CONTACT_EMAIL,
  SITE_DOMAIN,
  SITE_URL,
} from "@/lib/site-config";
import { buildPageMetadata } from "@/lib/seo";
import { getContactMetaKeywords } from "@/lib/seo-keywords";

export const metadata = buildPageMetadata({
  title: "Contact",
  description:
    "Contact Install fonts and iFont support at nextgen1.creator@gmail.com. Questions about font install, TTF/OTF download, iPhone fonts, or the free iFont app.",
  path: "/contact",
  keywords: getContactMetaKeywords(),
});

export default function ContactPage() {
  return (
    <StaticPage
      title="Contact us"
      description="We read every message. Reach out by email or connect with us on social media."
    >
      <div className="rounded-2xl border border-[color:var(--header-border)] bg-[var(--header-surface)] p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">Email</h2>
        <p className="mt-2 text-[var(--hero-muted)]">
          For support, feedback, licensing questions, or press inquiries:
        </p>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="cta-action mt-4 inline-flex items-center justify-center rounded-full border border-[color:var(--accent)]/40 bg-[color:color-mix(in_oklab,var(--accent)_12%,transparent)] px-6 py-3 text-sm font-semibold text-[var(--foreground)] transition-[border-color,background-color,transform] hover:-translate-y-0.5 hover:border-[var(--accent)]/60 hover:bg-[color:color-mix(in_oklab,var(--accent)_18%,transparent)]"
        >
          {CONTACT_EMAIL}
        </a>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-[var(--foreground)]">Website</h2>
        <p className="mt-2">
          <a
            href={SITE_URL}
            className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
          >
            {SITE_DOMAIN}
          </a>
        </p>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-[var(--foreground)]">
          Social media
        </h2>
        <p className="mt-2 text-[var(--hero-muted)]">
          Follow our official channels for updates, new font picks, and product news.
        </p>
        <SocialLinks className="mt-4" />
      </div>

      <p className="text-[var(--hero-muted)]">
        Prefer self-service? Browse the{" "}
        <Link
          href="/fonts/movie"
          className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
        >
          font catalog
        </Link>{" "}
        or read the{" "}
        <Link
          href="/about"
          className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
        >
          about page
        </Link>{" "}
        to learn how Installfont works.
      </p>
    </StaticPage>
  );
}

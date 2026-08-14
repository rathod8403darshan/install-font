import Link from "next/link";
import { StaticPage } from "@/components/StaticPage";
import { CONTACT_EMAIL, SITE_DOMAIN, SITE_NAME } from "@/lib/site-config";
import { buildPageMetadata } from "@/lib/seo";
import { getPrivacyMetaKeywords } from "@/lib/seo-keywords";

export const metadata = buildPageMetadata({
  title: "Privacy Policy",
  description:
    "Install fonts privacy policy — how installfont.com and the iFont app handle data, cookies, Google Fonts previews, and your rights.",
  path: "/privacy",
  keywords: getPrivacyMetaKeywords(),
});

export default function PrivacyPage() {
  const effectiveDate = "May 15, 2026";

  return (
    <StaticPage
      title="Privacy Policy"
      description={`How ${SITE_NAME} (${SITE_DOMAIN}) collects, uses, and protects information when you use our website and services.`}
    >
      <p className="text-[var(--hero-muted)]">
        <strong>Effective date:</strong> {effectiveDate}
      </p>

      <h2 className="text-lg font-semibold text-[var(--foreground)]">
        Overview
      </h2>
      <p>
        {SITE_NAME} respects your privacy. This policy explains what information we
        may collect when you visit {SITE_DOMAIN}, how we use it, and the choices you
        have. By using our site, you agree to the practices described here.
      </p>

      <h2 className="text-lg font-semibold text-[var(--foreground)]">
        Information we collect
      </h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <strong>Usage data:</strong> Standard server and analytics logs (pages
          viewed, browser type, approximate region, referral URL) to improve
          performance and content.
        </li>
        <li>
          <strong>Contact information:</strong> If you email us, we receive your
          address, message content, and any details you choose to provide.
        </li>
        <li>
          <strong>Local storage:</strong> Theme or UI preferences may be stored in
          your browser to improve your experience.
        </li>
      </ul>
      <p>
        We do not knowingly collect sensitive personal data through the website
        unless you send it to us voluntarily.
      </p>

      <h2 className="text-lg font-semibold text-[var(--foreground)]">
        How we use information
      </h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>Operate, maintain, and improve {SITE_DOMAIN}</li>
        <li>Respond to support and contact requests</li>
        <li>Understand aggregate traffic and feature usage</li>
        <li>Protect against abuse, fraud, and security incidents</li>
      </ul>

      <h2 className="text-lg font-semibold text-[var(--foreground)]">
        Third-party services
      </h2>
      <p>
        Font previews and downloads are served using{" "}
        <a
          href="https://fonts.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
        >
          Google Fonts
        </a>
        . When you load a font preview, your browser may request assets from
        Google&apos;s servers subject to{" "}
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
        >
          Google&apos;s Privacy Policy
        </a>
        . App store links direct you to Apple or Google under their respective
        policies.
      </p>

      <h2 className="text-lg font-semibold text-[var(--foreground)]">
        Cookies
      </h2>
      <p>
        We may use essential cookies and similar technologies for site functionality.
        Analytics cookies, if enabled, help us measure traffic in aggregate. You can
        control cookies through your browser settings; disabling them may affect
        some features.
      </p>

      <h2 className="text-lg font-semibold text-[var(--foreground)]">
        Data retention
      </h2>
      <p>
        We retain information only as long as needed for the purposes above or as
        required by law. Contact emails are kept for a reasonable period to handle
        inquiries and follow-ups.
      </p>

      <h2 className="text-lg font-semibold text-[var(--foreground)]">
        Your rights
      </h2>
      <p>
        Depending on your location, you may have rights to access, correct, delete, or
        restrict processing of personal data we hold about you. To exercise these
        rights, contact us at{" "}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
        >
          {CONTACT_EMAIL}
        </a>
        .
      </p>

      <h2 className="text-lg font-semibold text-[var(--foreground)]">
        Children
      </h2>
      <p>
        {SITE_NAME} is not directed at children under 13. We do not knowingly collect
        personal information from children. If you believe a child has provided us
        data, please contact us so we can delete it.
      </p>

      <h2 className="text-lg font-semibold text-[var(--foreground)]">
        Changes
      </h2>
      <p>
        We may update this policy from time to time. The effective date at the top
        will reflect the latest version. Continued use of the site after changes
        constitutes acceptance.
      </p>

      <h2 className="text-lg font-semibold text-[var(--foreground)]">Contact</h2>
      <p>
        Privacy questions:{" "}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
        >
          {CONTACT_EMAIL}
        </a>{" "}
        ·{" "}
        <Link
          href="/contact"
          className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
        >
          Contact page
        </Link>
      </p>
    </StaticPage>
  );
}

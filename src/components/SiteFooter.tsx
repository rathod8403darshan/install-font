"use client";

import Link from "next/link";
import { type ReactNode } from "react";
import { SocialLinks } from "@/components/SocialLinks";
import { buildCategoryBrowseHref } from "@/data/category-subcategories";

const popularFonts = [
  { label: "Harry Potter Font", href: "/fonts/harry-potter-tv-series-font" },
  { label: "Fortnite Font", href: "/fonts/game" },
  { label: "Disney Font", href: "/fonts/movie" },
  { label: "Mario Font", href: "/fonts/game" },
  { label: "Marvel Fonts", href: buildCategoryBrowseHref("movie", { tag: "blockbuster" }) },
];

const trendingTags = [
  {
    label: "Marvel Fonts",
    href: buildCategoryBrowseHref("movie", { tag: "blockbuster" }),
  },
  {
    label: "Minecraft Font",
    href: buildCategoryBrowseHref("game", { tag: "simulation" }),
  },
  {
    label: "Horror Fonts",
    href: buildCategoryBrowseHref("movie", { tag: "horror-thriller" }),
  },
  {
    label: "Logo Fonts",
    href: "/fonts/logo",
  },
  {
    label: "Calligraphy Fonts",
    href: buildCategoryBrowseHref("music", { tag: "script-handwriting" }),
  },
  {
    label: "Graffiti Fonts",
    href: buildCategoryBrowseHref("music", { tag: "graffiti-street" }),
  },
  {
    label: "Tattoo Fonts",
    href: buildCategoryBrowseHref("music", { tag: "script-handwriting" }),
  },
  {
    label: "Book Cover Fonts",
    href: buildCategoryBrowseHref("book", { tag: "literary" }),
  },
];

const otherLinks = [
  { label: "Liked Fonts", href: "/liked" },
  { label: "Recent Additions", href: "/recent-additions" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
  { label: "Licensing", href: "/licensing" },
];

function FooterColumn({
  title,
  children,
  className = "",
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex min-w-0 flex-col ${className}`.trim()}>
      <h3 className="border-b border-[color:var(--header-border)]/70 pb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--foreground)]">
        {title}
      </h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function FooterNavList({
  items,
}: {
  items: { label: string; href: string }[];
}) {
  return (
    <ul className="flex flex-col gap-2.5">
      {items.map(({ label, href }) => (
        <li key={label}>
          <Link
            href={href}
            className="text-[13px] leading-snug text-[var(--hero-muted)] transition-colors hover:text-[var(--foreground)]"
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function FooterTag({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center rounded-lg border border-[color:var(--header-border)] bg-[var(--header-surface)]/90 px-2.5 py-1.5 text-[12px] font-medium leading-none text-[var(--foreground)]/80 transition-[border-color,background-color,color] hover:border-[var(--brand-blue)]/35 hover:bg-[var(--header-hover)] hover:text-[var(--foreground)]"
    >
      {label}
    </Link>
  );
}

export function SiteFooter() {
  return (
    <footer className="page-px relative mt-auto overflow-x-hidden border-t border-[color:var(--header-border)] pb-6 pt-10 md:pb-8 md:pt-12">
      <div className="theme-accent-line pointer-events-none absolute inset-x-0 top-0 h-px" />

      <div className="mx-auto flex w-full flex-col">
        <div className="grid grid-cols-2 items-start gap-x-6 gap-y-8 sm:gap-x-8 lg:grid-cols-3 lg:gap-x-10">
          <FooterColumn title="Popular Fonts">
            <FooterNavList items={popularFonts} />
          </FooterColumn>

          <FooterColumn
            title="Trending"
            className="order-3 col-span-2 lg:order-2 lg:col-span-1"
          >
            <div className="flex flex-wrap gap-2">
              {trendingTags.map((tag) => (
                <FooterTag key={tag.label} label={tag.label} href={tag.href} />
              ))}
            </div>
          </FooterColumn>

          <FooterColumn title="Other Links" className="order-2 lg:order-3">
            <FooterNavList items={otherLinks} />
          </FooterColumn>
        </div>

        <div className="mt-8 flex flex-col items-center gap-3 border-t border-[color:var(--header-border)]/80 pt-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--foreground)]">
            Follow us
          </p>
          <SocialLinks
            className="w-full justify-center gap-2"
            linkClassName="px-3 py-1.5 text-[12px]"
          />
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-[color:var(--header-border)]/60 pt-5 text-[11px] leading-none text-[var(--header-muted)] sm:flex-row sm:items-center">
          <p className="text-center leading-none sm:text-left">
            © {new Date().getFullYear()} Installfont ·{" "}
            <span className="text-[var(--foreground)]/75">installfont.com</span>
          </p>
          <p className="inline-flex items-center gap-2 leading-none">
            <span className="size-1.5 shrink-0 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
            Fonts via Google Fonts
          </p>
        </div>
      </div>
    </footer>
  );
}

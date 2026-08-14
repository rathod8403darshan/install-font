import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AmbientBackground } from "@/components/AmbientBackground";
import { JsonLd } from "@/components/JsonLd";
import { buildOrganizationJsonLd } from "@/lib/json-ld";
import { buildDefaultMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import "./globals.css";

const organizationJsonLd = buildOrganizationJsonLd();

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  ...buildDefaultMetadata(),
  manifest: "/favicon/site.webmanifest",
  icons: {
    icon: [{ url: "/favicon/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/favicon/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="relative flex min-h-full flex-col overflow-x-hidden font-sans text-[var(--foreground)]">
        <JsonLd data={organizationJsonLd} />
        <AmbientBackground />
        <div className="relative z-10 mx-auto flex min-h-0 w-full min-w-0 max-w-[var(--site-max-width)] flex-1 flex-col">
          <SiteHeader />
          <div className="site-main-column flex min-h-0 flex-1 flex-col">
            {children}
          </div>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}

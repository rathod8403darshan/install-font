import { HeroSection } from "@/components/HeroSection";
import { FontMarquee } from "@/components/FontMarquee";
import { HomeMarketingSections } from "@/components/HomeMarketingSections";
import { JsonLd } from "@/components/JsonLd";
import { HOME_FAQ } from "@/data/home-marketing";
import { buildFaqPageJsonLd, buildWebSiteJsonLd } from "@/lib/json-ld";
import { buildPageMetadata } from "@/lib/seo";
import {
  getHomeMetaKeywords,
  HOME_META_DESCRIPTION,
} from "@/lib/seo-keywords";

export const metadata = buildPageMetadata({
  title: "Install Fonts for iPhone & iPad | Font Installer App",
  description: HOME_META_DESCRIPTION,
  path: "/",
  keywords: getHomeMetaKeywords(),
  absoluteTitle: true,
});

const homeWebsiteJsonLd = buildWebSiteJsonLd(HOME_META_DESCRIPTION);
const homeFaqJsonLd = buildFaqPageJsonLd(HOME_FAQ);

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <JsonLd data={homeWebsiteJsonLd} />
      <JsonLd data={homeFaqJsonLd} />
      <HeroSection />
      <FontMarquee />
      <HomeMarketingSections />
    </main>
  );
}

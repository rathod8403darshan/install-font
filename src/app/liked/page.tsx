import { LikedFontsPage } from "@/components/LikedFontsPage";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Liked Fonts — Saved on This Device",
  description:
    "Fonts you liked on Install fonts. Preview and download your saved typefaces anytime — stored locally in your browser.",
  path: "/liked",
  keywords: ["liked fonts", "saved fonts", "favorite fonts", "heart fonts"],
});

export default function LikedRoute() {
  return <LikedFontsPage />;
}

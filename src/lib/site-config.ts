/** Brand name (app store, legal copy). */
export const SITE_BRAND = "Installfont";
/** Preferred name in Google Search site-name line and Open Graph. */
export const SITE_DISPLAY_NAME = "Install Fonts";
/** @deprecated Use SITE_BRAND or SITE_DISPLAY_NAME */
export const SITE_NAME = SITE_BRAND;
export const SITE_DOMAIN = "installfont.com";
export const SITE_URL = `https://${SITE_DOMAIN}`;
export const CONTACT_EMAIL = "nextgen1.creator@gmail.com";

/** Default social preview image (absolute path on site). */
export const DEFAULT_OG_IMAGE_PATH = "/favicon/web-app-manifest-512x512.png";
export const DEFAULT_OG_IMAGE_WIDTH = 512;
export const DEFAULT_OG_IMAGE_HEIGHT = 512;

/** @see {@link GLOBAL_META_KEYWORDS} in `@/lib/seo-keywords` for full keyword sets. */
export { GLOBAL_META_KEYWORDS as DEFAULT_KEYWORDS } from "@/lib/seo-keywords";

export type SocialLink = {
  id: string;
  label: string;
  href: string;
};

export const SOCIAL_LINKS: SocialLink[] = [
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/iemojis25/",
  },
  {
    id: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/iOSEmojisForStory/",
  },
  {
    id: "youtube",
    label: "YouTube",
    href: "https://www.youtube.com/@iemojis",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/janhvi-mehta-8359b5407/",
  },
  {
    id: "x",
    label: "X",
    href: "https://x.com/iemojis25",
  },
  {
    id: "pinterest",
    label: "Pinterest",
    href: "https://www.pinterest.com/iemojis25/",
  },
  {
    id: "tumblr",
    label: "Tumblr",
    href: "https://www.tumblr.com/iemojis",
  },
];

export const SOCIAL_SAME_AS = SOCIAL_LINKS.map((link) => link.href);

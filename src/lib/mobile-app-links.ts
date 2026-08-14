/** Installfont / iFont mobile apps */
export const GOOGLE_PLAY_INSTALLFONT_URL =
  "https://play.google.com/store/apps/details?id=com.logicworklab.fonts.installfont.changefont.fonttool&hl=en_IN";

export const APP_STORE_IFONT_URL =
  "https://apps.apple.com/ge/app/ifont-fonts-install-any-font/id6748604160";

export type MobilePlatform = "ios" | "android" | "other";

export function detectMobilePlatform(
  userAgent: string = typeof navigator !== "undefined" ? navigator.userAgent : "",
): MobilePlatform {
  if (/Android/i.test(userAgent)) return "android";
  if (/iPhone|iPad|iPod/i.test(userAgent)) return "ios";
  return "other";
}

/** App Store on iOS, Google Play on Android; desktop defaults to Google Play. */
export function getMobileAppStoreUrl(
  userAgent?: string,
): string {
  const platform = detectMobilePlatform(userAgent);
  if (platform === "ios") return APP_STORE_IFONT_URL;
  return GOOGLE_PLAY_INSTALLFONT_URL;
}

export function redirectToMobileAppStore(): void {
  const url = getMobileAppStoreUrl();
  const platform = detectMobilePlatform();

  if (platform === "ios" || platform === "android") {
    window.location.assign(url);
    return;
  }

  window.open(url, "_blank", "noopener,noreferrer");
}

/** Longest-first so "Custom Font for iPhone" wins over "iPhone". */
const ACCENT_PHRASES = [
  "Safari Reading Experience",
  "Custom Font for iPhone",
  "Fonts for iPhone and iPad",
  "iPhone & iPad Fonts",
  "Fonts for iPhone",
  "iPhone and iPad",
  "iPhone & iPad",
  "Font Management",
  "Font Suggestions",
  "Recent Additions",
  "Reading Experience",
  "Fonts Library",
  "Liked Fonts",
  "From an Image",
  "From Anywhere",
  "Install Fonts",
  "Install Font",
  "App Store",
  "Google Fonts",
  "Font Finder",
  "iPad Fonts",
  "Generator",
  "Safari",
  "iPhone",
  "iPad",
] as const;

export function AccentTitle({ text }: { text: string }) {
  for (const phrase of ACCENT_PHRASES) {
    const at = text.indexOf(phrase);
    if (at === -1) continue;
    return (
      <>
        {text.slice(0, at)}
        <span className="font-shimmer">{phrase}</span>
        {text.slice(at + phrase.length)}
      </>
    );
  }

  if (text.endsWith(" Fonts")) {
    return (
      <>
        {text.slice(0, -6)}
        <span className="font-shimmer">Fonts</span>
      </>
    );
  }

  return text;
}

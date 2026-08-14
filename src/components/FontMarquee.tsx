import {
  PREVIEW_FONT_META,
  type PreviewFontKey,
} from "@/fonts/preview-fonts";

/** Fewer families = less font download + layout work on the home page. */
const MARQUEE: { text: string; key: PreviewFontKey }[] = [
  { text: "Famous", key: "bebas" },
  { text: "Editorial", key: "cinzel" },
  { text: "Display", key: "pacifico" },
  { text: "Script", key: "lobster" },
  { text: "Pixel", key: "bungee" },
  { text: "Neon", key: "monoton" },
];

export function FontMarquee() {
  return (
    <div className="full-bleed relative overflow-hidden border-y border-[color:var(--header-border)] bg-[var(--header-surface)] py-6">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[var(--background)] to-transparent sm:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[var(--background)] to-transparent sm:w-24" />
      <div className="marquee-track flex w-max items-center gap-12">
        {[...MARQUEE, ...MARQUEE].map((item, i) => {
          const meta = PREVIEW_FONT_META[item.key];
          return (
            <div key={i} className="flex items-center gap-12">
              <span
                className={`text-2xl text-[var(--foreground)]/90 sm:text-3xl md:text-4xl lg:text-5xl ${meta.className}`}
              >
                {item.text}
              </span>
              <span className="size-1.5 rounded-full bg-[var(--accent)]/70" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

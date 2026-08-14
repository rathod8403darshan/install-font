import { googleQueryToFilename } from "@/lib/google-font-download";

export async function downloadGoogleFontTtf(
  googleQuery: string,
  displayName?: string,
): Promise<void> {
  const params = new URLSearchParams({ q: googleQuery });
  const res = await fetch(`/api/fonts/download?${params.toString()}`);

  if (!res.ok) {
    throw new Error("Could not download font file");
  }

  const blob = await res.blob();
  const baseName = displayName
    ? displayName
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
    : googleQueryToFilename(googleQuery).replace(/\.ttf$/i, "");
  const filename = `${baseName || "font"}.ttf`;

  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(objectUrl);
}

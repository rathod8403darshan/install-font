/** Map css2 `Family:wght@400` segments to the v1 CSS API, which returns TTF URLs. */
export function googleQueryToV1FamilyParam(googleQuery: string): string {
  const colonIdx = googleQuery.indexOf(":");
  if (colonIdx === -1) return googleQuery;

  const familyPart = googleQuery.slice(0, colonIdx);
  const axisPart = googleQuery.slice(colonIdx + 1);

  if (axisPart.startsWith("wght@")) {
    const firstWeight = axisPart.slice(5).split(";")[0];
    if (firstWeight) return `${familyPart}:${firstWeight}`;
  }

  return familyPart;
}

export function googleQueryToFilename(googleQuery: string): string {
  const family = googleQuery.split(":")[0]!.replace(/\+/g, " ").trim();
  const safe = family
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
  return `${safe || "font"}.ttf`;
}

export async function resolveGoogleFontTtfUrl(
  googleQuery: string,
): Promise<{ fileUrl: string; filename: string }> {
  const v1Family = googleQueryToV1FamilyParam(googleQuery);
  const cssUrl = `https://fonts.googleapis.com/css?family=${v1Family}`;
  const cssRes = await fetch(cssUrl, { next: { revalidate: 86_400 } });

  if (!cssRes.ok) {
    throw new Error(`Google Fonts CSS request failed (${cssRes.status})`);
  }

  const css = await cssRes.text();
  const match = css.match(
    /url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.ttf)\)/i,
  );

  if (!match?.[1]) {
    throw new Error("No TTF file found for this font family");
  }

  return {
    fileUrl: match[1],
    filename: googleQueryToFilename(googleQuery),
  };
}

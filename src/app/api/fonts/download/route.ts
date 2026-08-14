import { NextResponse } from "next/server";
import { resolveGoogleFontTtfUrl } from "@/lib/google-font-download";

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q")?.trim();
  if (!q || q.length > 200) {
    return NextResponse.json({ error: "Invalid font query" }, { status: 400 });
  }

  if (!/^[\w+\-.,@;:()%]+$/.test(q)) {
    return NextResponse.json({ error: "Invalid font query" }, { status: 400 });
  }

  try {
    const { fileUrl, filename } = await resolveGoogleFontTtfUrl(q);
    const fontRes = await fetch(fileUrl, { next: { revalidate: 86_400 } });

    if (!fontRes.ok) {
      return NextResponse.json(
        { error: "Font file unavailable" },
        { status: 502 },
      );
    }

    const bytes = await fontRes.arrayBuffer();
    return new NextResponse(bytes, {
      status: 200,
      headers: {
        "Content-Type": "font/ttf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch {
    return NextResponse.json({ error: "Download failed" }, { status: 502 });
  }
}

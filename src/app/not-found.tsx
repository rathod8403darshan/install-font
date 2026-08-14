import Link from "next/link";
import { buildNotFoundMetadata } from "@/lib/seo";

export const metadata = buildNotFoundMetadata();

export default function NotFound() {
  return (
    <main className="page-px flex flex-1 flex-col items-center justify-center py-24 text-center">
      <div className="page-container max-w-md">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--hero-muted)]">
          404
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
          Page not found
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--hero-muted)]">
          This font or page does not exist. Browse categories or search from the
          home page.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-zinc-950 transition-[filter] hover:brightness-110"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}

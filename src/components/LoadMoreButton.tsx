"use client";

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M12 5v14" />
      <path d="m7 14 5 5 5-5" />
    </svg>
  );
}

type Props = {
  onClick: () => void;
  disabled?: boolean;
  remaining?: number;
  className?: string;
};

export function LoadMoreButton({
  onClick,
  disabled,
  remaining,
  className = "",
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`cta-action group/btn relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-[color:var(--header-border)] bg-[var(--header-surface)] px-6 py-3 text-sm font-medium text-[var(--foreground)] backdrop-blur-md transition-[transform,border-color,background-color,box-shadow,opacity] duration-300 hover:-translate-y-0.5 hover:border-[var(--accent)]/40 hover:bg-[var(--header-hover)] hover:shadow-[0_18px_40px_-22px_color-mix(in_oklab,var(--accent)_55%,transparent)] disabled:pointer-events-none disabled:opacity-50 ${className}`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-out group-hover/btn:translate-x-full group-disabled/btn:opacity-0"
      />
      <span className="relative">Load more</span>
      {typeof remaining === "number" && remaining > 0 ? (
        <span className="relative text-[12px] font-normal text-[var(--hero-muted)]">
          ({remaining} left)
        </span>
      ) : null}
      <ArrowIcon className="relative size-4 transition-transform duration-300 group-hover/btn:translate-y-0.5 group-disabled/btn:translate-y-0" />
    </button>
  );
}

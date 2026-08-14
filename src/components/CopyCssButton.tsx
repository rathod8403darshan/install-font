"use client";

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

type Props = {
  copied: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  visibilityClass?: string;
};

export function CopyCssButton({
  copied,
  onClick,
  visibilityClass = "opacity-0 transition-[opacity,transform,background-color] duration-200 group-hover/card:translate-y-0 group-hover/card:opacity-100",
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={copied ? "CSS copied" : "Copy CSS"}
      title={copied ? "Copied" : "Copy CSS"}
      className={`flex size-8 shrink-0 translate-y-[-4px] items-center justify-center rounded-md border border-[color:var(--card-border)] bg-[var(--chip-bg)] text-[var(--foreground)] hover:bg-[var(--header-hover)] sm:h-auto sm:min-h-0 sm:gap-1.5 sm:px-2 sm:py-1 sm:text-[10px] sm:font-semibold sm:uppercase sm:tracking-wider ${visibilityClass}`}
    >
      {copied ? (
        <>
          <CheckIcon className="size-4 sm:hidden" />
          <span className="hidden sm:inline">Copied ✓</span>
        </>
      ) : (
        <>
          <CopyIcon className="size-4 sm:hidden" />
          <span className="hidden sm:inline">Copy CSS</span>
        </>
      )}
    </button>
  );
}

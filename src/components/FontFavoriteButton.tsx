"use client";

import { useLikedFonts } from "@/hooks/use-liked-fonts";

export function HeartIcon({
  filled,
  className,
}: {
  filled?: boolean;
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

const sizeClasses = {
  sm: "size-8",
  md: "size-10",
} as const;

const iconSizeClasses = {
  sm: "size-[15px]",
  md: "size-[18px]",
} as const;

type Props = {
  likedId: string;
  /** Accessible label when not liked */
  label?: string;
  size?: keyof typeof sizeClasses;
  className?: string;
  /** Always visible vs fade in on card hover */
  variant?: "toolbar" | "card" | "liked";
};

export function FontFavoriteButton({
  likedId,
  label = "Like this font",
  size = "sm",
  className = "",
  variant = "card",
}: Props) {
  const { isLiked, toggle } = useLikedFonts();
  const liked = isLiked(likedId);

  const variantClass =
    variant === "card"
      ? "pointer-events-auto translate-y-[-4px] opacity-0 transition-[opacity,transform,background-color] duration-200 group-hover/card:translate-y-0 group-hover/card:opacity-100"
      : variant === "liked"
        ? "pointer-events-auto opacity-100"
        : "";

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        toggle(likedId);
      }}
      className={`flex shrink-0 items-center justify-center rounded-full border border-[color:var(--header-border)] bg-[var(--chip-bg)] text-[var(--foreground)] transition-[border-color,background-color,transform,color] duration-200 hover:bg-[var(--header-hover)] active:scale-95 ${sizeClasses[size]} ${variantClass} ${
        liked
          ? variant === "liked"
            ? "border-[color:var(--header-border)] bg-[var(--chip-bg)] text-[var(--foreground)]"
            : "border-[color:color-mix(in_oklab,var(--accent)_40%,var(--header-border))] text-[var(--accent)] opacity-100"
          : ""
      } ${className}`.trim()}
      aria-label={liked ? "Unlike this font" : label}
      aria-pressed={liked}
      title={liked ? "Unlike" : "Like"}
    >
      <HeartIcon filled={liked} className={iconSizeClasses[size]} />
    </button>
  );
}

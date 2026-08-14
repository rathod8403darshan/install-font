/** Official store marks from `/public/app-store.png` and `/public/playstore.png`. */

export const APP_STORE_ICON_SRC = "/app-store.png";
export const PLAYSTORE_ICON_SRC = "/playstore.png";

type StoreMarkProps = {
  className?: string;
  /** Subtle muted treatment for compact header icon buttons */
  monochrome?: boolean;
};

export function GooglePlayMark({ className, monochrome }: StoreMarkProps) {
  return (
    <img
      src={PLAYSTORE_ICON_SRC}
      alt=""
      width={24}
      height={24}
      decoding="async"
      aria-hidden
      className={`object-contain ${monochrome ? "opacity-90 grayscale" : ""} ${className ?? "size-6"}`}
    />
  );
}

export function AppleMark({ className }: StoreMarkProps) {
  return (
    <img
      src={APP_STORE_ICON_SRC}
      alt=""
      width={24}
      height={24}
      decoding="async"
      aria-hidden
      className={`object-contain ${className ?? "size-6"}`}
    />
  );
}

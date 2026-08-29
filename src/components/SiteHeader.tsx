"use client";

import {
  startTransition,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  APP_STORE_IFONT_URL,
  GOOGLE_PLAY_INSTALLFONT_URL,
} from "@/lib/mobile-app-links";
import { AppleMark, GooglePlayMark } from "@/components/MobileAppStoreIcons";
import { onScrollThrottled } from "@/lib/motion";
import { HeaderSearchDialog } from "@/components/HeaderSearchDialog";
import { subscribeSiteHeaderMetrics } from "@/lib/site-header-metrics";
import { useLikedFonts } from "@/hooks/use-liked-fonts";
import { CATEGORY_META, type FontCategorySlug } from "@/data/font-categories";

const THEME_KEY = "installfont-theme";

function FilmIcon({ className }: { className?: string }) {
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
      <rect x="3" y="5" width="18" height="14" rx="1" />
      <path d="M7 5v14M17 5v14" />
      <path d="M3 9h4M3 15h4M17 9h4M17 15h4" strokeDasharray="1.5 2" />
    </svg>
  );
}

function MusicIcon({ className }: { className?: string }) {
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
      <path d="M9 18V7l10-2v11" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="16" r="2" />
    </svg>
  );
}

function GamepadIcon({ className }: { className?: string }) {
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
      <rect x="2" y="7" width="20" height="10" rx="3" />
      <path d="M8 10v4M6 12h4" />
      <circle cx="16" cy="11" r="1" fill="currentColor" stroke="none" />
      <circle cx="18" cy="13" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Logo / brand category - stroke style to match other nav icons */
function LogoIcon({ className }: { className?: string }) {
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
      <path d="M12 2l8 5v10l-8 5-8-5V7l8-5z" />
      <path d="M12 12v10M12 12L4 8M12 12l8-5" />
    </svg>
  );
}

function BookIcon({ className }: { className?: string }) {
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
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <path d="M12 6v10" />
    </svg>
  );
}

function ThemeHalfIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path d="M12 3a9 9 0 0 1 0 18V3z" fill="var(--theme-icon-fill)" />
    </svg>
  );
}

function LikedIcon({ className }: { className?: string }) {
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
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3-3" />
    </svg>
  );
}

function MenuIcon({ className }: { className?: string }) {
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
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
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
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

const navItems: {
  slug: FontCategorySlug;
  Icon: typeof FilmIcon;
}[] = [
  { slug: "movie", Icon: FilmIcon },
  { slug: "music", Icon: MusicIcon },
  { slug: "game", Icon: GamepadIcon },
  { slug: "logo", Icon: LogoIcon },
  { slug: "book", Icon: BookIcon },
];

export function SiteHeader() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLight, setIsLight] = useState(false);
  const [headerDocked, setHeaderDocked] = useState(false);
  const [headerEntered, setHeaderEntered] = useState(false);
  const pathname = usePathname();
  const { count: likedCount } = useLikedFonts();
  const isLikedActive = pathname === "/liked";

  const shellRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLElement>(null);
  const logoMarkRef = useRef<HTMLDivElement>(null);
  const logoFontRef = useRef<HTMLSpanElement>(null);
  const logoBoltRef = useRef<HTMLSpanElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const storeRef = useRef<HTMLDivElement>(null);
  const utilRef = useRef<HTMLDivElement>(null);
  const searchBackdropRef = useRef<HTMLButtonElement>(null);
  const searchPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const threshold = 12;
    let docked = false;
    return onScrollThrottled(() => {
      const next = window.scrollY > threshold;
      if (next === docked) return;
      docked = next;
      setHeaderDocked(next);
    });
  }, []);

  useEffect(() => {
    document.documentElement.toggleAttribute("data-header-docked", headerDocked);
    return () => {
      document.documentElement.removeAttribute("data-header-docked");
    };
  }, [headerDocked]);

  useLayoutEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;
    return subscribeSiteHeaderMetrics(shell);
  }, [pathname]);

  useEffect(() => {
    const id = requestAnimationFrame(() => setHeaderEntered(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useLayoutEffect(() => {
    const stored =
      typeof window !== "undefined"
        ? window.localStorage.getItem(THEME_KEY)
        : null;
    if (stored === "light") {
      document.documentElement.classList.add("light");
      startTransition(() => setIsLight(true));
    } else {
      document.documentElement.classList.remove("light");
      startTransition(() => setIsLight(false));
    }
  }, []);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (searchOpen) setMenuOpen(false);
  }, [searchOpen]);

  useEffect(() => {
    document.body.style.overflow = searchOpen || menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [searchOpen, menuOpen]);

  useEffect(() => {
    if (!searchOpen && !menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeSearch();
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen, menuOpen, closeSearch]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggleTheme = useCallback(() => {
    document.documentElement.classList.toggle("light");
    const light = document.documentElement.classList.contains("light");
    setIsLight(light);
    try {
      window.localStorage.setItem(THEME_KEY, light ? "light" : "dark");
    } catch {
      /* ignore */
    }

    void rootRef.current;
  }, []);

  const headerIconSizeClass = "size-5 shrink-0 sm:size-[18px]";
  const headerNavIconClass =
    "size-[18px] shrink-0 text-current opacity-90 transition-[opacity,color] duration-200 group-hover:opacity-100 sm:size-4 md:size-[18px]";

  return (
    <>
      <HeaderSearchDialog
        open={searchOpen}
        onClose={closeSearch}
        panelRef={searchPanelRef}
        backdropRef={searchBackdropRef}
      />

      {menuOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-[139] bg-black/45 md:hidden"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
      ) : null}

      <div
        ref={shellRef}
        className="site-header-shell fixed inset-x-0 z-[140] flex justify-center px-[max(0px,env(safe-area-inset-left,0px))]"
      >
        <header
          ref={rootRef}
          className={`site-header-bar relative w-full max-w-[var(--header-max-width)] border border-[color:var(--header-border)] bg-[var(--header-surface-solid)] px-2.5 py-2 shadow-[var(--header-shadow)] transition-[background-color,border-color,box-shadow,border-radius] duration-300 ease-out sm:px-5 sm:py-2.5 md:px-6 md:py-3 md:bg-[var(--header-surface)] md:backdrop-blur-md ${
            headerEntered ? "is-entering" : "opacity-0"
          } ${
            headerDocked ? "md:bg-[var(--header-surface-solid)] md:backdrop-blur-none" : ""
          } ${
            headerDocked
              ? "rounded-t-none rounded-b-[1.25rem] sm:rounded-b-4xl"
              : "rounded-b-[1.25rem] sm:rounded-[1.75rem] md:rounded-4xl"
          }`}
        >
        <div className="flex w-full min-w-0 items-center justify-between gap-2 md:grid md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:gap-2 lg:gap-3 xl:gap-4">
          <div className="flex min-w-0 items-center justify-self-start md:shrink-0">
            <Link
              href="/"
              className="group/logo flex min-w-0 items-center gap-1.5 rounded-xl py-1 pl-0.5 pr-1 outline-offset-2 focus-visible:outline-2 focus-visible:outline-[var(--accent)] sm:gap-2.5 sm:pr-3"
              aria-label="Installfont home"
            >
            <div
              ref={logoMarkRef}
              className="relative flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[var(--header-surface)] shadow-[0_0_0_1px_var(--logo-mark-ring)_inset,0_0_20px_-6px_color-mix(in_oklab,var(--accent)_40%,transparent),0_0_28px_-10px_color-mix(in_oklab,var(--brand-blue)_35%,transparent)] transition-transform duration-300 ease-out group-hover/logo:scale-[1.04] sm:size-9"
            >
              <Image
                src="/favicon/favicon.svg"
                alt=""
                width={36}
                height={36}
                className="size-6 object-contain sm:size-8"
                priority
              />
            </div>
            <div className="flex min-w-0 items-baseline truncate text-[13px] font-semibold tracking-tight text-[var(--foreground)] sm:text-[15px] md:text-base">
              <span ref={logoFontRef} className="font-semibold">
                Install
              </span>
              <span ref={logoBoltRef} className="font-normal text-[var(--header-muted)]">
                {" fonts"}
              </span>
            </div>
            </Link>
          </div>

          <nav
            ref={navRef}
            className="site-header-nav hidden min-w-0 max-w-full items-center justify-center justify-self-center gap-0 overflow-x-auto py-0.5 md:flex md:flex-1 md:justify-center md:gap-0.5 lg:gap-1"
            aria-label="Main"
          >
            {navItems.map(({ slug, Icon }) => {
              const meta = CATEGORY_META[slug];
              const href = `/fonts/${slug}`;
              const isActive = pathname === href;
              return (
                <Link
                  key={slug}
                  href={href}
                  aria-label={meta.label}
                  aria-current={isActive ? "page" : undefined}
                  className="group text-[var(--foreground)]/90"
                >
                  <span
                    className={`flex shrink-0 items-center gap-1 rounded-lg px-0.5 py-1 text-[12px] font-bold text-[var(--foreground)] transition-colors max-md:px-1 max-md:py-1.5 sm:gap-1.5 sm:px-2 sm:py-2 sm:text-[12.5px] lg:gap-2 lg:px-2.5 lg:text-[13px] ${
                      isActive
                        ? "bg-[var(--header-hover)] shadow-[inset_0_0_0_1px_var(--chip-active-border)]"
                        : "hover:bg-[var(--header-hover)]"
                    }`}
                  >
                    <span className="flex size-[18px] items-center justify-center sm:size-4 md:size-[18px]">
                      <Icon className={headerNavIconClass} />
                    </span>
                    <span className="hidden whitespace-nowrap sm:inline lg:hidden">
                      {meta.navLabel}
                    </span>
                    <span className="hidden whitespace-nowrap lg:inline">
                      {meta.label}
                    </span>
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="flex min-w-0 items-center justify-self-end gap-0.5 md:shrink-0 md:gap-3">
          <div
            ref={storeRef}
            className="flex shrink-0 items-center gap-0.5 rounded-xl border border-[color:var(--header-border)] bg-[var(--header-hover)]/60 p-0.5 max-md:gap-0 max-md:border-0 max-md:bg-transparent"
          >
            <a
              href={APP_STORE_IFONT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg p-1.5 text-[var(--foreground)]/90 transition-[background-color,color,transform] duration-200 hover:bg-[var(--header-hover)] hover:opacity-100 active:scale-[0.96] sm:p-2"
              aria-label="Get iFont on the App Store"
            >
              <AppleMark className="size-5 lg:size-6" />
            </a>
            <a
              href={GOOGLE_PLAY_INSTALLFONT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg p-1.5 text-[var(--foreground)]/90 opacity-90 transition-[background-color,color,transform] duration-200 hover:bg-[var(--header-hover)] hover:opacity-100 active:scale-[0.96] sm:p-2"
              aria-label="Get Installfont on Google Play"
            >
              <GooglePlayMark className="size-5 lg:size-6" />
            </a>
          </div>

          <div
            ref={utilRef}
            className="flex shrink-0 items-center gap-0.5 rounded-xl border border-[color:var(--header-border)] bg-[var(--header-hover)]/40 p-0.5 max-md:gap-0 max-md:border-0 max-md:bg-transparent"
          >
            <Link
              href="/liked"
              className={`relative rounded-lg p-2 transition-colors sm:p-2 ${
                isLikedActive
                  ? "bg-[var(--header-hover)] text-[var(--accent)]"
                  : "text-[var(--foreground)]/90 hover:bg-[var(--header-hover)]"
              }`}
              aria-label={
                likedCount > 0
                  ? `Liked fonts, ${likedCount} saved`
                  : "Liked fonts"
              }
              aria-current={isLikedActive ? "page" : undefined}
              title="Liked fonts"
            >
              <LikedIcon
                className={`${headerIconSizeClass} ${likedCount > 0 ? "fill-[var(--accent)] stroke-[var(--accent)]" : ""}`}
              />
              {likedCount > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 flex min-w-[1.125rem] items-center justify-center rounded-full bg-[var(--accent)] px-1 py-px text-[9px] font-bold leading-none text-white ring-2 ring-[color:var(--header-surface-solid)]">
                  {likedCount > 99 ? "99+" : likedCount}
                </span>
              ) : null}
            </Link>
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="relative rounded-lg p-2 text-[var(--foreground)]/90 transition-colors hover:bg-[var(--header-hover)] sm:p-2"
              aria-label="Open search"
            >
              <SearchIcon className={headerIconSizeClass} />
              <span
                className="absolute bottom-1 right-1 size-1.5 rounded-full bg-[var(--brand-blue)] ring-[1.5px] ring-[color:var(--ring-header)] sm:bottom-1.5 sm:right-1.5"
                aria-hidden
              />
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="hidden rounded-lg p-2 text-[var(--foreground)]/90 transition-colors hover:bg-[var(--header-hover)] md:inline-flex sm:p-2"
              aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
            >
              <ThemeHalfIcon className={headerIconSizeClass} />
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="rounded-lg p-2 text-[var(--foreground)]/90 transition-colors hover:bg-[var(--header-hover)] md:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <CloseIcon className={headerIconSizeClass} />
              ) : (
                <MenuIcon className={headerIconSizeClass} />
              )}
            </button>
          </div>
          </div>
        </div>
        {menuOpen ? (
          <div className="absolute inset-x-0 top-full z-50 mt-1.5 overflow-hidden rounded-2xl border border-[color:var(--header-border)] bg-[var(--header-surface-solid)] p-2 shadow-[var(--header-shadow)] md:hidden">
            <nav className="grid gap-0.5" aria-label="Categories">
              {navItems.map(({ slug, Icon }) => {
                const meta = CATEGORY_META[slug];
                const href = `/fonts/${slug}`;
                const isActive = pathname === href;
                return (
                  <Link
                    key={slug}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium ${
                      isActive
                        ? "bg-[var(--header-hover)] text-[var(--foreground)]"
                        : "text-[var(--foreground)]/90 hover:bg-[var(--header-hover)]"
                    }`}
                  >
                    <Icon className="size-4 shrink-0 opacity-90" />
                    {meta.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-2 flex items-center border-t border-[color:var(--header-border)] px-1 pt-2">
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-[14px] font-medium text-[var(--foreground)]/90 hover:bg-[var(--header-hover)]"
              >
                <ThemeHalfIcon className="size-4" />
                {isLight ? "Dark theme" : "Light theme"}
              </button>
            </div>
          </div>
        ) : null}
        </header>
      </div>
    </>
  );
}

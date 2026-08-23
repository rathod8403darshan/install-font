"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { isCoarseOrNarrow, prefersReducedMotion } from "@/lib/motion";
import { APP_STORE_IFONT_URL } from "@/lib/mobile-app-links";
import { AppleMark } from "@/components/MobileAppStoreIcons";
import { PREVIEW_FONT_META } from "@/fonts/preview-fonts";

const SCREEN_TILES = [
  { label: "Bold", from: "#a78bfa", to: "#6d28d9", accent: "#c4b5fd", fontClassName: PREVIEW_FONT_META.oswald.className },
  { label: "Script", from: "#2dd4bf", to: "#0f766e", accent: "#5eead4", fontClassName: PREVIEW_FONT_META.pacifico.className },
  { label: "Signature", from: "#f472b6", to: "#a21caf", accent: "#f9a8d4", fontClassName: PREVIEW_FONT_META.marker.className },
  { label: "Decorative", from: "#fb923c", to: "#c2410c", accent: "#fdba74", fontClassName: PREVIEW_FONT_META.bungee.className },
  { label: "Minimal", from: "#71717a", to: "#18181b", accent: "#e4e4e7", fontClassName: "" },
  { label: "Retro", from: "#60a5fa", to: "#1d4ed8", accent: "#93c5fd", fontClassName: PREVIEW_FONT_META.bebas.className },
] as const;

type IconName =
  | "home"
  | "grid"
  | "plus"
  | "gear"
  | "sliders"
  | "download"
  | "palette";

function PhoneIcon({ name }: { name: IconName }) {
  const common = {
    className: "size-full",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  if (name === "home") {
    return (
      <svg {...common}>
        <path d="M4 11l8-6 8 6v7.5a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1V11z" />
      </svg>
    );
  }
  if (name === "grid") {
    return (
      <svg {...common}>
        <rect x="4" y="4" width="7" height="7" rx="1.2" />
        <rect x="13" y="4" width="7" height="7" rx="1.2" />
        <rect x="4" y="13" width="7" height="7" rx="1.2" />
        <rect x="13" y="13" width="7" height="7" rx="1.2" />
      </svg>
    );
  }
  if (name === "plus") {
    return (
      <svg {...common}>
        <path d="M12 5v14M5 12h14" />
      </svg>
    );
  }
  if (name === "gear") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
      </svg>
    );
  }
  if (name === "sliders") {
    return (
      <svg {...common}>
        <path d="M4 7h10M18 7h2M4 17h2M8 17h12" />
        <circle cx="16" cy="7" r="2" />
        <circle cx="6" cy="17" r="2" />
      </svg>
    );
  }
  if (name === "download") {
    return (
      <svg {...common}>
        <path d="M12 4v11" />
        <path d="M8 11l4 4 4-4" />
        <path d="M5 19h14" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M12 4.8c2.8 3.2 6 6.6 6 9.4A6 6 0 1 1 6 14.2c0-2.8 3.2-6.2 6-9.4z" />
    </svg>
  );
}

const HERO_SPARKLES = [
  { top: "3%", left: "18%", size: 9, color: "var(--accent)", delay: "0s" },
  { top: "10%", right: "20%", size: 7, color: "var(--brand-blue)", delay: "0.7s" },
  { bottom: "16%", left: "16%", size: 8, color: "var(--accent-3)", delay: "1.4s" },
  { bottom: "4%", right: "22%", size: 7, color: "var(--accent)", delay: "2.1s" },
] as const;

function HeroSparkles() {
  return (
    <>
      {HERO_SPARKLES.map((sparkle, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          fill={sparkle.color}
          aria-hidden
          className="hero-sparkle pointer-events-none absolute z-[15]"
          style={{
            top: "top" in sparkle ? sparkle.top : undefined,
            bottom: "bottom" in sparkle ? sparkle.bottom : undefined,
            left: "left" in sparkle ? sparkle.left : undefined,
            right: "right" in sparkle ? sparkle.right : undefined,
            width: sparkle.size,
            height: sparkle.size,
            animationDelay: sparkle.delay,
          }}
        >
          <path d="M12 2c0 4.6 1.2 7.4 4 10-2.8 2.6-4 5.4-4 10-0-4.6-1.2-7.4-4-10 2.8-2.6 4-5.4 4-10z" />
        </svg>
      ))}
    </>
  );
}

const HERO_TICKS = [
  { top: "24%", left: "6%", size: 10, color: "var(--accent)" },
  { top: "8%", right: "30%", size: 8, color: "var(--accent-3)" },
  { bottom: "28%", right: "6%", size: 10, color: "var(--brand-blue)" },
] as const;

function HeroTicks() {
  return (
    <>
      {HERO_TICKS.map((tick, i) => (
        <svg
          key={i}
          viewBox="0 0 16 16"
          fill="none"
          stroke={tick.color}
          strokeWidth="1.4"
          strokeLinecap="round"
          aria-hidden
          className="hero-tick pointer-events-none absolute z-[15]"
          style={{
            top: "top" in tick ? tick.top : undefined,
            bottom: "bottom" in tick ? tick.bottom : undefined,
            left: "left" in tick ? tick.left : undefined,
            right: "right" in tick ? tick.right : undefined,
            width: tick.size,
            height: tick.size,
          }}
        >
          <path d="M8 1v4M8 11v4M1 8h4M11 8h4" />
        </svg>
      ))}
    </>
  );
}

function HeroOrbit() {
  return (
    <svg
      className="hero-orbit pointer-events-none absolute inset-0 size-full"
      viewBox="0 0 400 400"
      fill="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="hero-orbit-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--accent)" />
          <stop offset="50%" stopColor="var(--brand-blue)" />
          <stop offset="100%" stopColor="var(--accent-3)" />
        </linearGradient>
      </defs>

      {/* Center core + radial spokes to the orbit nodes */}
      <circle cx="200" cy="200" r="2.5" fill="var(--accent)" opacity="0.7" />
      <circle
        cx="200"
        cy="200"
        r="7"
        stroke="var(--accent)"
        strokeWidth="1"
        opacity="0.35"
      />
      <path
        d="M200 200L200 52M200 200L374 200M200 200L62 200M200 200L200 315"
        stroke="url(#hero-orbit-grad)"
        strokeWidth="0.75"
        strokeDasharray="1 6"
        opacity="0.3"
      />

      <g className="hero-orbit-ring-1">
        <ellipse
          cx="200"
          cy="200"
          rx="176"
          ry="148"
          stroke="url(#hero-orbit-grad)"
          strokeWidth="1.25"
          strokeDasharray="2 10"
          opacity="0.8"
        />
        {/* Tick marks around the outer ring */}
        {Array.from({ length: 16 }, (_, i) => {
          const angle = (i / 16) * Math.PI * 2;
          const x1 = 200 + Math.cos(angle) * 184;
          const y1 = 200 + Math.sin(angle) * 156;
          const x2 = 200 + Math.cos(angle) * 190;
          const y2 = 200 + Math.sin(angle) * 161;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="var(--accent)"
              strokeWidth="1"
              opacity="0.28"
            />
          );
        })}
        <circle className="hero-orbit-dot" cx="200" cy="52" r="3" fill="var(--accent)" />
        <circle
          className="hero-orbit-dot"
          cx="374"
          cy="200"
          r="3"
          fill="var(--brand-blue)"
          style={{ animationDelay: "1s" }}
        />
      </g>
      <g className="hero-orbit-ring-2">
        <ellipse
          cx="200"
          cy="200"
          rx="138"
          ry="115"
          stroke="url(#hero-orbit-grad)"
          strokeWidth="1.1"
          strokeDasharray="1.5 8"
          opacity="0.65"
        />
        <circle
          className="hero-orbit-dot"
          cx="62"
          cy="200"
          r="3"
          fill="var(--accent-3)"
          style={{ animationDelay: "0.5s" }}
        />
        <circle
          className="hero-orbit-dot"
          cx="200"
          cy="315"
          r="3"
          fill="var(--accent)"
          style={{ animationDelay: "1.6s" }}
        />
      </g>
    </svg>
  );
}

function HeroCornerFrame() {
  const common =
    "absolute size-3.5 border-[color:color-mix(in_oklab,var(--accent)_55%,transparent)] sm:size-4";
  return (
    <>
      <span className={`${common} left-0 top-0 border-l-2 border-t-2`} aria-hidden />
      <span className={`${common} right-0 top-0 border-r-2 border-t-2`} aria-hidden />
      <span className={`${common} bottom-0 left-0 border-b-2 border-l-2`} aria-hidden />
      <span className={`${common} bottom-0 right-0 border-b-2 border-r-2`} aria-hidden />
    </>
  );
}

function HeroPhoneScreen() {
  return (
    <div className="flex h-full w-full flex-col bg-[#0c0c12] px-3.5 pb-2 pt-2.5 text-white">
      <div className="flex items-center justify-between px-0.5 text-[11px] font-medium text-white/70">
        <span>9:41</span>
        <span className="flex items-center gap-[1.5px]" aria-hidden>
          <span className="relative h-3 w-6 rounded-[3px] border border-white/55 p-[1.5px]">
            <span className="block h-full w-full rounded-[1px] bg-white" />
          </span>
          <span className="h-1.5 w-[2px] rounded-r-sm bg-white/55" />
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between px-0.5">
        <p className="text-[15px] font-semibold tracking-tight text-white">Categories</p>
        <span className="flex size-6 items-center justify-center rounded-full bg-white/8 text-white/60">
          <span className="size-3.5">
            <PhoneIcon name="sliders" />
          </span>
        </span>
      </div>

      <div className="mt-3 grid flex-1 grid-cols-2 gap-2.5">
        {SCREEN_TILES.map((tile) => (
          <div
            key={tile.label}
            className="relative flex flex-col justify-between overflow-hidden rounded-[0.9rem] border px-3 py-3"
            style={{
              borderColor: `color-mix(in oklab, ${tile.from} 45%, transparent)`,
              background: `linear-gradient(155deg, color-mix(in oklab, ${tile.from} 24%, #121218), color-mix(in oklab, ${tile.to} 16%, #0a0a0e))`,
            }}
          >
            <span
              className="pointer-events-none absolute -right-3 -top-3 size-11 rounded-full blur-lg"
              style={{ background: tile.from, opacity: 0.4 }}
              aria-hidden
            />
            <span
              className={`relative text-[20px] font-semibold leading-none ${tile.fontClassName}`}
              style={{ color: tile.accent }}
            >
              Aa
            </span>
            <span className="relative mt-3 flex min-w-0 items-center gap-1.5 text-[10px] font-medium leading-none tracking-wide text-white/90">
              <span
                className="size-1 shrink-0 rounded-full"
                style={{ background: tile.accent }}
                aria-hidden
              />
              <span className="min-w-0 truncate">{tile.label}</span>
            </span>
          </div>
        ))}
      </div>

      <div className="mt-2.5 flex items-center justify-between border-t border-white/10 px-1 pt-2.5">
        {(["home", "grid", "plus", "gear"] as const).map((icon, i) => (
          <span
            key={icon}
            className={`flex size-7 items-center justify-center rounded-full ${
              i === 0 ? "bg-[var(--accent)] text-black" : "text-white/45"
            }`}
          >
            <span className="size-4">
              <PhoneIcon name={icon} />
            </span>
          </span>
        ))}
      </div>

      <div className="mx-auto mt-2 h-1 w-24 shrink-0 rounded-full bg-white/30" aria-hidden />
    </div>
  );
}

function HeroPhone() {
  return (
    <div
      className="hero-phone relative z-10 mx-auto aspect-[9/19] w-[11.5rem] rounded-[2.25rem] border border-white/15 bg-gradient-to-b from-[#232329] to-[#08080b] p-[0.4rem] shadow-[0_0_0_5px_rgba(0,0,0,0.55)_inset,0_36px_70px_-26px_rgba(0,0,0,0.85),0_0_54px_-14px_color-mix(in_oklab,var(--accent)_38%,transparent)] sm:w-[12rem] lg:w-[12.5rem]"
    >
      <span
        className="pointer-events-none absolute -right-[3px] top-[24%] h-9 w-[3px] rounded-r-sm bg-white/25"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute -left-[3px] top-[18%] h-6 w-[3px] rounded-l-sm bg-white/20"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute -left-[3px] top-[27%] h-6 w-[3px] rounded-l-sm bg-white/20"
        aria-hidden
      />

      <div
        className="pointer-events-none absolute left-1/2 top-[0.55rem] h-3.5 w-12 -translate-x-1/2 rounded-full bg-black/85"
        aria-hidden
      />
      <div className="relative h-full w-full overflow-hidden rounded-[1.85rem]">
        <HeroPhoneScreen />
      </div>
    </div>
  );
}

type ChipDef = {
  key: string;
  className: string;
  glow: string;
  content: React.ReactNode;
};

const HERO_CHIPS: ChipDef[] = [
  {
    key: "stylish",
    className: "hero-chip-1 left-[3%] top-[2%] w-[5.75rem] px-2.5 py-2",
    glow: "var(--accent-3)",
    content: (
      <>
        <p className="font-serif text-[1.1rem] font-semibold leading-none text-white">Ag</p>
        <p className="mt-1.5 text-[9px] font-medium leading-tight text-white/90">
          Stylish Fonts
        </p>
        <p className="text-[8px] leading-tight text-white/50">For Every Mood</p>
      </>
    ),
  },
  {
    key: "install",
    className: "hero-chip-3 left-[4%] bottom-[2%] w-[6.25rem] px-2.5 py-2",
    glow: "var(--accent)",
    content: (
      <>
        <span className="flex size-5 items-center justify-center text-[var(--accent)]">
          <PhoneIcon name="download" />
        </span>
        <p className="mt-1.5 text-[9px] font-semibold leading-tight text-white">Easy Install</p>
        <p className="text-[8px] leading-tight text-white/50">One Tap Setup</p>
      </>
    ),
  },
  {
    key: "create",
    className: "hero-chip-4 right-[2%] top-[0%] w-[6.5rem] px-2.5 py-2",
    glow: "var(--brand-blue)",
    content: (
      <>
        <p
          className="text-[1.3rem] italic leading-none text-white"
          style={{ fontFamily: "'Segoe Script', 'Bradley Hand', cursive" }}
        >
          Aa
        </p>
        <p className="mt-1.5 text-[9px] font-medium leading-tight text-white/90">
          Create Your Own Font
        </p>
      </>
    ),
  },
  {
    key: "customize",
    className: "hero-chip-6 right-[3%] bottom-[4%] w-[6.5rem] px-2.5 py-2",
    glow: "var(--accent)",
    content: (
      <>
        <span className="flex size-5 items-center justify-center text-[var(--accent-3)]">
          <PhoneIcon name="palette" />
        </span>
        <p className="mt-1.5 text-[9px] font-semibold leading-tight text-white">Customize</p>
        <p className="text-[8px] leading-tight text-white/50">Your Style</p>
      </>
    ),
  },
];

function HeroPhoneStage() {
  return (
    <div
      data-hero-stage
      className="relative mx-auto flex w-full max-w-[17rem] scale-[0.84] items-center justify-center py-6 sm:max-w-[19rem] sm:scale-95 sm:py-6 md:ml-auto md:mr-0 md:h-[16rem] md:py-0 lg:h-[18rem] lg:max-w-[24rem] lg:scale-100"
    >
      <HeroOrbit />
      <HeroSparkles />
      <HeroTicks />
      <HeroCornerFrame />
      <div className="hero-pedestal-glow" aria-hidden />
      <div className="hero-pedestal-ring" aria-hidden />
      <HeroPhone />
      {HERO_CHIPS.map((chip) => (
        <div
          key={chip.key}
          data-hero-chip
          aria-hidden
          className={`hero-chip absolute z-20 ${chip.className}`}
        >
          <span
            className="hero-chip-glow"
            style={{ background: chip.glow }}
            aria-hidden
          />
          <span
            className="pointer-events-none absolute inset-x-3 top-0 h-px"
            style={{
              background: `linear-gradient(90deg, transparent, ${chip.glow}, transparent)`,
              opacity: 0.5,
            }}
            aria-hidden
          />
          {chip.content}
        </div>
      ))}
    </div>
  );
}

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const visual = visualRef.current;
    if (!section || !content || !visual) return;

    const items = Array.from(
      section.querySelectorAll<HTMLElement>("[data-hero-item]"),
    );
    const stage = visual.querySelector<HTMLElement>("[data-hero-stage]");
    const chips = stage
      ? Array.from(stage.querySelectorAll<HTMLElement>("[data-hero-chip]"))
      : [];

    if (prefersReducedMotion() || isCoarseOrNarrow()) {
      gsap.set([...items, stage, ...chips].filter(Boolean), {
        opacity: 1,
        y: 0,
        scale: 1,
        clearProps: "transform",
      });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(items, { opacity: 0, y: 22 });
      if (stage) gsap.set(stage, { opacity: 0, y: 26, scale: 0.97 });
      if (chips.length) gsap.set(chips, { opacity: 0, y: 16, scale: 0.9 });

      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.07,
        ease: "power3.out",
      });
      if (stage) {
        gsap.to(stage, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          delay: 0.16,
          ease: "power3.out",
        });
      }
      if (chips.length) {
        gsap.to(chips, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          delay: 0.5,
          stagger: 0.08,
          ease: "back.out(1.5)",
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="hero-bleed hero-viewport relative overflow-hidden"
    >
      <div className="hero-field-grid pointer-events-none absolute inset-0" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,color-mix(in_oklab,var(--accent)_14%,transparent),transparent_48%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,color-mix(in_oklab,var(--brand-blue)_14%,transparent),transparent_52%)]" />

      <div className="relative z-10 mx-auto flex w-full max-w-[var(--header-max-width)] flex-1 flex-col pl-[clamp(0.85rem,2vw,1.5rem)] pr-[var(--page-gutter)]">
      <div className="grid w-full flex-1 grid-cols-1 items-center gap-10 sm:gap-8 md:grid-cols-[minmax(0,1fr)_minmax(16rem,1fr)] md:gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.95fr)] xl:gap-10">
        <div
          ref={contentRef}
          className="relative z-10 w-full max-w-2xl text-center md:max-w-none md:text-left"
        >
          <p
            data-hero-item
            className="mb-3 inline-flex items-center gap-2 font-mono text-[9px] font-medium tracking-[0.2em] text-[var(--accent)] sm:text-[10px]"
          >
            <span className="size-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_12px_var(--accent)]" />
            INSTALLFONT // iOS
          </p>

          <h1
            data-hero-item
            className="text-balance text-[clamp(1.65rem,3.6vw,2.65rem)] font-semibold leading-[1.14] tracking-[-0.04em] text-[var(--foreground)]"
          >
            Fonts For{" "}
            <span className="font-shimmer">iPhone</span>
            {" - "}
            Install, Create &amp; Customize Fonts on iPhone and iPad
          </h1>

          <p
            data-hero-item
            className="mt-3.5 max-w-xl text-pretty text-[13px] leading-relaxed text-[#c4c4cc] sm:text-[14px] lg:max-w-lg"
          >
            Looking for the best{" "}
            <span className="font-semibold text-[var(--foreground)]">
              Fonts for iPhone
            </span>
            ? InstallFont gives you hundreds of ready-to-use styles so you can
            enjoy a{" "}
            <span className="font-semibold text-[var(--accent)]">
              Custom Font for iPhone
            </span>{" "}
            in seconds - no design skills needed. Just download, tap, and
            transform your screen.
          </p>

          <div
            data-hero-item
            className="mt-6 flex flex-col items-center sm:mt-5 sm:flex-row sm:items-center sm:justify-center md:justify-start"
          >
            <a
              href={APP_STORE_IFONT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-highlight"
            >
              <AppleMark className="size-3.5 sm:size-5" />
              Download Install Font on the App Store
            </a>
          </div>
        </div>

        <div ref={visualRef} className="relative mx-auto w-full max-w-[32rem] shrink-0 md:ml-auto md:mr-0 md:max-w-none">
          <HeroPhoneStage />
        </div>
      </div>
      </div>
    </section>
  );
}

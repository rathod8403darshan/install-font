"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import gsap from "gsap";
import {
  HOME_FAQ,
  HOME_MARKETING_SECTIONS,
  type HomeCta,
  type HomeMarketingSection,
} from "@/data/home-marketing";
import {
  APP_STORE_IFONT_URL,
  GOOGLE_PLAY_INSTALLFONT_URL,
} from "@/lib/mobile-app-links";
import { isCoarseOrNarrow, prefersReducedMotion } from "@/lib/motion";
import { AppleMark, GooglePlayMark } from "@/components/MobileAppStoreIcons";
import { HomeFontPlayground } from "@/components/HomeFontPlayground";
import { AccentTitle } from "@/components/AccentTitle";
import { HomeLibraryVisual } from "@/components/HomeLibraryVisual";
import { HomeDiscoverFontCards } from "@/components/HomeDiscoverFontCards";

/** Shared readable measure - every marketing section uses the same width. */
const shell =
  "page-px relative border-t border-[color:var(--header-border)]/40 py-9 sm:py-11";
const wrap = "mx-auto w-full";

function resolveCtaHref(href: HomeCta["href"]): string {
  if (href === "app-store") return APP_STORE_IFONT_URL;
  if (href === "google-play") return GOOGLE_PLAY_INSTALLFONT_URL;
  return href;
}

function isExternalCta(href: HomeCta["href"]): boolean {
  return href === "app-store" || href === "google-play" || href.startsWith("http");
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="mb-2 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--hero-muted)]">
      <span className="size-1 rounded-full bg-[var(--accent)]" />
      {children}
    </span>
  );
}

function ExploreMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.85"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M14.5 9.5l-1.2 4.8-4.8 1.2 1.2-4.8 4.8-1.2z" fill="currentColor" stroke="none" />
      <path d="M12 3v1.5M12 19.5V21M3 12h1.5M19.5 12H21" />
    </svg>
  );
}

function Ctas({
  ctas,
  center,
  compact,
  row,
  stack,
}: {
  ctas?: HomeCta[];
  center?: boolean;
  compact?: boolean;
  row?: boolean;
  stack?: boolean;
}) {
  if (!ctas?.length) return null;
  return (
    <div
      data-m-item
      className={`mt-5 max-w-full ${
        row
          ? "cta-row flex gap-2.5"
          : stack
            ? "cta-stack"
            : "flex flex-wrap gap-2.5"
      } ${center && !stack ? "justify-center" : ""}`}
    >
      {ctas.map((cta, i) => {
        const href = resolveCtaHref(cta.href);
        const store = cta.href === "app-store" || cta.href === "google-play";
        const allStore = ctas.every(
          (item) => item.href === "app-store" || item.href === "google-play",
        );
        const primary = i === 0 || (store && allStore);
        const cls = primary
          ? `cta-highlight ${compact || row ? "cta-highlight-compact" : ""}`
          : "cta-secondary";
        const iconClass = row
          ? "size-4 shrink-0 sm:size-5"
          : "size-3.5 shrink-0 sm:size-5";
        const icon =
          cta.href === "app-store" ? (
            <AppleMark className={iconClass} />
          ) : cta.href === "google-play" ? (
            <GooglePlayMark className={iconClass} />
          ) : /explore/i.test(cta.label) ? (
            <ExploreMark className={iconClass} />
          ) : null;
        if (isExternalCta(cta.href)) {
          return (
            <a
              key={cta.label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={cls}
            >
              {icon}
              {cta.label}
            </a>
          );
        }
        return (
          <Link key={cta.label} href={href} className={cls}>
            {icon}
            {cta.label}
          </Link>
        );
      })}
    </div>
  );
}

function Copy({
  paragraphs,
  center,
}: {
  paragraphs?: string[];
  center?: boolean;
}) {
  if (!paragraphs?.length) return null;
  return (
    <div
      className={`mt-3 space-y-2 ${
        center
          ? "mx-auto max-w-2xl text-center"
          : "max-md:text-center md:text-left"
      }`}
    >
      {paragraphs.map((p) => (
        <p
          key={p.slice(0, 48)}
          data-m-item
          className="text-sm leading-[1.6] text-[var(--hero-muted)]"
        >
          {p}
        </p>
      ))}
    </div>
  );
}

function Subhead({ children }: { children?: string }) {
  if (!children) return null;
  return (
    <h3
      data-m-item
      className="mt-6 text-[15px] font-semibold text-[var(--foreground)] max-md:text-center"
    >
      {children}
    </h3>
  );
}

function ListIntro({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <p data-m-item className="mt-5 text-sm text-[var(--hero-muted)] max-md:text-center">
      {text}
    </p>
  );
}

function Closing({ text, center }: { text?: string; center?: boolean }) {
  if (!text) return null;
  return (
    <p
      data-m-item
      className={`mt-5 text-sm leading-relaxed text-[var(--hero-muted)] ${
        center ? "mx-auto max-w-2xl text-center" : "max-md:text-center"
      }`}
    >
      {text}
    </p>
  );
}

function ChipRow({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          key={item}
          data-m-item
          className="rounded-lg border border-[color:var(--header-border)] bg-[var(--header-surface)]/60 px-3 py-1.5 text-[13px] text-[var(--foreground)]/90"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function ItemGrid({
  items,
}: {
  items: { label: string; text: string }[];
}) {
  return (
    <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
      {items.map((item) => (
        <li
          key={item.label}
          data-m-item
          className="rounded-xl border border-[color:var(--header-border)]/80 bg-[var(--header-surface)]/35 px-3.5 py-3"
        >
          <p className="text-sm font-semibold text-[var(--foreground)]">
            {item.label}
          </p>
          <p className="mt-1 text-[13px] leading-snug text-[var(--hero-muted)]">
            {item.text}
          </p>
        </li>
      ))}
    </ul>
  );
}

function useReveal(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const items = Array.from(el.querySelectorAll<HTMLElement>("[data-m-item]"));
    if (!items.length) return;
    if (prefersReducedMotion() || isCoarseOrNarrow()) {
      gsap.set(items, { clearProps: "all", opacity: 1, y: 0 });
      return;
    }
    gsap.set(items, { opacity: 0, y: 14 });
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return;
        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: 0.42,
          stagger: 0.035,
          ease: "power2.out",
          overwrite: "auto",
        });
        io.disconnect();
      },
      { threshold: 0.08, rootMargin: "0px 0px -5% 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      gsap.killTweensOf(items);
    };
  }, [ref]);
}

function Block({
  id,
  children,
  soft,
}: {
  id: string;
  children: ReactNode;
  soft?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <section
      ref={ref}
      id={id}
      className={`${shell} ${soft ? "bg-[var(--header-surface)]/15" : ""}`}
    >
      {children}
    </section>
  );
}

function Heading({
  eyebrow,
  title,
  center,
}: {
  eyebrow?: string;
  title: string;
  center?: boolean;
}) {
  return (
    <header
      data-m-item
      className={`w-full ${center ? "text-center" : "max-md:text-center"}`}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className="section-h2">
        <AccentTitle text={title} />
      </h2>
    </header>
  );
}

function FaqItem({
  question,
  answer,
  open,
  onToggle,
}: {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      data-m-item
      className="h-fit overflow-hidden rounded-xl border border-[color:var(--header-border)] bg-[var(--header-surface)]/50"
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-3.5 py-3 text-left"
      >
        <span className="text-sm font-medium text-[var(--foreground)]">
          {question}
        </span>
        <span
          className={`text-[var(--hero-muted)] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p className="px-3.5 pb-3 text-[13px] leading-relaxed text-[var(--hero-muted)]">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

function highlightChips(section: HomeMarketingSection): string[] {
  if (section.id === "trusted") {
    return [
      "App Store approved",
      "Apple guidelines",
      "Remove anytime",
      "Verified install",
    ];
  }
  if (section.id === "import" || section.id === "import-finder") {
    return [".ttf", ".ttc", ".otf", "Web import", "Google Fonts"];
  }
  if (section.id === "font-finder") {
    return section.bullets ?? [];
  }
  if (section.id === "safari") {
    return section.bullets ?? [];
  }
  return section.bullets?.slice(0, 8) ?? [];
}

function StepIcon({ index }: { index: number }) {
  const common = {
    className: "size-5",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.75",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  if (index === 0) {
    return (
      <svg {...common}>
        <path d="M12 3v12" />
        <path d="M8 11l4 4 4-4" />
        <path d="M5 19h14" />
      </svg>
    );
  }
  if (index === 1) {
    return (
      <svg {...common}>
        <circle cx="11" cy="11" r="6.5" />
        <path d="M16 16l4 4" />
        <path d="M8.5 11h5M11 8.5v5" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <rect x="7" y="3.5" width="10" height="17" rx="2" />
      <path d="M10 17.5h4" />
      <path d="M9.5 9.5l2 2 3.5-3.5" />
    </svg>
  );
}

function WhyChooseBoard({ section }: { section: HomeMarketingSection }) {
  const reasons = section.reasons ?? [];
  const [active, setActive] = useState(0);
  const pausedRef = useRef(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const playRef = useRef<() => void>(() => {});
  const count = reasons.length;
  const current = reasons[active] ?? reasons[0];
  const stats = [
    { value: "5,000+", label: "Fonts" },
    { value: "iPhone + iPad", label: "One app" },
    { value: ".ttf .otf", label: "Formats" },
  ];

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel || prefersReducedMotion() || count < 2) return;

    let timer: number | undefined;
    let inView = false;

    const stop = () => {
      window.clearTimeout(timer);
      timer = undefined;
    };
    const play = () => {
      stop();
      if (!inView || pausedRef.current) return;
      timer = window.setTimeout(() => {
        setActive((i) => (i + 1) % count);
        play();
      }, 3800);
    };
    playRef.current = play;

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = Boolean(entry?.isIntersecting);
        if (inView) play();
        else stop();
      },
      { threshold: 0.3 },
    );
    io.observe(panel);
    return () => {
      io.disconnect();
      stop();
    };
  }, [count]);

  return (
    <div className={`${wrap} relative`}>
      <div className="pointer-events-none absolute -left-10 top-0 h-64 w-64 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent)_16%,transparent),transparent_70%)]" />
      <div className="pointer-events-none absolute -right-8 bottom-0 h-56 w-56 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--brand-blue)_14%,transparent),transparent_70%)]" />

      <div className="relative grid grid-cols-1 items-start gap-10 md:grid-cols-[minmax(0,0.92fr)_minmax(0,1.18fr)] md:gap-10 lg:gap-14 xl:gap-16">
        <div className="min-w-0 max-md:text-center">
          <p
            data-m-item
            className="inline-flex items-center gap-2 font-mono text-[10px] font-medium tracking-[0.22em] text-[var(--accent)]"
          >
            <span className="size-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent)]" />
            WHY CHOOSE // 10 SIGNALS
          </p>
          <div className="mt-4">
            <Heading title={section.title} />
          </div>
          <Copy paragraphs={section.paragraphs} />

          <dl
            data-m-item
            className="mt-8 grid grid-cols-3 gap-3 max-md:mx-auto max-md:max-w-md"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="min-w-0 text-left max-md:text-center">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                  {stat.label}
                </dt>
                <dd className="mt-1 text-[1.05rem] font-semibold tracking-[-0.03em] text-[var(--foreground)] sm:text-[1.2rem]">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 hidden md:block">
            <Ctas ctas={section.ctas} />
          </div>
        </div>

        <div
          ref={panelRef}
          data-m-item
          onPointerEnter={() => {
            pausedRef.current = true;
          }}
          onPointerLeave={() => {
            pausedRef.current = false;
            playRef.current();
          }}
          className="min-w-0"
        >
          <div className="relative min-h-0 sm:min-h-[11rem]">
            <p
              key={`n-${active}`}
              className="why-choose-num pointer-events-none select-none"
              aria-hidden
            >
              {String(active + 1).padStart(2, "0")}
            </p>
            <div className="relative -mt-8 sm:-mt-10">
              <p className="font-mono text-[10px] tabular-nums tracking-[0.18em] text-[var(--hero-muted)]">
                {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
              </p>
              <h3
                key={`t-${active}`}
                className="why-choose-copy mt-2 text-[clamp(1.45rem,2.6vw,2rem)] font-semibold leading-[1.15] tracking-[-0.03em] text-[var(--foreground)]"
              >
                {current?.title}
              </h3>
              <p
                key={`d-${active}`}
                className="why-choose-copy mt-3 max-w-xl text-[14px] leading-relaxed text-[var(--hero-muted)] sm:text-[15px]"
              >
                {current?.description}
              </p>
            </div>
            <span
              key={active}
              className="more-feat-progress mt-5 block h-px origin-left bg-[var(--accent)]"
              aria-hidden
            />
          </div>

          <div
            role="tablist"
            aria-label="Reasons to choose Install Font"
            className="mt-3 grid grid-cols-1 gap-x-6 gap-y-0.5 sm:mt-5 sm:grid-cols-2"
          >
            {reasons.map((reason, i) => {
              const on = i === active;
              return (
                <button
                  key={reason.title}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  tabIndex={on ? 0 : -1}
                  onPointerEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className={`flex items-baseline gap-2.5 border-t border-[color:var(--header-border)] py-2.5 text-left outline-none transition-colors ${
                    on ? "text-[var(--foreground)]" : "text-[var(--hero-muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  <span
                    className={`shrink-0 font-mono text-[10px] tabular-nums tracking-[0.14em] ${
                      on ? "text-[var(--accent)]" : ""
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 truncate text-[13px] font-medium tracking-[-0.01em] sm:text-[14px]">
                    {reason.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative mt-8 flex justify-center md:hidden">
        <Ctas ctas={section.ctas} center />
      </div>
    </div>
  );
}

function HowToTimeline({
  steps,
}: {
  steps: NonNullable<HomeMarketingSection["steps"]>;
}) {
  const lineRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const line = lineRef.current;
    if (!root || !line) return;

    const isWide = () => window.matchMedia("(min-width: 640px)").matches;

    if (prefersReducedMotion()) {
      gsap.set(line, { scaleX: 1, scaleY: 1 });
      return;
    }

    const nodes = root.querySelectorAll("[data-step-node]");
    const copy = root.querySelectorAll("[data-step-copy]");

    gsap.set(line, {
      scaleX: isWide() ? 0 : 1,
      scaleY: isWide() ? 1 : 0,
      transformOrigin: isWide() ? "left center" : "top center",
    });
    gsap.set(nodes, { scale: 0.7, opacity: 0 });
    gsap.set(copy, { y: 12, opacity: 0 });

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        gsap.to(line, {
          scaleX: 1,
          scaleY: 1,
          duration: 0.9,
          ease: "power2.out",
        });
        gsap.to(nodes, {
          scale: 1,
          opacity: 1,
          duration: 0.45,
          stagger: 0.15,
          ease: "back.out(1.6)",
          delay: 0.12,
        });
        gsap.to(copy, {
          y: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.12,
          ease: "power2.out",
          delay: 0.28,
        });
        io.disconnect();
      },
      { threshold: 0.25 },
    );
    io.observe(root);
    return () => {
      io.disconnect();
      gsap.killTweensOf([line, ...nodes, ...copy]);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative mx-auto mt-8 max-w-3xl">
      <div
        ref={lineRef}
        className="howto-line pointer-events-none absolute left-5 top-5 h-[calc(100%-2.5rem)] w-px sm:left-[16.66%] sm:right-[16.66%] sm:top-5 sm:h-px sm:w-auto"
        aria-hidden
      />

      <ol className="relative grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-4">
        {steps.map((step, i) => {
          const expanded = open === i;
          return (
            <li
              key={step.title}
              className="relative flex gap-4 sm:flex-col sm:items-center sm:text-center"
            >
              <span
                data-step-node
                className="howto-node relative z-[1] flex size-10 shrink-0 items-center justify-center rounded-full border border-[color:color-mix(in_oklab,var(--accent)_45%,transparent)] bg-[var(--background)] text-[var(--accent)]"
              >
                <StepIcon index={i} />
              </span>
              <div data-step-copy className="min-w-0 flex-1 pt-1 sm:pt-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                  Step {i + 1}
                </p>
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={`howto-step-${i}`}
                  onClick={() => setOpen((cur) => (cur === i ? null : i))}
                  className="mt-1 flex w-full items-center gap-2 text-left sm:pointer-events-none sm:block sm:text-center"
                >
                  <span className="min-w-0 flex-1 text-[15px] font-semibold text-[var(--foreground)]">
                    {step.title}
                  </span>
                  <svg
                    className={`size-4 shrink-0 text-[var(--accent)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none sm:hidden ${
                      expanded ? "rotate-180" : "rotate-0"
                    }`}
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M4 6l4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none sm:grid-rows-[1fr] ${
                    expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="min-h-0 overflow-hidden">
                    <p
                      id={`howto-step-${i}`}
                      className={`mt-1.5 text-[13px] leading-relaxed text-[var(--hero-muted)] transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none sm:translate-y-0 sm:opacity-100 ${
                        expanded
                          ? "translate-y-0 opacity-100"
                          : "-translate-y-1 opacity-0"
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

const TRUST_SIGNALS = [
  { label: "App Store approved", icon: "store" as const },
  { label: "Apple guidelines", icon: "guide" as const },
  { label: "Remove anytime", icon: "remove" as const },
  { label: "Verified install", icon: "check" as const },
];

function TrustSignalIcon({ icon }: { icon: (typeof TRUST_SIGNALS)[number]["icon"] }) {
  const common = {
    className: "size-4",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.75",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };
  if (icon === "store") {
    return (
      <svg {...common}>
        <rect x="5" y="3" width="14" height="18" rx="2.5" />
        <path d="M9 17.5h6" />
        <path d="M12 7v5" />
        <path d="M9.5 9.5L12 12l2.5-2.5" />
      </svg>
    );
  }
  if (icon === "guide") {
    return (
      <svg {...common}>
        <path d="M8 4h9a2 2 0 012 2v14l-5.5-2.5L8 20V4z" />
        <path d="M11 9h5M11 13h4" />
      </svg>
    );
  }
  if (icon === "remove") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="7.5" />
        <path d="M9 12h6" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="7.5" />
      <path d="M8.5 12.5l2.2 2.2 4.8-5" />
    </svg>
  );
}

function TrustedVisual() {
  const rootRef = useRef<HTMLDivElement>(null);
  const shieldRef = useRef<SVGPathElement>(null);
  const checkRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const shield = shieldRef.current;
    const check = checkRef.current;
    if (!root || !shield || !check) return;

    const shieldLen = shield.getTotalLength();
    const checkLen = check.getTotalLength();

    const activate = () => {
      root.classList.add("trusted-active");
      const badges = root.querySelectorAll("[data-trust-badge]");
      if (prefersReducedMotion()) {
        gsap.set(shield, { strokeDasharray: shieldLen, strokeDashoffset: 0 });
        gsap.set(check, { strokeDasharray: checkLen, strokeDashoffset: 0, opacity: 1 });
        gsap.set(badges, { opacity: 1, y: 0 });
        return;
      }
      gsap.set(shield, {
        strokeDasharray: shieldLen,
        strokeDashoffset: shieldLen,
      });
      gsap.set(check, {
        strokeDasharray: checkLen,
        strokeDashoffset: checkLen,
        opacity: 1,
      });
      gsap
        .timeline()
        .to(shield, { strokeDashoffset: 0, duration: 1.15, ease: "power2.inOut" })
        .to(
          check,
          { strokeDashoffset: 0, duration: 0.55, ease: "power2.out" },
          "-=0.2",
        );
      gsap.fromTo(
        badges,
        { y: 14, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.45,
          stagger: 0.1,
          ease: "power2.out",
          delay: 0.35,
        },
      );
    };

    if (prefersReducedMotion()) {
      activate();
      return;
    }

    gsap.set(root.querySelectorAll("[data-trust-badge]"), { opacity: 0, y: 14 });

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        activate();
        io.disconnect();
      },
      { threshold: 0.3 },
    );
    io.observe(root);
    return () => {
      io.disconnect();
      gsap.killTweensOf([shield, check]);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      data-m-item
      className="relative mx-auto w-full max-w-[22rem] md:mx-0 md:justify-self-end"
      aria-hidden
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--accent)_14%,transparent),transparent_62%)]" />

      <div className="relative flex flex-col items-center pt-2">
        <div className="trusted-ring relative flex size-[11.5rem] items-center justify-center">
          <svg
            className="size-[9.5rem]"
            viewBox="0 0 160 180"
            fill="none"
          >
            <path
              ref={shieldRef}
              d="M80 16c22 10 38 12 54 12v52c0 38-24 66-54 80-30-14-54-42-54-80V28c16 0 32-2 54-12z"
              stroke="var(--accent)"
              strokeWidth="3"
              strokeLinejoin="round"
              fill="color-mix(in oklab, var(--accent) 8%, transparent)"
            />
            <path
              ref={checkRef}
              d="M52 88l22 22 36-40"
              stroke="var(--accent)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <ul className="mt-5 grid w-full grid-cols-2 gap-x-3 gap-y-2.5">
          {TRUST_SIGNALS.map((signal) => (
            <li
              key={signal.label}
              data-trust-badge
              className="flex items-center gap-2 text-[12px] font-medium text-[var(--foreground)]/90"
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-[color:color-mix(in_oklab,var(--accent)_35%,transparent)] text-[var(--accent)]">
                <TrustSignalIcon icon={signal.icon} />
              </span>
              {signal.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function FinderAudienceIcon({ index }: { index: number }) {
  const icons = [
    <path key="pen" d="M5 19l3.2-.7L18 8.5 15.5 6 5.7 15.8 5 19zM13.8 7.7l2.5 2.5" strokeLinecap="round" strokeLinejoin="round" />,
    <path key="book" d="M6 6.5A2.5 2.5 0 0 1 8.5 4H19v14H8.5A2.5 2.5 0 0 0 6 20.5V6.5zM6 6.5H8.5" strokeLinecap="round" strokeLinejoin="round" />,
    <><rect key="cam" x="4" y="7" width="16" height="11" rx="2" /><circle cx="12" cy="12.5" r="2.4" /><path d="M9 7l1.2-2h3.6L15 7" strokeLinecap="round" /></>,
    <path key="case" d="M8 8V6.8A1.8 1.8 0 0 1 9.8 5h4.4A1.8 1.8 0 0 1 16 6.8V8M5 8h14v10H5V8z" strokeLinecap="round" strokeLinejoin="round" />,
    <path key="share" d="M8 12a2.2 2.2 0 1 0 0-4.4A2.2 2.2 0 0 0 8 12zm8-5.5a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4zM16 21.5a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4zM9.8 10.2l4.4-2.4M9.8 13.2l4.4 2.5" strokeLinecap="round" />,
    <path key="type" d="M6 7h12M12 7v11M8.5 18h7" strokeLinecap="round" />,
    <><circle key="search" cx="11" cy="11" r="6.2" /><path d="M16 16l4 4" strokeLinecap="round" /></>,
  ];

  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      {icons[index] ?? icons[0]}
    </svg>
  );
}

function FontFinderVisual() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (prefersReducedMotion()) {
      root.classList.add("finder-active");
      return;
    }

    const frame = root.querySelector("[data-finder-frame]");
    const result = root.querySelector("[data-finder-result]");
    const corners = root.querySelectorAll("[data-finder-corner]");

    gsap.set(frame, { opacity: 0, y: 16 });
    gsap.set(result, { opacity: 0, y: 10 });
    gsap.set(corners, { opacity: 0, scale: 0.85 });

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        root.classList.add("finder-active");
        gsap
          .timeline()
          .to(frame, { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" })
          .to(
            corners,
            {
              opacity: 1,
              scale: 1,
              duration: 0.35,
              stagger: 0.06,
              ease: "back.out(1.5)",
            },
            "-=0.2",
          )
          .to(
            result,
            { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
            "-=0.1",
          );
        io.disconnect();
      },
      { threshold: 0.3 },
    );
    io.observe(root);
    return () => {
      io.disconnect();
      gsap.killTweensOf([frame, result, ...corners]);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      data-m-item
      className="relative mx-auto w-full max-w-[22rem] sm:max-w-[26rem] lg:ml-auto lg:mr-0"
      aria-hidden
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_60%_40%,color-mix(in_oklab,var(--accent)_16%,transparent),transparent_70%)]" />

      <div
        data-finder-frame
        className="relative rounded-3xl border border-[color:var(--header-border)] bg-[var(--card-bg)] p-4 shadow-[0_28px_55px_-32px_rgba(0,0,0,0.75)] sm:p-5"
      >
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
          <div className="relative w-[8.25rem] shrink-0 overflow-hidden rounded-2xl border border-[color:var(--header-border)]/80 aspect-[3/4] sm:w-full sm:max-w-[13.75rem]">
            <svg
              className="absolute inset-0 size-full"
              viewBox="0 0 240 320"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <linearGradient id="finder-sky" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#163a46" />
                  <stop offset="55%" stopColor="#0f2a28" />
                  <stop offset="100%" stopColor="#0a1614" />
                </linearGradient>
                <linearGradient id="finder-peak" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8fb8c4" />
                  <stop offset="100%" stopColor="#1d4a4a" />
                </linearGradient>
              </defs>
              <rect width="240" height="320" fill="url(#finder-sky)" />
              <circle cx="178" cy="72" r="22" fill="#d7ece8" opacity="0.35" />
              <path d="M0 210L62 128l48 52 42-78 88 136H0z" fill="url(#finder-peak)" opacity="0.9" />
              <path d="M0 248L78 168l54 44 108 56H0z" fill="#0c221f" />
            </svg>

            <span
              data-finder-corner
              className="absolute left-2 top-2 size-3 border-l-2 border-t-2 border-[var(--accent)] sm:left-3 sm:top-3 sm:size-4"
            />
            <span
              data-finder-corner
              className="absolute right-2 top-2 size-3 border-r-2 border-t-2 border-[var(--accent)] sm:right-3 sm:top-3 sm:size-4"
            />
            <span
              data-finder-corner
              className="absolute bottom-2 left-2 size-3 border-b-2 border-l-2 border-[var(--accent)] sm:bottom-3 sm:left-3 sm:size-4"
            />
            <span
              data-finder-corner
              className="absolute bottom-2 right-2 size-3 border-b-2 border-r-2 border-[var(--accent)] sm:bottom-3 sm:right-3 sm:size-4"
            />

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-3 pt-10 sm:px-4 sm:pb-5 sm:pt-16">
              <p
                className="text-[1.35rem] leading-none tracking-tight text-white sm:text-[2.15rem]"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                Aa
              </p>
              <p
                className="mt-1.5 text-[10px] text-white/80 sm:mt-2 sm:text-[12px]"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                The quick brown fox
              </p>
            </div>

            <div className="pointer-events-none absolute inset-3 overflow-hidden">
              <div className="finder-scan-line absolute inset-x-0 top-0 h-full">
                <div className="h-0.5 w-full bg-[linear-gradient(90deg,transparent,var(--accent),transparent)] shadow-[0_0_12px_var(--accent)]" />
              </div>
            </div>
          </div>

          <svg
            className="hidden h-14 w-8 shrink-0 sm:block"
            viewBox="0 0 32 56"
            fill="none"
          >
            <path
              d="M4 28h24"
              stroke="var(--accent)"
              strokeWidth="1.4"
              strokeDasharray="3 4"
              strokeLinecap="round"
            />
            <circle cx="4" cy="28" r="2.5" fill="var(--accent)" />
            <circle cx="28" cy="28" r="2.5" fill="var(--accent)" />
          </svg>

          <div
            data-finder-result
            className="relative w-full rounded-2xl border border-[color:color-mix(in_oklab,var(--accent)_35%,var(--header-border))] bg-[var(--background)] p-4 shadow-[0_16px_36px_-20px_rgba(0,0,0,0.75)] sm:w-[11.5rem]"
          >
            <span className="finder-match-dot absolute right-3 top-3 size-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
              Match
            </p>
            <p className="mt-1.5 text-lg font-semibold leading-tight text-[var(--foreground)]">
              Serif Display
            </p>
            <p
              className="mt-2 text-[12px] text-[var(--hero-muted)]"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              The quick brown fox
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const FEATURE_GROUPS = [
  {
    label: "Discover",
    blurb: "Preview and find the right typeface before you install.",
    icon: "search" as const,
    items: [
      "Font preview before installation",
      "Search by font name",
      "Search by font style",
      "Font pairing suggestions",
      "Font recommendation tools",
      "Improved font discovery",
    ],
  },
  {
    label: "Organize",
    blurb: "Keep favorites, recents, and collections in one library.",
    icon: "layers" as const,
    items: [
      "Favorite fonts",
      "Recently viewed fonts",
      "Recently installed fonts",
      "Font collections",
      "Font categories",
      "Custom font organization",
    ],
  },
  {
    label: "Manage",
    blurb: "Stay in control of files, shares, and backups.",
    icon: "folder" as const,
    items: [
      "Duplicate font detection",
      "Font metadata and designer information",
      "Font file management",
      "Share font files",
      "Backup and restore options",
    ],
  },
  {
    label: "Workflow",
    blurb: "Compare, preview, and stay in sync across Apple devices.",
    icon: "phone" as const,
    items: [
      "Quick font previews",
      "Dark Mode support",
      "Font comparison tools",
      "Cross-device workflow support",
    ],
  },
];

const IMPORT_CARD_ICONS = [
  "search",
  "download",
  "layers",
  "folder",
] as const;

type AccentCardIconName = (typeof IMPORT_CARD_ICONS)[number] | "phone";

function ImportCardIcon({ name }: { name: AccentCardIconName }) {
  return (
    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)] text-zinc-950">
      <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        {name === "search" ? (
          <>
            <circle cx="11" cy="11" r="6.2" />
            <path d="M16 16l4 4" strokeLinecap="round" />
          </>
        ) : null}
        {name === "download" ? (
          <>
            <path d="M12 4v11" strokeLinecap="round" />
            <path d="M8 11l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5 19h14" strokeLinecap="round" />
          </>
        ) : null}
        {name === "layers" ? (
          <>
            <path d="M12 4l8 4-8 4-8-4 8-4z" strokeLinejoin="round" />
            <path d="M4 12l8 4 8-4" strokeLinecap="round" />
            <path d="M4 16l8 4 8-4" strokeLinecap="round" />
          </>
        ) : null}
        {name === "folder" ? (
          <>
            <path d="M4 7.5h6l2 2H20v9.5H4V7.5z" strokeLinejoin="round" />
            <path d="M12 12v5M12 17l-2-2M12 17l2-2" strokeLinecap="round" strokeLinejoin="round" />
          </>
        ) : null}
        {name === "phone" ? (
          <>
            <rect x="7" y="3.5" width="10" height="17" rx="2" />
            <path d="M11 17.5h2" strokeLinecap="round" />
          </>
        ) : null}
      </svg>
    </span>
  );
}

function MoreFeaturesBoard({ section }: { section: HomeMarketingSection }) {
  const [active, setActive] = useState(0);
  const pausedRef = useRef(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const playRef = useRef<() => void>(() => {});
  const group = FEATURE_GROUPS[active] ?? FEATURE_GROUPS[0];
  const total = FEATURE_GROUPS.reduce((sum, g) => sum + g.items.length, 0);
  const tabCount = FEATURE_GROUPS.length;

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel || prefersReducedMotion()) return;

    let timer: number | undefined;
    let inView = false;

    const stop = () => {
      window.clearTimeout(timer);
      timer = undefined;
    };
    const play = () => {
      stop();
      if (!inView || pausedRef.current) return;
      timer = window.setTimeout(() => {
        setActive((i) => (i + 1) % tabCount);
        play();
      }, 3800);
    };
    playRef.current = play;

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = Boolean(entry?.isIntersecting);
        if (inView) play();
        else stop();
      },
      { threshold: 0.35 },
    );
    io.observe(panel);
    return () => {
      io.disconnect();
      stop();
    };
  }, [tabCount]);

  const pause = () => {
    pausedRef.current = true;
    panelRef.current?.classList.add("is-paused");
  };
  const resume = () => {
    pausedRef.current = false;
    panelRef.current?.classList.remove("is-paused");
    playRef.current();
  };
  const showTab = (index: number) => {
    setActive(index);
  };

  return (
    <div className={`${wrap} relative`}>
      <div className="pointer-events-none absolute -right-10 top-0 h-64 w-64 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent)_14%,transparent),transparent_70%)]" />

      <div className="relative grid grid-cols-1 items-start gap-8 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-10 lg:gap-12">
        <div className="min-w-0 max-md:text-center">
          <p
            data-m-item
            className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--accent)]"
          >
            <span className="size-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent)]" />
            Companion roadmap
          </p>

          <h2 data-m-item className="section-h2 mt-4">
            <AccentTitle text={section.title} />
          </h2>

          <Copy paragraphs={section.paragraphs} />
          <ListIntro text={section.listIntro} />

          <dl
            data-m-item
            className="mt-7 grid grid-cols-2 gap-3 sm:max-w-sm max-md:mx-auto"
          >
            <div className="rounded-2xl border border-[color:var(--header-border)] bg-[var(--header-surface)]/40 px-4 py-3 text-left">
              <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--hero-muted)]">
                Capabilities
              </dt>
              <dd className="mt-1 text-[1.45rem] font-semibold tabular-nums tracking-tight text-[var(--foreground)]">
                {total}
              </dd>
            </div>
            <div className="rounded-2xl border border-[color:var(--header-border)] bg-[var(--header-surface)]/40 px-4 py-3 text-left">
              <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--hero-muted)]">
                Modules
              </dt>
              <dd className="mt-1 text-[1.45rem] font-semibold tabular-nums tracking-tight text-[var(--foreground)]">
                {String(FEATURE_GROUPS.length).padStart(2, "0")}
              </dd>
            </div>
          </dl>

          <div className="mt-8 hidden md:block">
            <Ctas ctas={section.ctas} />
          </div>
        </div>

        <div
          ref={panelRef}
          data-m-item
          onPointerEnter={pause}
          onPointerLeave={resume}
          className="overflow-hidden rounded-[1.6rem] border border-[color:color-mix(in_oklab,var(--accent)_32%,var(--header-border))] bg-[color-mix(in_oklab,var(--accent)_5%,var(--header-surface))] shadow-[0_28px_60px_-32px_rgba(0,0,0,0.78)]"
        >
          <div className="flex items-center gap-3 border-b border-[color:var(--header-border)] px-4 py-3">
            <span className="flex gap-1.5" aria-hidden>
              <span className="size-2 rounded-full bg-[color-mix(in_oklab,var(--foreground)_22%,transparent)]" />
              <span className="size-2 rounded-full bg-[color-mix(in_oklab,var(--foreground)_16%,transparent)]" />
              <span className="size-2 rounded-full bg-[color-mix(in_oklab,var(--accent)_70%,transparent)]" />
            </span>
            <p className="min-w-0 flex-1 truncate text-[12px] font-medium tracking-wide text-[var(--foreground)]/85">
              InstallFont · Manager
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
              Live
            </p>
          </div>
          <span
            key={active}
            className="more-feat-progress block h-px origin-left bg-[var(--accent)]"
            aria-hidden
          />

          <div className="grid grid-cols-1 md:grid-cols-[10.5rem_minmax(0,1fr)] lg:grid-cols-[11.5rem_minmax(0,1fr)]">
            <div
              role="tablist"
              aria-label="Feature modules"
              className="grid grid-cols-2 gap-1.5 border-b border-[color:var(--header-border)] p-2 md:flex md:flex-col md:gap-1 md:border-b-0 md:border-r md:border-[color:var(--header-border)] md:p-3"
            >
              {FEATURE_GROUPS.map((item, i) => {
                const on = i === active;
                return (
                  <button
                    key={item.label}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    tabIndex={on ? 0 : -1}
                    onPointerEnter={() => showTab(i)}
                    onFocus={() => showTab(i)}
                    className={`relative flex min-w-0 items-center gap-2 overflow-hidden rounded-xl px-2.5 py-2 text-left outline-none transition-[background-color,color,box-shadow] duration-200 sm:gap-2.5 sm:px-3 sm:py-2.5 ${
                      on
                        ? "bg-[color-mix(in_oklab,var(--accent)_14%,transparent)] text-[var(--accent)] shadow-[inset_2px_0_0_0_var(--accent)]"
                        : "text-[var(--foreground)]/80 hover:bg-[var(--header-surface)]/55 hover:text-[var(--foreground)]"
                    }`}
                  >
                    <span className={on ? "" : "opacity-70"}>
                      <ImportCardIcon name={item.icon} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[13px] font-semibold tracking-wide">
                        {item.label}
                      </span>
                      <span className="mt-0.5 block text-[10px] tabular-nums tracking-[0.12em] text-[var(--hero-muted)]">
                        {String(item.items.length).padStart(2, "0")} items
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="min-w-0 p-4 sm:p-5">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                  {String(active + 1).padStart(2, "0")} /{" "}
                  {String(FEATURE_GROUPS.length).padStart(2, "0")}
                </p>
                <h3 className="mt-1 text-[1.15rem] font-semibold tracking-[-0.02em] text-[var(--foreground)]">
                  {group.label}
                </h3>
                <p className="mt-1 text-[13px] leading-snug text-[var(--hero-muted)]">
                  {group.blurb}
                </p>
              </div>

              <ol
                key={group.label}
                className="mt-4 divide-y divide-[color:var(--header-border)] overflow-hidden rounded-xl border border-[color:var(--header-border)] bg-[var(--background)]/30"
              >
                {group.items.map((item, i) => (
                  <li
                    key={item}
                    className="more-feat-row flex items-center gap-3 px-3.5 py-2.5"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <span className="w-6 shrink-0 text-[11px] font-semibold tabular-nums tracking-[0.12em] text-[var(--accent)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 text-[13px] font-medium leading-snug text-[var(--foreground)]">
                      {item}
                    </span>
                  </li>
                ))}
              </ol>

              {section.closing ? (
                <p className="mt-4 text-[12px] leading-relaxed text-[var(--hero-muted)]">
                  {section.closing}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center md:hidden">
        <Ctas ctas={section.ctas} center />
      </div>
    </div>
  );
}

function SafariAdjustIcon({ index }: { index: number }) {
  const icons = [
    <text key="aa" x="12" y="16.5" textAnchor="middle" fill="currentColor" fontSize="11" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">Aa</text>,
    <path key="size" d="M7 17V8h4M17 17V8h-4M5 17h6M13 17h6" strokeLinecap="round" strokeLinejoin="round" />,
    <path key="line" d="M6 7h12M6 12h12M6 17h8" strokeLinecap="round" />,
    <path key="letter" d="M6 17L10 7h1l4 10M7.2 14h5.6M16.5 7v10" strokeLinecap="round" strokeLinejoin="round" />,
    <path key="para" d="M7 6h10M7 10h10M7 14h6M7 18h4" strokeLinecap="round" />,
    <path key="color" d="M12 4.8c2.8 3.2 6 6.6 6 9.4A6 6 0 1 1 6 14.2c0-2.8 3.2-6.2 6-9.4z" strokeLinejoin="round" />,
    <path key="fill" d="M7 11l5-6 5 6v6.5a2.5 2.5 0 0 1-5 0V16H9.5A2.5 2.5 0 0 1 7 13.5V11z" strokeLinejoin="round" />,
  ];

  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      {icons[index] ?? icons[0]}
    </svg>
  );
}

const SAFARI_PRESETS: {
  value: string;
  page: CSSProperties;
  themeFill?: boolean;
}[] = [
  {
    value: "Serif",
    page: { fontFamily: "Georgia, 'Times New Roman', serif" },
  },
  {
    value: "18 px",
    page: { fontSize: "1.32rem" },
  },
  {
    value: "1.85",
    page: { lineHeight: 1.85 },
  },
  {
    value: "0.08 em",
    page: { letterSpacing: "0.06em" },
  },
  {
    value: "Relaxed",
    page: { marginBottom: "1.15em" },
  },
  {
    value: "Accent",
    page: { color: "var(--accent)" },
  },
  {
    value: "Theme",
    themeFill: true,
    page: { color: "var(--foreground)" },
  },
];

function SafariReaderBoard({ section }: { section: HomeMarketingSection }) {
  const items = section.bullets ?? [];
  const [active, setActive] = useState(0);
  const pausedRef = useRef(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const playRef = useRef<() => void>(() => {});
  const tabCount = Math.max(items.length, 1);
  const preset = SAFARI_PRESETS[active] ?? SAFARI_PRESETS[0];

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel || prefersReducedMotion()) return;

    let timer: number | undefined;
    let inView = false;

    const stop = () => {
      window.clearTimeout(timer);
      timer = undefined;
    };
    const play = () => {
      stop();
      if (!inView || pausedRef.current) return;
      timer = window.setTimeout(() => {
        setActive((i) => (i + 1) % tabCount);
        play();
      }, 3800);
    };
    playRef.current = play;

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = Boolean(entry?.isIntersecting);
        if (inView) play();
        else stop();
      },
      { threshold: 0.3 },
    );
    io.observe(panel);
    return () => {
      io.disconnect();
      stop();
    };
  }, [tabCount]);

  const pause = () => {
    pausedRef.current = true;
    panelRef.current?.classList.add("is-paused");
  };
  const resume = () => {
    pausedRef.current = false;
    panelRef.current?.classList.remove("is-paused");
    playRef.current();
  };

  const pageStyle: CSSProperties = {
    fontFamily: "ui-sans-serif, system-ui, sans-serif",
    fontSize: "0.95rem",
    lineHeight: 1.5,
    letterSpacing: "0.01em",
    color: "var(--foreground)",
    ...preset.page,
  };

  return (
    <div className={`${wrap} relative`}>
      <div className="relative flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-8">
        <div className="min-w-0">
          <p
            data-m-item
            className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--accent)]"
          >
            <span className="size-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent)]" />
            Safari reading
          </p>
          <h2 data-m-item className="section-h2 mt-2">
            <AccentTitle text={section.title} />
          </h2>
        </div>
        <div className="hidden shrink-0 md:block [&>[data-m-item]]:mt-0">
          <Ctas ctas={section.ctas} compact />
        </div>
      </div>

      {section.paragraphs.length ? (
        <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-2">
          {section.paragraphs.map((p) => (
            <p
              key={p.slice(0, 48)}
              data-m-item
              className="text-[13px] leading-snug text-[var(--hero-muted)]"
            >
              {p.split(/(Install Fonts)/g).map((part, idx) =>
                part === "Install Fonts" ? (
                  <span key={idx} className="font-semibold text-[var(--accent)]">
                    {part}
                  </span>
                ) : (
                  <span key={idx}>{part}</span>
                ),
              )}
            </p>
          ))}
        </div>
      ) : null}

      <div
        ref={panelRef}
        data-m-item
        onPointerEnter={pause}
        onPointerLeave={resume}
        className="safari-hud relative mt-5 overflow-hidden rounded-2xl border border-[color:color-mix(in_oklab,var(--accent)_38%,var(--header-border))] bg-[color-mix(in_oklab,var(--accent)_6%,var(--header-surface))] shadow-[0_0_40px_-18px_color-mix(in_oklab,var(--accent)_45%,transparent)]"
      >
        <span className="safari-hud-corner safari-hud-corner-tl" aria-hidden />
        <span className="safari-hud-corner safari-hud-corner-tr" aria-hidden />
        <span className="safari-hud-corner safari-hud-corner-bl" aria-hidden />
        <span className="safari-hud-corner safari-hud-corner-br" aria-hidden />
        <div className="safari-hud-grid pointer-events-none absolute inset-0" aria-hidden />

        <div className="relative flex items-center gap-3 border-b border-[color:color-mix(in_oklab,var(--accent)_22%,var(--header-border))] px-3 py-2 sm:px-4">
          <span className="flex gap-1" aria-hidden>
            <span className="size-1.5 rounded-full bg-[color-mix(in_oklab,var(--foreground)_28%,transparent)]" />
            <span className="size-1.5 rounded-full bg-[color-mix(in_oklab,var(--foreground)_18%,transparent)]" />
            <span className="size-1.5 rounded-full bg-[var(--accent)]" />
          </span>
          <p className="min-w-0 flex-1 truncate font-mono text-[10px] tracking-[0.14em] text-[var(--hero-muted)]">
            READER.INSTALLFONT.COM / LIVE
          </p>
          <p className="font-mono text-[10px] tabular-nums tracking-[0.16em] text-[var(--accent)]">
            {String(active + 1).padStart(2, "0")} / {String(tabCount).padStart(2, "0")}
          </p>
        </div>
        <span
          key={active}
          className="more-feat-progress relative z-[1] block h-px origin-left bg-[var(--accent)]"
          aria-hidden
        />

        <div className="relative grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_13rem] lg:grid-cols-[minmax(0,1fr)_15.5rem]">
          <div
            className={`safari-reader-page flex flex-col justify-center px-4 py-4 sm:px-6 sm:py-5 ${
              preset.themeFill
                ? "is-theme"
                : "bg-[color-mix(in_oklab,var(--background)_55%,transparent)]"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
                Viewport · Safari
              </p>
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--hero-muted)]">
                {items[active] ?? "Adjust"} · {preset.value}
              </p>
            </div>
            <h3
              className="mt-3 text-[clamp(1.35rem,2.4vw,1.85rem)] font-semibold tracking-[-0.04em]"
              style={pageStyle}
            >
              Fonts that feel like yours
            </h3>
            <p className="mt-2 max-w-xl" style={pageStyle}>
              Safari reading should match how you like to see type - not the
              default a website picked for you.
            </p>
            <p
              className="mt-2 max-w-xl"
              style={{
                ...pageStyle,
                marginBottom: preset.page.marginBottom ?? 0,
              }}
            >
              Change style, size, spacing, and color until the page is
              comfortable to sit with.
            </p>
            {section.closing ? (
              <p className="mt-3 max-w-xl text-[12px] leading-snug text-[var(--hero-muted)]">
                {section.closing.split(/(personalized)/g).map((part, idx) =>
                  part === "personalized" ? (
                    <span key={idx} className="font-semibold text-[var(--accent)]">
                      {part}
                    </span>
                  ) : (
                    <span key={idx}>{part}</span>
                  ),
                )}
              </p>
            ) : null}
          </div>

          <div
            role="tablist"
            aria-label="Safari reading controls"
            className="relative z-[1] grid grid-cols-2 gap-1 border-t border-[color:color-mix(in_oklab,var(--accent)_22%,var(--header-border))] bg-[color-mix(in_oklab,var(--accent)_5%,var(--header-surface-solid))] p-1.5 md:grid-cols-1 md:border-l md:border-t-0"
          >
            {items.map((item, i) => {
              const on = i === active;
              return (
                <button
                  key={item}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  tabIndex={on ? 0 : -1}
                  onPointerEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className={`safari-hud-tab relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left outline-none transition-[background-color,color,box-shadow] duration-200 ${
                    on ? "" : "text-[var(--foreground)]/80"
                  }`}
                >
                  <span className="flex size-6 shrink-0 items-center justify-center opacity-80">
                    <SafariAdjustIcon index={i} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[11px] font-semibold tracking-wide">
                      {item}
                    </span>
                    <span className="mt-0.5 block font-mono text-[10px] tabular-nums tracking-[0.08em] text-[var(--hero-muted)]">
                      {SAFARI_PRESETS[i]?.value ?? "Adjust"}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-center md:hidden">
        <Ctas ctas={section.ctas} center compact />
      </div>
    </div>
  );
}

const FONT_FORMAT_HINTS: Record<string, string> = {
  ".ttf": "TrueType Font",
  ".ttc": "TrueType Collection",
  ".otf": "OpenType Font",
};

function HoverCopy({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out group-hover:grid-rows-[1fr] group-focus-within:grid-rows-[1fr]">
      <div className="min-h-0 overflow-hidden">
        <div className="pt-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
          {children}
        </div>
      </div>
    </div>
  );
}

function ImportFinderPair({ section }: { section: HomeMarketingSection }) {
  const finderTitle = section.subtitle ?? "Identify a Font From an Image";
  const finderLead = section.afterSubtitle?.[0];
  const finderMore = section.afterSubtitle?.slice(1) ?? [];
  const importCta = section.ctas?.[0] ? [section.ctas[0]] : [];
  const finderCta = section.ctas?.[1] ? [section.ctas[1]] : section.ctas?.slice(0, 1) ?? [];

  return (
    <div className={`${wrap} relative`}>
      <div className="pointer-events-none absolute -left-8 -top-10 h-56 w-56 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent)_18%,transparent),transparent_70%)]" />
      <div className="pointer-events-none absolute -right-8 bottom-0 h-48 w-48 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--brand-blue)_14%,transparent),transparent_70%)]" />

      <div className="relative mb-6 flex items-center gap-3 max-md:justify-center">
        <span className="size-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent)]" />
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--accent)]">
          {section.eyebrow ?? "Import + Identify"}
        </p>
        <span className="h-px flex-1 bg-[linear-gradient(90deg,color-mix(in_oklab,var(--accent)_55%,transparent),transparent)] max-md:hidden" />
      </div>

      <div className="relative grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
        <article
          tabIndex={0}
          className="group relative flex flex-col overflow-hidden rounded-2xl border border-[color:color-mix(in_oklab,var(--accent)_32%,var(--header-border))] bg-[color-mix(in_oklab,var(--accent)_5%,var(--header-surface))] p-5 outline-none transition-[border-color,box-shadow] duration-300 hover:border-[color:color-mix(in_oklab,var(--accent)_55%,var(--header-border))] hover:shadow-[0_0_40px_-18px_color-mix(in_oklab,var(--accent)_50%,transparent)] focus-visible:border-[var(--accent)] sm:p-6"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
              <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <path d="M12 4v10" strokeLinecap="round" />
                <path d="M8 10l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5 18h14" strokeLinecap="round" />
              </svg>
              Import
            </p>
            <span className="font-mono text-[10px] tabular-nums tracking-[0.16em] text-[var(--hero-muted)]">
              08
            </span>
          </div>

          <h2 className="section-h2 text-[clamp(1.35rem,2.2vw,1.85rem)]">
            <AccentTitle text={section.title} />
          </h2>
          {section.paragraphs[0] ? (
            <p className="mt-3 text-sm leading-relaxed text-[var(--hero-muted)]">
              {section.paragraphs[0]}
            </p>
          ) : null}
          <HoverCopy>
            {section.paragraphs.slice(1).map((p) => (
              <p key={p.slice(0, 40)} className="text-sm leading-relaxed text-[var(--hero-muted)]">
                {p}
              </p>
            ))}
          </HoverCopy>

          {section.bullets?.length ? (
            <ul className="mt-5 flex flex-wrap gap-2">
              {section.bullets.map((item) => (
                <li
                  key={item}
                  className="group/fmt relative inline-flex items-center gap-2 rounded-full border border-[color:color-mix(in_oklab,var(--accent)_40%,var(--header-border))] px-3 py-1.5 font-mono text-[12px] text-[var(--foreground)]/90"
                >
                  <span className="size-1.5 rounded-full bg-[var(--accent)]" />
                  {item}
                  {FONT_FORMAT_HINTS[item] ? (
                    <span className="hidden text-[10px] font-sans tracking-normal text-[var(--hero-muted)] sm:group-hover/fmt:inline">
                      {FONT_FORMAT_HINTS[item]}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : null}

          {section.blocks?.length ? (
            <div className="mt-5 space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--foreground)]">
                Build your custom iPhone collection
              </p>
              {section.blocks.map((block) => (
                <div
                  key={block.title}
                  className="rounded-xl border border-[color:var(--header-border)] bg-[var(--header-surface)]/40 px-3.5 py-3"
                >
                  <p className="text-[13px] font-semibold text-[var(--foreground)]">
                    {block.title}
                  </p>
                  {block.paragraphs[0] ? (
                    <HoverCopy>
                      <p className="text-[13px] leading-relaxed text-[var(--hero-muted)]">
                        {block.paragraphs[0]}
                      </p>
                    </HoverCopy>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}

          {section.closing ? (
            <HoverCopy>
              <p className="text-[13px] leading-relaxed text-[var(--hero-muted)]">
                {section.closing}
              </p>
            </HoverCopy>
          ) : null}

          <div className="mt-auto pt-5 [&>[data-m-item]]:mt-0">
            <Ctas ctas={importCta} compact />
          </div>
        </article>

        <article
          tabIndex={0}
          className="group relative flex flex-col overflow-hidden rounded-2xl border border-[color:color-mix(in_oklab,var(--accent)_32%,var(--header-border))] bg-[color-mix(in_oklab,var(--accent)_5%,var(--header-surface))] p-5 outline-none transition-[border-color,box-shadow] duration-300 hover:border-[color:color-mix(in_oklab,var(--accent)_55%,var(--header-border))] hover:shadow-[0_0_40px_-18px_color-mix(in_oklab,var(--accent)_50%,transparent)] focus-visible:border-[var(--accent)] sm:p-6"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
              <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <circle cx="11" cy="11" r="6.5" />
                <path d="M16 16l4 4" strokeLinecap="round" />
              </svg>
              Identify
            </p>
            <span className="font-mono text-[10px] tabular-nums tracking-[0.16em] text-[var(--hero-muted)]">
              09
            </span>
          </div>

          <h2 className="section-h2 text-[clamp(1.35rem,2.2vw,1.85rem)]">
            <AccentTitle text={finderTitle} />
          </h2>
          {finderLead ? (
            <p className="mt-3 text-sm leading-relaxed text-[var(--hero-muted)]">
              {finderLead}
            </p>
          ) : null}
          {finderMore.length ? (
            <HoverCopy>
              {finderMore.map((p) => (
                <p key={p.slice(0, 40)} className="text-sm leading-relaxed text-[var(--hero-muted)]">
                  {p}
                </p>
              ))}
            </HoverCopy>
          ) : null}

          {section.labeledItems?.length ? (
            <div className="mt-5">
              {section.listIntro ? (
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--foreground)]">
                  {section.listIntro}
                </p>
              ) : null}
              <ul className="mt-3 flex flex-wrap gap-2">
                {section.labeledItems.map((item) => (
                  <li
                    key={item.label}
                    className="rounded-full border border-[color:color-mix(in_oklab,var(--accent)_28%,var(--header-border))] bg-[var(--header-surface)]/45 px-3 py-1.5 text-[13px] font-medium text-[var(--foreground)]"
                  >
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-auto pt-5 [&>[data-m-item]]:mt-0">
            <Ctas ctas={finderCta} compact />
          </div>
        </article>
      </div>
    </div>
  );
}

function MarketingSection({
  section,
  index,
  openFaq,
  setOpenFaq,
}: {
  section: HomeMarketingSection;
  index: number;
  openFaq: string | null;
  setOpenFaq: (id: string | null) => void;
}) {
  const layout = section.layout ?? "split";
  const soft = index % 2 === 1;

  if (layout === "final") {
    return (
      <Block id={section.id}>
        <div className={wrap}>
          <div
            data-m-item
            className="relative mx-auto max-w-3xl overflow-hidden rounded-[1.75rem] border border-[color:color-mix(in_oklab,var(--accent)_28%,var(--header-border))] bg-[var(--header-surface)]/50 px-6 py-12 text-center shadow-[0_24px_60px_-36px_rgba(0,0,0,0.8)] sm:px-10 sm:py-14"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--accent)_18%,transparent),transparent_68%)]" />
            <div className="pointer-events-none absolute -left-10 top-0 h-40 w-40 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent)_16%,transparent),transparent_70%)]" />
            <h2 className="section-h2 relative">
              <AccentTitle text={section.title} />
            </h2>
            <div className="relative mt-8 flex justify-center sm:mt-10">
              <div className="max-w-full rounded-xl shadow-[0_0_42px_-6px_color-mix(in_oklab,var(--accent)_45%,transparent)] [&>[data-m-item]]:mt-0">
                <Ctas ctas={section.ctas} center compact />
              </div>
            </div>
            <p className="relative mt-4 text-[12px] tracking-wide text-[var(--hero-muted)]">
              App Store · iPhone & iPad
            </p>
          </div>
        </div>
      </Block>
    );
  }

  if (layout === "cta") {
    return (
      <Block id={section.id}>
        <div className={wrap}>
          <div className="w-full text-center">
            <h2 data-m-item className="section-h2">
              <AccentTitle text={section.title} />
            </h2>
          </div>

          {section.paragraphs.length ? (
            <ul className="mt-6 grid grid-cols-1 items-start gap-3 sm:mt-8 sm:grid-cols-2">
              {section.paragraphs.map((p, i) => (
                <li
                  key={p.slice(0, 40)}
                  data-m-item
                  className="rounded-xl border border-[color:var(--header-border)] bg-[var(--header-surface)]/45 p-4 sm:p-5"
                >
                  <span className="text-[11px] font-semibold tabular-nums tracking-[0.16em] text-[var(--accent)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-2.5 text-sm leading-[1.65] text-[var(--hero-muted)]">
                    {p}
                  </p>
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-8 flex justify-center sm:mt-10">
            <Ctas ctas={section.ctas} center />
          </div>
        </div>
      </Block>
    );
  }

  if (layout === "intro") {
    return (
      <Block id={section.id}>
        <div className={`${wrap} text-center`}>
          <Heading
            eyebrow={section.eyebrow}
            title={section.title}
            center
          />
          <Copy paragraphs={section.paragraphs} center />
          <div className="mt-8 flex justify-center sm:mt-10">
            <Ctas ctas={section.ctas} center />
          </div>
        </div>
      </Block>
    );
  }

  if (layout === "faq") {
    return (
      <Block id={section.id} soft={soft}>
        <div className={wrap}>
          <div className="w-full text-center">
            <Heading eyebrow={section.eyebrow} title={section.title} center />
            <Copy paragraphs={section.paragraphs} center />
            <p
              data-m-item
              className="mt-3 text-[13px] text-[var(--hero-muted)]"
            >
              Still have questions?{" "}
              <Link
                href="/contact"
                className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
              >
                Contact us
              </Link>
              .
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:hidden">
            {HOME_FAQ.map((item) => (
              <FaqItem
                key={item.id}
                question={item.question}
                answer={item.answer}
                open={openFaq === item.id}
                onToggle={() =>
                  setOpenFaq(openFaq === item.id ? null : item.id)
                }
              />
            ))}
          </div>
          <div className="mt-8 hidden gap-3 sm:grid sm:grid-cols-2 sm:items-start">
            {[HOME_FAQ.filter((_, i) => i % 2 === 0), HOME_FAQ.filter((_, i) => i % 2 === 1)].map(
              (column, col) => (
                <div key={col} className="flex flex-col gap-3">
                  {column.map((item) => (
                    <FaqItem
                      key={item.id}
                      question={item.question}
                      answer={item.answer}
                      open={openFaq === item.id}
                      onToggle={() =>
                        setOpenFaq(openFaq === item.id ? null : item.id)
                      }
                    />
                  ))}
                </div>
              ),
            )}
          </div>
        </div>
      </Block>
    );
  }

  if (layout === "trusted") {
    return (
      <Block id={section.id} soft={soft}>
        <div className={wrap}>
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[1.15fr_0.85fr] md:gap-10 lg:gap-12">
            <div>
              <Heading eyebrow={section.eyebrow} title={section.title} />
              <Copy paragraphs={section.paragraphs} />
              <Subhead>{section.subtitle}</Subhead>
              <Copy paragraphs={section.afterSubtitle} />

              <div className="mt-10 sm:mt-12 max-md:flex max-md:justify-center">
                <Ctas ctas={section.ctas} compact />
              </div>
            </div>

            <TrustedVisual />
          </div>
        </div>
      </Block>
    );
  }

  if (layout === "import-finder") {
    return (
      <Block id={section.id} soft={soft}>
        <ImportFinderPair section={section} />
      </Block>
    );
  }

  if (layout === "import") {
    const title = section.title;
    const bodyParas = section.afterSubtitle?.slice(0, -1) ?? [];
    const highlight = section.afterSubtitle?.at(-1);

    return (
      <Block id={section.id} soft={soft}>
        <div className={`${wrap} relative`}>
          <div className="pointer-events-none absolute -left-8 -top-10 h-64 w-64 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent)_22%,transparent),transparent_70%)]" />
          <div className="pointer-events-none absolute left-24 top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent)_12%,transparent),transparent_70%)]" />

          <div className="relative grid grid-cols-1 items-start gap-10 md:grid-cols-[0.85fr_1.15fr] md:gap-10 lg:gap-12">
            <div className="max-md:text-center">
              <h2
                data-m-item
                className="section-h2 section-h2-oneline max-md:text-center"
              >
                <AccentTitle text={title} />
              </h2>

              <Subhead>{section.subtitle}</Subhead>
              {bodyParas.length ? <Copy paragraphs={bodyParas} /> : null}

              {highlight ? (
                <div
                  data-m-item
                  className="mt-6 flex items-center gap-3 rounded-2xl border border-[color:var(--header-border)] bg-[var(--header-surface)]/45 p-3.5"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent)] text-zinc-950">
                    <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                      <path d="M8 16h8M12 12v8" strokeLinecap="round" />
                      <path d="M7.5 13a4 4 0 0 1 .4-7.2A5.2 5.2 0 0 1 17.6 8 3.6 3.6 0 0 1 18 15.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <p className="text-sm font-medium leading-relaxed text-[var(--foreground)]">
                    {highlight}
                  </p>
                </div>
              ) : null}

              {section.bullets?.length ? (
                <ul className="mt-6 flex flex-wrap gap-2">
                  {section.bullets.map((item) => (
                    <li
                      key={item}
                      data-m-item
                      className="inline-flex items-center gap-2 rounded-full border border-[color:color-mix(in_oklab,var(--accent)_40%,var(--header-border))] px-3 py-1.5 font-mono text-[12px] text-[var(--foreground)]/90"
                    >
                      <span className="size-1.5 rounded-full bg-[var(--accent)]" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            {section.paragraphs.length ? (
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {section.paragraphs.map((p, i) => (
                  <li
                    key={p.slice(0, 40)}
                    data-m-item
                    className="group relative overflow-hidden rounded-2xl border border-[color:color-mix(in_oklab,var(--accent)_38%,var(--header-border))] bg-[var(--header-surface)]/45 p-4 transition-[transform,background-color,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-[var(--accent)]/50 hover:bg-[var(--header-surface)]/75 hover:shadow-[0_18px_40px_-24px_color-mix(in_oklab,var(--accent)_45%,transparent)]"
                  >
                    <div className="relative z-[1] flex items-start justify-between gap-3">
                      <ImportCardIcon
                        name={IMPORT_CARD_ICONS[i] ?? "search"}
                      />
                      <span className="text-2xl font-semibold tabular-nums leading-none text-[var(--accent)]/35">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <p className="relative z-[1] mt-3 text-[13px] leading-relaxed text-[var(--foreground)]/85">
                      {p}
                    </p>
                    <div className="pointer-events-none absolute -right-6 -top-8 size-24 rounded-full bg-[color-mix(in_oklab,var(--accent)_28%,transparent)] opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="relative mt-10 flex justify-center sm:mt-12">
            <Ctas ctas={section.ctas} center />
          </div>
        </div>
      </Block>
    );
  }

  if (layout === "finder") {
    const title = section.title;
    const featureParas = section.paragraphs.slice(1, 3);
    const leadPara = section.paragraphs[0];

    return (
      <Block id={section.id} soft={soft}>
        <div className={wrap}>
          <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:gap-10 lg:gap-12">
            <div className="min-w-0 max-md:text-center">
              <span
                data-m-item
                className="inline-flex items-center gap-2 rounded-full border border-[color:color-mix(in_oklab,var(--accent)_40%,var(--header-border))] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]"
              >
                <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <circle cx="12" cy="12" r="3.2" />
                  <path d="M12 3v3M12 18v3M3 12h3M18 12h3" strokeLinecap="round" />
                </svg>
                Font Finder
              </span>

              <h2
                data-m-item
                className="section-h2 section-h2-oneline mt-4 max-md:text-center"
              >
                <AccentTitle text={title} />
              </h2>

              {leadPara ? (
                <p
                  data-m-item
                  className="mt-4 max-w-xl text-sm leading-[1.65] text-[var(--hero-muted)] max-md:mx-auto max-md:text-center"
                >
                  {leadPara}
                </p>
              ) : null}

              {featureParas.length ? (
                <ul className="mt-6 space-y-3">
                  {featureParas.map((p, i) => (
                    <li
                      key={p.slice(0, 40)}
                      data-m-item
                      className="flex items-start gap-3 text-left"
                    >
                      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl border border-[color:var(--header-border)] bg-[var(--header-surface)] text-[var(--accent)]">
                        {i === 0 ? (
                          <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                            <circle cx="11" cy="11" r="6.2" />
                            <path d="M16 16l4 4" strokeLinecap="round" />
                          </svg>
                        ) : (
                          <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                            <rect x="3.5" y="6" width="17" height="12.5" rx="2" />
                            <path d="M8 14.5l2.4-2.6 2.2 2.1 2.8-3.4 3.1 3.9" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      <p className="min-w-0 text-sm leading-relaxed text-[var(--foreground)]/90">
                        {p.split(/(Install Font)/g).map((part, idx) =>
                          part === "Install Font" ? (
                            <span key={idx} className="font-semibold text-[var(--accent)]">
                              {part}
                            </span>
                          ) : (
                            <span key={idx}>{part}</span>
                          ),
                        )}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            <div className="w-full md:justify-self-end">
              <FontFinderVisual />
            </div>
          </div>

          {section.listIntro ? (
            <div
              data-m-item
              className="mt-12 flex w-full items-center justify-center gap-3 sm:mt-14"
            >
              <span className="hidden size-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent)] sm:block" />
              <span className="hidden h-px flex-1 bg-[linear-gradient(90deg,color-mix(in_oklab,var(--accent)_55%,transparent),var(--header-border))] sm:block" />
              <p className="w-full text-center text-sm text-[var(--hero-muted)] sm:w-auto sm:shrink-0">
                {section.listIntro}
              </p>
              <span className="hidden h-px flex-1 bg-[linear-gradient(90deg,var(--header-border),color-mix(in_oklab,var(--accent)_55%,transparent))] sm:block" />
              <span className="hidden size-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent)] sm:block" />
            </div>
          ) : null}

          {section.bullets?.length ? (
            <ul className="mx-auto mt-6 flex w-full max-w-sm flex-col gap-2 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center">
              {section.bullets.map((item, i) => (
                <li
                  key={item}
                  data-m-item
                  className={`group inline-flex w-full items-center gap-2 rounded-full border border-[color:color-mix(in_oklab,var(--accent)_28%,var(--header-border))] bg-[var(--header-surface)]/45 px-3 py-2 text-left transition-[transform,border-color,background-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-[var(--accent)]/50 hover:bg-[var(--header-surface)]/75 hover:shadow-[0_12px_28px_-18px_color-mix(in_oklab,var(--accent)_45%,transparent)] sm:w-auto sm:py-1.5 ${
                    i >= 4 ? "max-sm:hidden" : ""
                  }`}
                >
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_16%,transparent)] text-[var(--accent)]">
                    <span className="scale-75">
                      <FinderAudienceIcon index={i} />
                    </span>
                  </span>
                  <span className="min-w-0 text-[13px] font-medium leading-snug text-[var(--foreground)] sm:whitespace-nowrap">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}

          {section.closing ? (
            <div
              data-m-item
              className="mx-auto mt-6 flex max-w-3xl items-center gap-3 rounded-2xl border border-[color:var(--header-border)] bg-[var(--header-surface)]/35 px-4 py-3 sm:px-5"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_16%,transparent)] text-[1.15rem] leading-none text-[var(--accent)]">
                “
              </span>
              <p className="min-w-0 text-[13px] leading-snug text-[var(--hero-muted)]">
                {section.closing}
              </p>
            </div>
          ) : null}

          <div className="mt-10 flex justify-center sm:mt-12">
            <div className="rounded-xl shadow-[0_0_42px_-6px_color-mix(in_oklab,var(--accent)_45%,transparent)] [&>[data-m-item]]:mt-0">
              <Ctas ctas={section.ctas} center />
            </div>
          </div>
        </div>
      </Block>
    );
  }

  if (layout === "management") {
    return (
      <Block id={section.id} soft={soft}>
        <MoreFeaturesBoard section={section} />
      </Block>
    );
  }

  if (layout === "safari") {
    return (
      <Block id={section.id} soft={soft}>
        <SafariReaderBoard section={section} />
      </Block>
    );
  }

  if (layout === "why") {
    return (
      <Block id={section.id} soft={soft}>
        <WhyChooseBoard section={section} />
      </Block>
    );
  }

  if (layout === "library") {
    return (
      <Block id={section.id} soft={soft}>
        <div className={`${wrap} relative`}>
          <div className="relative w-full text-center">
            <span
              data-m-item
              className="inline-flex items-center gap-2 rounded-full border border-[color:color-mix(in_oklab,var(--accent)_40%,var(--header-border))] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]"
            >
              Font Library
            </span>
            <div className="mt-4">
              <Heading eyebrow={section.eyebrow} title={section.title} center />
            </div>
            <Copy paragraphs={section.paragraphs} center />
            <ListIntro text={section.listIntro} />
          </div>

          {section.labeledItems?.length ? (
            <HomeLibraryVisual
              items={section.labeledItems}
              blocks={section.blocks}
            />
          ) : null}

          <Closing text={section.closing} center />

          <div className="relative mt-8 flex justify-center">
            <Ctas ctas={section.ctas} center />
          </div>
        </div>
      </Block>
    );
  }

  if (layout === "devices") {
    return (
      <Block id={section.id} soft={soft}>
        <div className={wrap}>
          <div className="flex items-center gap-3">
            <span className="size-1.5 shrink-0 rounded-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent)]" />
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--accent)]">
              Device index
            </p>
            <span className="h-px flex-1 bg-[linear-gradient(90deg,color-mix(in_oklab,var(--accent)_55%,transparent),transparent)]" />
            <p className="text-[10px] font-medium tabular-nums tracking-[0.18em] text-[var(--hero-muted)]">
              01-06
            </p>
          </div>

          <header data-m-item className="mt-5 w-full max-md:text-center">
            {section.eyebrow ? <Eyebrow>{section.eyebrow}</Eyebrow> : null}
            <h2 className="section-h2 section-h2-oneline">
              <AccentTitle text={section.title} />
            </h2>
          </header>

          <Copy paragraphs={section.paragraphs} />

          {section.subtitle ? (
            <div
              data-m-item
              className="relative mt-6 overflow-hidden rounded-2xl border border-[color:color-mix(in_oklab,var(--accent)_42%,var(--header-border))] bg-[color-mix(in_oklab,var(--accent)_7%,var(--header-surface))] px-5 py-5 shadow-[0_0_36px_-12px_color-mix(in_oklab,var(--accent)_55%,transparent)] sm:px-6 sm:py-6"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_left,color-mix(in_oklab,var(--accent)_16%,transparent),transparent_62%)]" />
              <h3 className="relative text-[1.25rem] font-semibold tracking-[-0.025em] text-[var(--accent)] sm:text-[1.45rem]">
                {section.subtitle}
              </h3>
              {section.afterSubtitle?.length ? (
                <div className="relative mt-2 space-y-2">
                  {section.afterSubtitle.map((p) => (
                    <p
                      key={p.slice(0, 48)}
                      className="text-sm leading-[1.65] text-[var(--foreground)]/80"
                    >
                      {p}
                    </p>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}

          {section.labeledItems?.length ? (
            <>
              {section.listIntro ? (
                <p
                  data-m-item
                  className="mt-8 text-[13px] font-medium text-[var(--hero-muted)] max-md:text-center"
                >
                  {section.listIntro}
                </p>
              ) : null}
              <ul className="mt-3 grid grid-cols-1 border-y border-[color:var(--header-border)] sm:grid-cols-2">
                {section.labeledItems.map((item, i) => (
                  <li
                    key={item.label}
                    data-m-item
                    tabIndex={0}
                    className={`group cursor-default py-4 outline-none sm:px-5 ${
                      i % 2 === 0
                        ? "sm:border-r sm:border-[color:var(--header-border)] sm:pl-0"
                        : "sm:pr-0"
                    } ${
                      i < 4
                        ? "border-b border-[color:var(--header-border)]"
                        : i < section.labeledItems!.length - 1
                          ? "border-b border-[color:var(--header-border)] sm:border-b-0"
                          : ""
                    }`}
                  >
                    <div className="flex items-baseline gap-4">
                      <span className="w-7 shrink-0 text-[11px] font-medium tabular-nums tracking-[0.14em] text-[var(--accent)]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[15px] font-medium tracking-[-0.01em] text-[var(--foreground)] transition-colors duration-300 group-hover:text-[var(--accent)] group-focus-visible:text-[var(--accent)]">
                          {item.label}
                        </p>
                        {item.text ? (
                          <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr]">
                            <p className="min-h-0 overflow-hidden text-[13px] leading-relaxed text-[var(--hero-muted)]">
                              <span className="mt-1.5 block opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                                {item.text}
                              </span>
                            </p>
                          </div>
                        ) : null}
                        <span className="mt-3 block h-px w-8 bg-[var(--header-border)] transition-[width,background-color] duration-300 group-hover:w-16 group-hover:bg-[var(--accent)] group-focus-visible:w-16 group-focus-visible:bg-[var(--accent)]" />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          {section.closing ? (
            <p
              data-m-item
              className="mx-auto mt-8 max-w-2xl text-center text-sm leading-relaxed text-[var(--hero-muted)]"
            >
              {section.closing}
            </p>
          ) : null}

          <div className="mt-5 flex justify-center">
            <Ctas ctas={section.ctas} center />
          </div>
        </div>
      </Block>
    );
  }

  if (layout === "steps") {
    return (
      <Block id={section.id} soft={soft}>
        <div className={wrap}>
          <div className="mb-1 text-center">
            <Heading
              eyebrow={section.eyebrow}
              title={section.title}
              center
            />
          </div>
          {section.steps?.length ? (
            <HowToTimeline steps={section.steps} />
          ) : null}
          <div className="mt-6 flex justify-center sm:mt-6">
            <Ctas ctas={section.ctas} center />
          </div>
        </div>
      </Block>
    );
  }

  if (layout === "reasons") {
    return (
      <Block id={section.id} soft={soft}>
        <div className={wrap}>
          <div className="mb-5 text-center">
            <Heading
              eyebrow={section.eyebrow}
              title={section.title}
              center
            />
            {section.paragraphs[0] ? (
              <p
                data-m-item
                className="mx-auto mt-2 max-w-xl text-sm text-[var(--hero-muted)]"
              >
                {section.paragraphs[0]}
              </p>
            ) : null}
          </div>
          <ol className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {section.reasons?.map((r, i) => (
              <li
                key={r.title}
                data-m-item
                className="flex gap-3 rounded-xl border border-[color:var(--header-border)]/70 bg-[var(--header-surface)]/30 px-3.5 py-3"
              >
                <span className="text-xs font-bold tabular-nums text-[var(--accent)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-[var(--foreground)]">
                    {r.title}
                  </h3>
                  <p className="mt-0.5 text-[13px] leading-snug text-[var(--hero-muted)]">
                    {r.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <div className="flex justify-center">
            <Ctas ctas={section.ctas} center />
          </div>
        </div>
      </Block>
    );
  }

  if (layout === "features") {
    return (
      <Block id={section.id} soft={soft}>
        <div className={wrap}>
          <div className="mb-6 text-center sm:mb-8">
            <Heading
              eyebrow={section.eyebrow}
              title={section.title}
              center
            />
            <Copy paragraphs={section.paragraphs} center />
          </div>

          <HomeDiscoverFontCards />

          <div className="mt-8 flex w-full justify-center sm:mt-10">
            <Ctas ctas={section.ctas} center stack />
          </div>
        </div>
      </Block>
    );
  }

  if (layout === "maker") {
    return (
      <Block id={section.id} soft={soft}>
        <div className={wrap}>
          <HomeFontPlayground
            intro={
              <div className="max-md:text-center">
                <h2 className="section-h2 max-md:text-center">
                  <AccentTitle text={section.title} />
                </h2>
                <Copy paragraphs={section.paragraphs.slice(0, 3)} />
              </div>
            }
          />

          <div className="mt-8 flex justify-center">
            <Ctas ctas={section.ctas} center />
          </div>
        </div>
      </Block>
    );
  }

  if (layout === "list") {
    return (
      <Block id={section.id} soft={soft}>
        <div className={wrap}>
          <Heading eyebrow={section.eyebrow} title={section.title} />
          <Copy paragraphs={section.paragraphs} />
          {section.subtitle ? (
            <h3
              data-m-item
              className="mt-5 text-[15px] font-semibold text-[var(--foreground)]"
            >
              {section.subtitle}
            </h3>
          ) : null}
          {section.labeledItems?.length ? (
            <ItemGrid items={section.labeledItems} />
          ) : null}
          {section.bullets?.length ? (
            section.id === "more-features" ? (
              <ChipRow items={section.bullets} />
            ) : (
              <ul className="mt-3 space-y-1.5">
                {section.bullets.map((b) => (
                  <li
                    key={b}
                    data-m-item
                    className="flex gap-2 text-sm text-[var(--foreground)]/85"
                  >
                    <span className="mt-[0.45rem] size-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                    {b}
                  </li>
                ))}
              </ul>
            )
          ) : null}
          {section.id === "more-features" ? (
            <p
              data-m-item
              className="mt-4 text-sm text-[var(--hero-muted)]"
            >
              These features can make it easier to move from font discovery to
              actual design work.
            </p>
          ) : null}
          <Ctas ctas={section.ctas} />
        </div>
      </Block>
    );
  }

  // Former "split" sections → single-column stacked layout (no orphan side card)
  const chips = highlightChips(section);

  return (
    <Block id={section.id} soft={soft}>
      <div className={wrap}>
        <Heading eyebrow={section.eyebrow} title={section.title} />
        <Copy paragraphs={section.paragraphs} />
        {chips.length ? <ChipRow items={chips} /> : null}
        {section.subtitle ? (
          <h3
            data-m-item
            className="mt-4 text-[15px] font-semibold text-[var(--foreground)]"
          >
            {section.subtitle}
          </h3>
        ) : null}
        <Ctas ctas={section.ctas} />
      </div>
    </Block>
  );
}

export function HomeMarketingSections() {
  const [openFaq, setOpenFaq] = useState<string | null>(HOME_FAQ[0]?.id ?? null);

  return (
    <div className="flex flex-col">
      {HOME_MARKETING_SECTIONS.map((section, index) => (
        <MarketingSection
          key={section.id}
          section={section}
          index={index}
          openFaq={openFaq}
          setOpenFaq={setOpenFaq}
        />
      ))}
    </div>
  );
}

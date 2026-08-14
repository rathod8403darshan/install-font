"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { PREVIEW_FONT_META } from "@/fonts/preview-fonts";
import {
  isCoarseOrNarrow,
  prefersReducedMotion,
} from "@/lib/motion";
import { APP_STORE_IFONT_URL } from "@/lib/mobile-app-links";
import { AppleMark } from "@/components/MobileAppStoreIcons";

type FloatProps = {
  text: string;
  family: string;
  previewClassName: string;
  positionClass: string;
  floatClass: string;
  glow: "accent" | "cyan" | "violet";
};

function FloatingPreview({
  text,
  family,
  previewClassName,
  positionClass,
  floatClass,
  glow,
}: FloatProps) {
  const ring = {
    accent:
      "shadow-[0_24px_60px_-24px_color-mix(in_oklab,var(--accent)_55%,transparent)]",
    cyan: "shadow-[0_24px_60px_-24px_color-mix(in_oklab,var(--accent-2)_55%,transparent)]",
    violet:
      "shadow-[0_24px_60px_-24px_color-mix(in_oklab,var(--accent-3)_45%,transparent)]",
  }[glow];

  return (
    <div
      data-hero-card
      className={`group/float overflow-hidden rounded-2xl border border-[color:var(--card-border)] bg-[var(--card-bg)] p-4 backdrop-blur-md sm:p-5 ${ring} ${positionClass} ${floatClass}`}
    >
      <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--header-muted)]">
        <span>{family}</span>
        <span className="size-1.5 rounded-full bg-[var(--accent)]" />
      </div>
      <div
        className={`mt-2.5 text-[clamp(1.75rem,3.5vw,2.75rem)] leading-none text-[var(--foreground)] ${previewClassName}`}
      >
        {text}
      </div>
      <div className="mt-2.5 flex items-center justify-between text-[10px] text-[var(--header-muted)]">
        <span>Aa Bb Cc 0123</span>
        <span className="opacity-60">Free · Variable</span>
      </div>
    </div>
  );
}

function HeroFontCards() {
  return (
    <div
      className="relative mx-auto h-[min(52vh,22rem)] w-full max-w-[22rem] lg:h-[min(62vh,30rem)] lg:max-w-[32rem] xl:max-w-[36rem]"
      aria-hidden
    >
      <div className="pointer-events-none absolute -left-6 top-8 size-40 rounded-full bg-[var(--accent-2)]/20 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-1/3 size-44 rounded-full bg-[var(--accent-3)]/18 blur-3xl" />
      <div className="pointer-events-none absolute bottom-4 left-1/4 size-36 rounded-full bg-[var(--accent)]/22 blur-3xl" />

      <FloatingPreview
        text="Aurora"
        family="Cinzel"
        previewClassName={PREVIEW_FONT_META.cinzel.className}
        positionClass="absolute left-0 top-0 z-[1] w-[72%]"
        floatClass="hero-float-a"
        glow="cyan"
      />
      <FloatingPreview
        text="Pacific"
        family="Pacifico"
        previewClassName={PREVIEW_FONT_META.pacifico.className}
        positionClass="absolute right-0 top-[28%] z-[2] w-[74%]"
        floatClass="hero-float-b"
        glow="violet"
      />
      <FloatingPreview
        text="BOLT"
        family="Bebas Neue"
        previewClassName={PREVIEW_FONT_META.bebas.className}
        positionClass="absolute bottom-0 left-[6%] z-[3] w-[74%]"
        floatClass="hero-float-c"
        glow="accent"
      />
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
      content.querySelectorAll<HTMLElement>("[data-hero-item]"),
    );
    const cards = Array.from(
      visual.querySelectorAll<HTMLElement>("[data-hero-card]"),
    );

    if (prefersReducedMotion() || isCoarseOrNarrow()) {
      gsap.set([...items, ...cards], {
        opacity: 1,
        y: 0,
        clearProps: "transform",
      });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(items, { opacity: 0, y: 22 });
      gsap.set(cards, { opacity: 0, y: 28 });

      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.07,
        ease: "power3.out",
      });
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.12,
        delay: 0.2,
        ease: "power3.out",
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="page-px relative overflow-hidden py-9 sm:py-11"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,color-mix(in_oklab,var(--accent)_8%,transparent),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,color-mix(in_oklab,var(--brand-blue)_10%,transparent),transparent_50%)]" />

      <div className="relative z-10 mx-auto grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
        <div ref={contentRef} className="relative z-10 w-full max-w-2xl text-center lg:max-w-none lg:text-left">
          <h1
            data-hero-item
            className="text-balance text-[clamp(1.85rem,4.6vw,3.15rem)] font-semibold leading-[1.08] tracking-[-0.04em] text-[var(--foreground)]"
          >
            Fonts For{" "}
            <span className="font-shimmer">iPhone</span>
            {" – "}
            Install, Create &amp; Customize Fonts on iPhone and iPad
          </h1>

          <p
            data-hero-item
            className="mt-4 text-pretty text-sm leading-relaxed text-[var(--hero-muted)] sm:text-[15px] sm:leading-relaxed"
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
            in seconds — no design skills needed. Just download, tap, and
            transform your screen.
          </p>

          <div
            data-hero-item
            className="mt-6 flex flex-col items-stretch gap-3 sm:mt-7 sm:flex-row sm:items-center sm:justify-center lg:justify-start"
          >
            <a
              href={APP_STORE_IFONT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-zinc-950 shadow-[0_16px_40px_-16px_color-mix(in_oklab,var(--accent)_55%,transparent)] transition-[filter,transform] hover:-translate-y-px hover:brightness-110 active:scale-[0.98]"
            >
              <AppleMark className="size-5" />
              Download Install Font on the App Store
            </a>
          </div>
        </div>

        <div
          ref={visualRef}
          className="relative mx-auto hidden min-h-0 w-full lg:block"
        >
          <HeroFontCards />
        </div>
      </div>
    </section>
  );
}

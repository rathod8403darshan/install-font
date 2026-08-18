/** Client-only motion / interaction helpers for performance. */

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Fine pointer + hover capability (skip heavy hover FX on touch). */
export function prefersFinePointer(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

export function isCoarseOrNarrow(): boolean {
  if (typeof window === "undefined") return false;
  return (
    !prefersFinePointer() ||
    window.matchMedia("(max-width: 1023px)").matches
  );
}

/** rAF-throttled scroll listener; returns cleanup. */
export function onScrollThrottled(
  handler: () => void,
  options?: { leading?: boolean },
): () => void {
  let ticking = false;
  let lastY = -1;

  const run = () => {
    ticking = false;
    const y = window.scrollY;
    if (y === lastY && !options?.leading) return;
    lastY = y;
    handler();
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(run);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  if (options?.leading !== false) onScroll();

  return () => window.removeEventListener("scroll", onScroll);
}

type ScrollSubscriber = (scrolling: boolean) => void;

let scrollIdleTimer: ReturnType<typeof setTimeout> | undefined;
let scrollIsActive = false;
let scrollListenerCount = 0;
let scrollCleanup: (() => void) | undefined;

function notifyScrollSubscribers(scrolling: boolean) {
  if (scrollIsActive === scrolling) return;
  scrollIsActive = scrolling;
  document.documentElement.classList.toggle("is-scrolling", scrolling);
  scrollSubscribers.forEach((fn) => fn(scrolling));
}

const scrollSubscribers = new Set<ScrollSubscriber>();

/** Single shared scroll-idle listener (avoids duplicate window listeners). */
export function subscribeScrolling(
  onChange: (scrolling: boolean) => void,
  idleMs = 120,
): () => void {
  scrollSubscribers.add(onChange);

  if (scrollListenerCount === 0) {
    scrollCleanup = onScrollThrottled(() => {
      notifyScrollSubscribers(true);
      clearTimeout(scrollIdleTimer);
      scrollIdleTimer = setTimeout(
        () => notifyScrollSubscribers(false),
        idleMs,
      );
    });
  }
  scrollListenerCount += 1;

  return () => {
    scrollSubscribers.delete(onChange);
    scrollListenerCount -= 1;
    if (scrollListenerCount <= 0) {
      scrollListenerCount = 0;
      scrollCleanup?.();
      scrollCleanup = undefined;
      clearTimeout(scrollIdleTimer);
      notifyScrollSubscribers(false);
    }
  };
}

/**
 * Scroll-reveal for card lists (IntersectionObserver only - no resize scans).
 */
export function observeCardReveal(
  root: HTMLElement,
  selector: string,
  staggerMs = 28,
): () => void {
  const cards = Array.from(root.querySelectorAll<HTMLElement>(selector)).filter(
    (el) => getComputedStyle(el).display !== "none",
  );
  if (!cards.length) return () => {};

  const reveal = (el: HTMLElement) => {
    el.classList.add("is-revealed");
  };

  if (prefersReducedMotion() || isCoarseOrNarrow()) {
    cards.forEach(reveal);
    return () => {};
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        const idx = Number(el.dataset.revealIdx ?? 0);
        window.setTimeout(() => reveal(el), idx * staggerMs);
        observer.unobserve(el);
      });
    },
    { rootMargin: "0px 0px 25% 0px", threshold: 0 },
  );

  cards.forEach((card, i) => {
    card.dataset.revealIdx = String(Math.min(i, 8));
    observer.observe(card);
  });

  return () => observer.disconnect();
}

/** CSS hover tilt is applied via globals; no JS listeners. */
export function attachCardTilt(_el: HTMLElement): () => void {
  return () => {};
}

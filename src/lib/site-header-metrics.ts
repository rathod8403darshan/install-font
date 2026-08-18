/**
 * Records header bar height only. Main-column padding must NOT use
 * getBoundingClientRect().bottom - that value shrinks while scrolling when the
 * header docks and causes content to jump under the fixed header.
 */
export function updateSiteHeaderMetrics(headerEl: HTMLElement | null) {
  if (!headerEl || typeof document === "undefined") return;

  const height = Math.ceil(headerEl.getBoundingClientRect().height);
  document.documentElement.style.setProperty("--site-header-measured", `${height}px`);
}

export function subscribeSiteHeaderMetrics(headerEl: HTMLElement) {
  const update = () => updateSiteHeaderMetrics(headerEl);

  update();
  const ro = new ResizeObserver(update);
  ro.observe(headerEl);
  window.addEventListener("resize", update, { passive: true });

  return () => {
    ro.disconnect();
    window.removeEventListener("resize", update);
  };
}

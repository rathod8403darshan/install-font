"use client";

import { useEffect, useRef } from "react";
import { prefersFinePointer, prefersReducedMotion } from "@/lib/motion";

export function AmbientBackground() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion() || !prefersFinePointer()) return;

    const mq = window.matchMedia("(min-width: 1024px)");
    let raf = 0;
    let lastX = -1;
    let lastY = -1;

    const onMove = (e: PointerEvent) => {
      if (!mq.matches) return;
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      if (Math.abs(x - lastX) < 0.4 && Math.abs(y - lastY) < 0.4) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        lastX = x;
        lastY = y;
        root.style.setProperty("--mx", `${x.toFixed(1)}%`);
        root.style.setProperty("--my", `${y.toFixed(1)}%`);
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="ambient-bg pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={
        {
          ["--mx" as never]: "50%",
          ["--my" as never]: "30%",
        } as React.CSSProperties
      }
    >
      <div className="absolute inset-0 bg-[var(--background)]" />

      <div className="ambient-blob ambient-blob-drift-1 absolute left-[-18%] top-[-15%] h-[55vw] max-h-[360px] w-[55vw] max-w-[360px] rounded-full bg-[var(--accent)]/10 md:max-h-[520px] md:max-w-[520px] 2xl:max-h-[560px] 2xl:max-w-[560px]" />
      <div className="ambient-blob ambient-blob-drift-2 absolute right-[-15%] top-[18%] h-[40vw] max-h-[300px] w-[40vw] max-w-[300px] rounded-full bg-[var(--brand-blue)]/10 md:max-h-[420px] md:max-w-[420px] 2xl:max-h-[480px] 2xl:max-w-[480px]" />
      <div className="ambient-blob ambient-blob-drift-3 absolute bottom-[-18%] left-[22%] h-[38vw] max-h-[280px] w-[38vw] max-w-[280px] rounded-full bg-[var(--accent-3)]/8 md:max-h-[400px] md:max-w-[400px] 2xl:max-h-[440px] 2xl:max-w-[440px]" />

      <div
        className="ambient-grid absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse 80% 70% at 50% 28%, black 0%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 70% at 50% 28%, black 0%, transparent 75%)",
        }}
      />

      <div className="ambient-spotlight absolute inset-0" />

      <div className="noise-overlay hidden md:block absolute inset-0 opacity-40 mix-blend-overlay" />
    </div>
  );
}
